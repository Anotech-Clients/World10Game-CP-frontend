import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Grid,
  CircularProgress,
  Chip,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
      color: '#f8fafc',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#f8fafc',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.12)',
          padding: '16px',
          color: '#f8fafc',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          color: '#f8fafc',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        colorSuccess: {
          backgroundColor: alpha('#4caf50', 0.1),
          color: '#2e7d32',
        },
        colorError: {
          backgroundColor: alpha('#f44336', 0.1),
          color: '#d32f2f',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          padding: '16px',
        },
      },
    },
  },
});

function PaymentDetailsModal({ open, onClose, details, method }) {
  const styles = {
    dialogTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 0 16px 0',
    },
    closeButton: {
      color: '#f8fafc',
    },
    content: {
      padding: '20px',
      paddingTop: '10px',
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.12)',
    },
    detailRow: {
      padding: '10px 0 0 0',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'flex-start',
      marginBottom: '16px',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    label: {
      fontWeight: 600,
      minWidth: '140px',
      color: '#f8fafc',
      marginBottom: { xs: '4px', sm: '0' },
    },
    value: {
      flex: 1,
      color: '#94a3b8',
      wordBreak: 'break-all',
    },
    icon: {
      marginRight: '8px',
      verticalAlign: 'middle',
      color: '#6366f1',
    },
  };

  const renderBankDetails = () => (
    <>
      <Box sx={styles.detailRow}>
        <Typography variant="body2" sx={styles.label}>Account Name:</Typography>
        <Typography variant="body2" sx={styles.value}>{details.bankDetails.accountName}</Typography>
      </Box>
      <Box sx={styles.detailRow}>
        <Typography variant="body2" sx={styles.label}>Account Number:</Typography>
        <Typography variant="body2" sx={styles.value}>{details.bankDetails.accountNumber}</Typography>
      </Box>
      <Box sx={styles.detailRow}>
        <Typography variant="body2" sx={styles.label}>IFSC Code:</Typography>
        <Typography variant="body2" sx={styles.value}>{details.bankDetails.ifscCode}</Typography>
      </Box>
      <Box sx={styles.detailRow}>
        <Typography variant="body2" sx={styles.label}>Bank Name:</Typography>
        <Typography variant="body2" sx={styles.value}>{details.bankDetails.bankName}</Typography>
      </Box>
    </>
  );

  const renderCryptoDetails = () => (
    <>
      {details.cryptoDetails.map((crypto, index) => (
        <Box key={index} sx={{ mb: index !== details.cryptoDetails.length - 1 ? 3 : 0 }}>
          <Box sx={styles.detailRow}>
            <Typography variant="body2" sx={styles.label}>Network:</Typography>
            <Typography variant="body2" sx={styles.value}>{crypto.network}</Typography>
          </Box>
          <Box sx={styles.detailRow}>
            <Typography variant="body2" sx={styles.label}>Address:</Typography>
            <Typography variant="body2" sx={styles.value}>{crypto.address}</Typography>
          </Box>
          <Box sx={styles.detailRow}>
            <Typography variant="body2" sx={styles.label}>Alias:</Typography>
            <Typography variant="body2" sx={styles.value}>{crypto.alias}</Typography>
          </Box>
        </Box>
      ))}
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {method === 'BANK_TRANSFER' ? (
            <AccountBalanceIcon sx={styles.icon} />
          ) : (
            <CurrencyBitcoinIcon sx={styles.icon} />
          )}
          <Typography variant="h6">
            {method === 'BANK_TRANSFER' ? 'Bank Transfer Details' : 'Crypto Payment Details'}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content} >
        {method === 'BANK_TRANSFER' ? renderBankDetails() : renderCryptoDetails()}
      </DialogContent>
    </Dialog>
  );
}

function AllWithdraws() {
  const { axiosInstance } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const twoDaysAgo = startOfDay(subDays(today, 2));

  const [filters, setFilters] = useState({
    startDate: format(twoDaysAgo, 'yyyy-MM-dd'),
    endDate: format(todayEnd, 'yyyy-MM-dd'),
    status: 'COMPLETED',
    userId: '',
  });

  const statusOptions = [
    { value: 'COMPLETED', label: 'Completed', color: 'success' },
    { value: 'REJECTED', label: 'Rejected', color: 'error' },
  ];

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/wallet/withdraw/admin/all', {
        params: {
          startDate: `${filters.startDate}T00:00:00`,
          endDate: `${filters.endDate}T23:59:59`,
          status: filters.status,
          userId: filters.userId || undefined,
          page: pagination.currentPage + 1,
          pageSize: pagination.pageSize,
        },
      });

      setWithdrawals(response.data.data);
      setPagination({
        currentPage: response.data.pagination.currentPage - 1,
        pageSize: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalItems,
      });
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      currentPage: 0,
    }));
  };

  const handleOpenDetails = (withdrawal) => {
    setSelectedPayment({
      details: withdrawal.paymentDetails,
      method: withdrawal.withdrawMethod,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'background.default',
        minHeight: '100vh',
        borderRadius: '16px'
      }}>
        <Typography variant="h4" gutterBottom sx={{
          color: 'text.primary',
          mb: 2
        }}>
          Withdrawal Management
        </Typography>
        <Paper sx={{
          p: 2,
          mb: 2,
          borderRadius: '16px',
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="Start Date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="End Date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Chip
                      label={option.label}
                      color={option.color}
                      size="small"
                      sx={{ minWidth: '80px' }}
                    />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 280px)'
        }}>
          <TableContainer sx={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            flex: 1,
            overflow: 'auto'
          }}>
            <Table sx={{
              minWidth: 650,
              '& .MuiTableCell-root': {
                py: 1.5,
                px: 2
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} thickness={4} />
                    </TableCell>
                  </TableRow>
                ) : withdrawals.map((withdrawal) => (
                  <TableRow
                    key={withdrawal.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {withdrawal.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {withdrawal.userId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        pkr {withdrawal.withdrawAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {withdrawal.withdrawMethod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={withdrawal.withdrawStatus}
                        color={withdrawal.withdrawStatus === 'COMPLETED' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {format(new Date(withdrawal.withdrawDate), 'dd MMM yyyy HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDetails(withdrawal)}
                        sx={{
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && withdrawals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        No withdrawal records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            backgroundColor: 'background.paper',
            position: 'sticky',
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <TablePagination
              component="div"
              count={pagination.totalItems}
              page={pagination.currentPage}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.pageSize}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                '.MuiTablePagination-select': {
                  borderRadius: '8px',
                },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  color: 'text.primary',
                }
              }}
            />
          </Box>
        </Paper>

        {selectedPayment && (
          <PaymentDetailsModal
            open={Boolean(selectedPayment)}
            onClose={() => setSelectedPayment(null)}
            details={selectedPayment.details}
            method={selectedPayment.method}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default AllWithdraws;