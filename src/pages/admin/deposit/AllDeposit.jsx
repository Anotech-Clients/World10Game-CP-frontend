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
    Stack,
    Chip,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
    styled,
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Search, Refresh, CalendarToday } from '@mui/icons-material';

const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
        },
        success: {
            main: '#10b981',
            contrastText: '#fff'
        },
        error: {
            main: '#ef4444',
            contrastText: '#fff'
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
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    backgroundColor: '#1e293b',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    minHeight: 48,
                    padding: '12px 24px',
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
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    padding: '16px',
    fontSize: '0.875rem',
}));

function AllDeposits() {
    const { axiosInstance } = useAuth();
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeTab, setActiveTab] = useState('SUCCESS');

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        utrNumber: '',
        searchUserId: '',
    });

    const formatDateForApi = (dateString) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        if (filters.startDate === dateString) {
            date.setHours(0, 0, 0, 0);
        } else if (filters.endDate === dateString) {
            date.setHours(23, 59, 59, 999);
        }
        return date.toISOString();
    };

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/wallet/deposit/admin/all', {
                params: {
                    page: page + 1,
                    pageSize: rowsPerPage,
                    startDate: formatDateForApi(filters.startDate),
                    endDate: formatDateForApi(filters.endDate),
                    paymentGatewayName: 'NA',
                    status: activeTab,
                    utrNumber: filters.utrNumber || undefined,
                    searchUserId: filters.searchUserId || undefined
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

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0);
    };

    const handleSearch = () => {
        setPage(0);
        fetchDeposits();
    };

    const handleReset = () => {
        setFilters({
            startDate: '',
            endDate: '',
            utrNumber: '',
            searchUserId: '',
        });
        setPage(0);
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

    const formatAmount = (amount) => {
        return `pkr ${Number(amount).toLocaleString('en-IN')}`;
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh', borderRadius: '16px' }}>
                <Typography fontSize={24} sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                    All Deposits
                </Typography>

                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            px: 2,
                        }}
                    >
                        <Tab
                            value="SUCCESS"
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>Successful</span>
                                    <Chip
                                        label={activeTab === 'SUCCESS' ? totalItems : '0'}
                                        color="success"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            backgroundColor: activeTab === 'SUCCESS' ? '#065f46' : '#e2e8f0',
                                            color: activeTab === 'SUCCESS' ? '#fff' : '#64748b',
                                        }}
                                    />
                                </Stack>
                            }
                        />
                        <Tab
                            value="CANCELLED"
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>Cancelled</span>
                                    <Chip
                                        label={activeTab === 'CANCELLED' ? totalItems : '0'}
                                        color="error"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            backgroundColor: activeTab === 'CANCELLED' ? '#dc2626' : '#e2e8f0',
                                            color: activeTab === 'CANCELLED' ? '#fff' : '#64748b',
                                        }}
                                    />
                                </Stack>
                            }
                        />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        sx: { borderRadius: 1 }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        sx: { borderRadius: 1 }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="UTR Number"
                                    name="utrNumber"
                                    value={filters.utrNumber}
                                    onChange={handleFilterChange}
                                    placeholder="Search by UTR"
                                    InputProps={{
                                        sx: { borderRadius: 1 }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    name="searchUserId"
                                    value={filters.searchUserId}
                                    onChange={handleFilterChange}
                                    placeholder="Search by User ID"
                                    InputProps={{
                                        sx: { borderRadius: 1 }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleReset}
                                sx={{ px: 3 }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Search />}
                                onClick={handleSearch}
                                sx={{ px: 4 }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                <Paper>
  <TableContainer 
    sx={{ 
      overflowX: 'auto', // Enable horizontal scrolling
      '&::-webkit-scrollbar': { // Hide scrollbar for WebKit browsers (Chrome, Safari, Edge)
        display: 'none',
      },
      scrollbarWidth: 'none', // Hide scrollbar for Firefox
      msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
    }}
  >
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>Deposit ID</StyledTableCell>
          <StyledTableCell>User Details</StyledTableCell>
          <StyledTableCell>Amount</StyledTableCell>
          <StyledTableCell>Date & Time</StyledTableCell>
          <StyledTableCell>UTR Number</StyledTableCell>
          <StyledTableCell>Method</StyledTableCell>
          <StyledTableCell>Status</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
              <CircularProgress size={32} />
            </TableCell>
          </TableRow>
        ) : deposits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
              <Typography variant="body1" color="white">
                No deposits found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          deposits.map((deposit) => (
            <TableRow key={deposit.depositId} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                  {deposit.depositId}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    {deposit.user.userName}
                  </Typography>
                  <Typography variant="caption" color="white">
                    ID: {deposit.userId} • {deposit.user.mobile}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                  {formatAmount(deposit.depositAmount)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="white">
                  {formatDateTime(deposit.depositDate)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  color: deposit.utrNumber ? 'white' : '#94a3b8'
                }}>
                  {deposit.utrNumber || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={deposit.paymentGatewayName === 'NA' ? 'Manual' : deposit.paymentGatewayName}
                  size="small"
                  sx={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontWeight: 500
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={deposit.depositStatus}
                  color={deposit.depositStatus === 'SUCCESS' ? 'success' : 'error'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    backgroundColor: deposit.depositStatus === 'SUCCESS' ? '#065f46' : '#dc2626',
                  }}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
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

export default AllDeposits;