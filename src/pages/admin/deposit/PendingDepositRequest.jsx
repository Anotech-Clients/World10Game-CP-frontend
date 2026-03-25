import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
  IconButton,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  styled,
  Tabs,
  Tab
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Check, Close, Search, Refresh } from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          background: '#0f172a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.12)',
          color: '#f8fafc',
        },
        head: {
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          color: '#f8fafc',
          fontWeight: 600,
        }
      },
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  padding: '16px',
}));

function PendingDepositRequest() {
  const { axiosInstance } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0); // 0 for UPI, 1 for USDT

  const [filters, setFilters] = useState({
    utrNumber: '',
    searchUserId: '',
  });

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const depositMethod = activeTab === 0 ? 'UPI' : 'USDT';
      const response = await axiosInstance.get('/api/wallet/deposit/admin/all', {
        params: {
          page: page + 1,
          pageSize: rowsPerPage,
          status: 'PENDING',
          method: depositMethod,
          utrNumber: filters.utrNumber || undefined,
          searchUserId: filters.searchUserId || undefined,
          paymentGatewayName: 'NA'
        },
      });
      setDeposits(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch deposits',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [page, rowsPerPage, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset pagination when switching tabs
  };

  const handleProcessDeposit = async (status) => {
    try {
      await axiosInstance.post('/api/wallet/deposit/admin/process', {
        depositId: selectedDeposit.depositId,
        status: status,
      });
      setSnackbar({
        open: true,
        message: `Deposit ${status.toLowerCase()} successfully`,
        severity: 'success',
      });
      setOpenDialog(false);
      fetchDeposits();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to process deposit',
        severity: 'error',
      });
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderUpiTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>Deposit ID</StyledTableCell>
          <StyledTableCell>User Details</StyledTableCell>
          <StyledTableCell>Amount</StyledTableCell>
          <StyledTableCell>Date & Time</StyledTableCell>
          <StyledTableCell>UTR Number</StyledTableCell>
          <StyledTableCell>Status</StyledTableCell>
          <StyledTableCell align="right">Actions</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        ) : deposits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No pending UPI deposits found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          deposits.map((deposit) => (
            <TableRow key={deposit.depositId} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {deposit.depositId}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {deposit.user.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {deposit.userId} • {deposit.user.mobile}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                  pkr {Number(deposit.depositAmount).toLocaleString('en-IN')}
                </Typography>
              </TableCell>
              <TableCell>
                {formatDateTime(deposit.depositDate)}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                  {deposit.utrNumber || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={deposit.depositStatus}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => {
                    setSelectedDeposit(deposit);
                    setOpenDialog(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  <Check />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedDeposit(deposit);
                    setOpenDialog(true);
                  }}
                >
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderUsdtTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>Deposit ID</StyledTableCell>
          <StyledTableCell>User Details</StyledTableCell>
          <StyledTableCell>Amount (pkr )</StyledTableCell>
          <StyledTableCell>USDT Details</StyledTableCell>
          <StyledTableCell>Date & Time</StyledTableCell>
          <StyledTableCell>TX Hash/UTR</StyledTableCell>
          <StyledTableCell>Status</StyledTableCell>
          <StyledTableCell align="right">Actions</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        ) : deposits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No pending USDT deposits found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          deposits.map((deposit) => (
            <TableRow key={deposit.depositId} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {deposit.depositId}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {deposit.user.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {deposit.userId} • {deposit.user.mobile}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                  pkr {Number(deposit.depositAmount).toLocaleString('en-IN')}
                </Typography>
              </TableCell>
              <TableCell>
                {/* Extract USDT amount and rate from remarks */}
                <Typography variant="body2">
                  {deposit.remarks ? (
                    deposit.remarks.includes('USDT Amount') ? 
                      deposit.remarks :
                      'USDT Details Not Available'
                  ) : 'USDT Details Not Available'}
                </Typography>
              </TableCell>
              <TableCell>
                {formatDateTime(deposit.depositDate)}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                  {deposit.utrNumber || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={deposit.depositStatus}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => {
                    setSelectedDeposit(deposit);
                    setOpenDialog(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  <Check />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedDeposit(deposit);
                    setOpenDialog(true);
                  }}
                >
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh', borderRadius: '16px' }}>
        <Typography fontSize={28} sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
          Pending Deposits
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 100,
                px: 4,
              },
            }}
          >
            <Tab label="UPI Deposits" />
            <Tab label="USDT Deposits" />
          </Tabs>
        </Paper>

        <Paper sx={{ mb: 3, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={activeTab === 0 ? "UTR Number" : "TX Hash/UTR Number"}
                name="utrNumber"
                value={filters.utrNumber}
                onChange={handleFilterChange}
                placeholder={activeTab === 0 ? "Search by UTR" : "Search by TX Hash/UTR"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="User ID"
                name="searchUserId"
                value={filters.searchUserId}
                onChange={handleFilterChange}
                placeholder="Search by User ID"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={fetchDeposits}
                sx={{ height: '56px' }}
              >
                Search Records
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper>
          <TableContainer
            sx={{
              overflowX: 'auto', 
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {activeTab === 0 ? renderUpiTable() : renderUsdtTable()}
          </TableContainer>
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />
        </Paper>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: { borderRadius: '12px', bgcolor:"#0f172a" }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Process {activeTab === 0 ? 'UPI' : 'USDT'} Deposit</DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                Are you sure you want to process the following deposit?
              </Typography>
              <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)', p: 2, borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    <strong>Deposit ID:</strong> {selectedDeposit?.depositId}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    <strong>User:</strong> {selectedDeposit?.user?.userName} (ID: {selectedDeposit?.userId})
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    <strong>Amount:</strong> pkr {Number(selectedDeposit?.depositAmount).toLocaleString('en-IN')}
                  </Typography>
                  {activeTab === 1 && selectedDeposit?.remarks && (
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      <strong>USDT Details:</strong> {selectedDeposit?.remarks}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: 'text.primary' , wordBreak: 'break-all' }}>
                    <strong>{activeTab === 0 ? 'UTR' : 'TX Hash/UTR'}:</strong> {selectedDeposit?.utrNumber || 'Not provided'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleProcessDeposit('SUCCESS')}
              sx={{ ml: 1 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleProcessDeposit('CANCELLED')}
              sx={{ ml: 1 }}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default PendingDepositRequest;