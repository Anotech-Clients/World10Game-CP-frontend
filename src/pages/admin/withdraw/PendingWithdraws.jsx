import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  styled,
  alpha,
  TablePagination,
  IconButton,
  Tooltip,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  AccountBalance,
  CurrencyBitcoin,
  CheckCircle,
  Cancel,
  AccessTime,
  Info,
  ArrowUpward,
  Search,
  ContentCopy,
  FilterList,
  Clear
} from '@mui/icons-material';

// Dark theme color system
const colorSystem = {
  primary: {
    50: 'rgba(99, 102, 241, 0.05)',
    100: 'rgba(99, 102, 241, 0.1)',
    200: 'rgba(99, 102, 241, 0.2)',
    300: 'rgba(99, 102, 241, 0.3)',
    400: 'rgba(99, 102, 241, 0.4)',
    500: '#6366f1',
    600: '#818cf8',
    700: '#6366f1',
    800: '#4f46e5',
    900: '#4338ca',
    main: '#6366f1',
  },
  success: {
    50: 'rgba(16, 185, 129, 0.05)',
    100: 'rgba(16, 185, 129, 0.1)',
    200: 'rgba(16, 185, 129, 0.2)',
    300: 'rgba(16, 185, 129, 0.3)',
    400: '#10b981',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    main: '#10b981',
  },
  warning: {
    50: 'rgba(245, 158, 11, 0.05)',
    100: 'rgba(245, 158, 11, 0.1)',
    200: 'rgba(245, 158, 11, 0.2)',
    300: 'rgba(245, 158, 11, 0.3)',
    400: '#f59e0b',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
  },
  error: {
    50: 'rgba(239, 68, 68, 0.05)',
    100: 'rgba(239, 68, 68, 0.1)',
    200: 'rgba(239, 68, 68, 0.2)',
    300: 'rgba(239, 68, 68, 0.3)',
    400: '#ef4444',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    main: '#ef4444',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
  },
  border: 'rgba(148, 163, 184, 0.12)',
};

// Styled Components with enhanced aesthetics
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  padding: '20px 24px',
  '&.MuiTableCell-head': {
    backgroundColor: colorSystem.primary.main,
    color: '#FFFFFF',
    fontSize: '13px',
    letterSpacing: '0.7px',
    textTransform: 'uppercase',
    borderBottom: 'none',
    whiteSpace: 'nowrap',
  },
  '&.MuiTableCell-body': {
    fontSize: '14px',
    color: colorSystem.text.primary,
    borderBottom: `1px solid ${colorSystem.border}`,
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: colorSystem.primary[50],
  },
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    transform: 'scale(1.001)',
    boxShadow: `0 0 0 1px ${colorSystem.border}`,
  },
  '& td:first-of-type': {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  '& td:last-child': {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: '12px',
  height: 28,
  borderRadius: '8px',
  padding: '0 12px',
  '&.warning': {
    backgroundColor: colorSystem.warning[50],
    color: colorSystem.warning[700],
    border: `1px solid ${colorSystem.warning[200]}`,
  },
  '& .MuiChip-icon': {
    fontSize: 16,
    marginRight: -4,
  }
}));

const DetailRow = styled(Box)(() => ({
  display: 'flex',
  gap: 24,
  marginBottom: 20,
  alignItems: 'center',
  borderBottom: `1px solid ${colorSystem.border}`,
  paddingBottom: 20,
  '&:last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  }
}));

const DetailLabel = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  color: colorSystem.text.secondary,
  minWidth: 200,
  fontSize: '14px',
  letterSpacing: '0.3px',
}));

const DetailValue = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  color: colorSystem.text.primary,
  fontSize: '14px',
  flex: 1,
  wordBreak: 'break-all',
}));

const StyledTab = styled(Tab)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: '14px',
  textTransform: 'none',
  padding: '20px 32px',
  minHeight: '64px',
  color: colorSystem.text.secondary,
  opacity: 0.7,
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: colorSystem.primary.main,
    opacity: 1,
    backgroundColor: colorSystem.primary[100],
  },
  '& .MuiSvgIcon-root': {
    marginRight: 8,
    fontSize: 20,
  },
  '&:hover': {
    backgroundColor: colorSystem.primary[50],
    opacity: 0.9,
  }
}));

const ActionButton = styled(Button)(({ color = 'primary' }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: '14px',
  padding: '10px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    transform: 'translateY(-1px)',
  },
  '&.MuiButton-contained': {
    backgroundColor: colorSystem[color].main,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: colorSystem[color][700],
    },
    '&:active': {
      backgroundColor: colorSystem[color][800],
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(148, 163, 184, 0.12)',
      color: colorSystem.text.secondary,
    }
  },
  '&.MuiButton-outlined': {
    borderColor: colorSystem[color][200],
    color: colorSystem[color].main,
    '&:hover': {
      backgroundColor: alpha(colorSystem[color][50], 0.5),
      borderColor: colorSystem[color].main,
    }
  }
}));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '20px',
  padding: '28px 32px',
  borderBottom: `1px solid ${colorSystem.border}`,
  backgroundColor: colorSystem.background.paper,
  color: colorSystem.primary.main,
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  padding: '32px',
  backgroundColor: colorSystem.background.paper,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(colorSystem.primary.main, 0.2),
    borderRadius: '4px',
  }
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  padding: '16px 24px',
  borderTop: `1px solid ${colorSystem.border}`,
  backgroundColor: colorSystem.background.paper,
  justifyContent: 'flex-end',
  gap: '8px',
}));

const CustomTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: colorSystem.primary[50],
    '& fieldset': {
      borderColor: colorSystem.border,
    },
    '&:hover fieldset': {
      borderColor: colorSystem.primary[200],
    },
    '&.Mui-focused fieldset': {
      borderColor: colorSystem.primary.main,
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    color: colorSystem.text.secondary,
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: 1.6,
    color: colorSystem.text.primary,
    '&::placeholder': {
      color: colorSystem.text.secondary,
      opacity: 0.6,
    }
  }
}));

const LoadingOverlay = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 400,
  gap: 16,
  '& .MuiCircularProgress-root': {
    color: colorSystem.primary.main,
  }
}));

function PendingWithdraws() {
  const { axiosInstance } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('BANK_TRANSFER');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processing, setProcessing] = useState(false);

  // Enhanced search and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    sortBy: 'withdrawDate',
    sortOrder: 'desc',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [searchUserId, setSearchUserId] = useState('');


  // Remove debounce effect since we want to search only on button click
  useEffect(() => {
    fetchPendingWithdrawals();
  }, [page, rowsPerPage, currentTab, filters]);

  // Fetch withdrawals with search and pagination
  useEffect(() => {
    fetchPendingWithdrawals();
  }, [page, rowsPerPage, debouncedSearchTerm, currentTab, filters]);


  const fetchPendingWithdrawals = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams({
        page: page + 1,
        pageSize: rowsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        method: currentTab,
        startDate: '2025-01-01',
        endDate: '2030-02-31',
        status: 'PENDING'
      });

      // Add userId if search is active
      if (searchUserId) {
        searchParams.append('userId', searchUserId);
      }

      const response = await axiosInstance.get(`/api/wallet/withdraw/admin/all?${searchParams.toString()}`);
      setWithdrawals(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pending withdrawals');
      setSnackbar({
        open: true,
        message: 'Failed to fetch pending withdrawals',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProcessWithdrawal = async (status) => {
    try {
      setProcessing(true);
      await axiosInstance.post('/api/wallet/withdraw/admin/process', {
        withdrawId: selectedWithdrawal.id,
        status,
        remarks
      });

      setSnackbar({
        open: true,
        message: `Withdrawal ${status.toLowerCase()} successfully`,
        severity: 'success'
      });

      setProcessDialogOpen(false);
      setSelectedWithdrawal(null);
      setRemarks('');
      fetchPendingWithdrawals();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to ${status.toLowerCase()} withdrawal`,
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard',
      severity: 'success'
    });
  };


  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchPendingWithdrawals();
  };

  const handleSearchClear = () => {
    setSearchUserId('');
    setPage(0);
    fetchPendingWithdrawals();
  };


  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: colorSystem.primary.main,
      },
      background: {
        default: colorSystem.background.default,
        paper: colorSystem.background.paper,
      },
      text: {
        primary: colorSystem.text.primary,
        secondary: colorSystem.text.secondary,
      },
    },
  });

  if (loading && page === 0) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LoadingOverlay>
          <CircularProgress size={40} thickness={4} />
          <Typography
            variant="body1"
            sx={{
              color: colorSystem.text.secondary,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Loading withdrawals...
          </Typography>
        </LoadingOverlay>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{
        p: { xs: 3, md: 4 },
        maxWidth: '100%',
        backgroundColor: colorSystem.background.default,
        minHeight: '100vh',
        borderRadius: '16px',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            // color: colorSystem.primary.main,
            fontSize: '24px',
            letterSpacing: '-0.5px',
          }}
        >
          Pending Withdrawals
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <CustomTextField
            placeholder="Enter User ID"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <IconButton onClick={handleSearch}>
                  <Search sx={{ color: colorSystem.text.secondary }} />
                </IconButton>
              ),
              endAdornment: searchUserId && (
                <IconButton size="small" onClick={handleSearchClear}>
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
            sx={{ width: 280 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Tooltip title="Filter and sort">
            <IconButton
              size="small"
              sx={{
                backgroundColor: colorSystem.primary[50],
                '&:hover': { backgroundColor: colorSystem.primary[100] }
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{
        mb: 4,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        backgroundColor: colorSystem.background.paper,
        border: `1px solid ${colorSystem.border}`,
      }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => {
            setCurrentTab(newValue);
            setPage(0);
          }}
          sx={{
            borderBottom: `1px solid ${colorSystem.border}`,
            backgroundColor: colorSystem.background.paper,
            '& .MuiTabs-indicator': {
              backgroundColor: colorSystem.primary.main,
              height: '3px',
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <StyledTab
            icon={<AccountBalance />}
            iconPosition="start"
            label="Bank Transfer"
            value="BANK_TRANSFER"
          />
          <StyledTab
            icon={<CurrencyBitcoin />}
            iconPosition="start"
            label="USDT"
            value="USDT"
          />
        </Tabs>

        <TableContainer
          sx={{
            backgroundColor: colorSystem.background.paper,
            "&::-webkit-scrollbar": {
              display: "none"  // Hide scrollbar for Chrome, Safari, and newer Edge
            },
            "msOverflowStyle": "none",  // Hide scrollbar for IE and Edge
            "scrollbarWidth": "none",  // Hide scrollbar for Firefox
            "overflowX": "auto",  // Maintain horizontal scroll functionality
            "maxWidth": "100%"
          }}
        >
          <Table sx={{ backgroundColor: colorSystem.background.paper }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Transaction ID</StyledTableCell>
                <StyledTableCell>User ID</StyledTableCell>
                <StyledTableCell>Amount (pkr )</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>User Mobile</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <StyledTableRow key={withdrawal.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: colorSystem.primary.main,
                        }}
                      >
                        {withdrawal.transactionId}
                      </Typography>
                      <Tooltip title="Copy ID">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyToClipboard(withdrawal.transactionId)}
                          sx={{
                            opacity: 0.5,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {withdrawal.userId}
                      </Typography>
                      <Tooltip title="Copy User ID">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyToClipboard(withdrawal.userId.toString())}
                          sx={{
                            opacity: 0.5,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colorSystem.success.main,
                  }}>
                    pkr {Number(withdrawal.withdrawAmount).toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: colorSystem.text.primary,
                  }}>
                    {new Date(withdrawal.withdrawDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: colorSystem.text.primary,
                  }}>
                    {withdrawal.userMobile}
                  </TableCell>
                  <TableCell>
                    <StyledChip
                      icon={<AccessTime />}
                      label="Pending"
                      className="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ActionButton
                      variant="contained"
                      startIcon={<Info />}
                      size="small"
                      onClick={() => {
                        setSelectedWithdrawal(withdrawal);
                        setProcessDialogOpen(true);
                      }}
                      sx={{
                        backgroundColor: colorSystem.primary[50],
                        color: colorSystem.primary.main,
                        '&:hover': {
                          backgroundColor: colorSystem.primary[100],
                        }
                      }}
                    >
                      Process
                    </ActionButton>
                  </TableCell>
                </StyledTableRow>
              ))}
              {withdrawals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      py: 8,
                      fontFamily: 'Inter, sans-serif',
                      color: colorSystem.text.secondary,
                      fontSize: '15px',
                      backgroundColor: colorSystem.background.paper,
                    }}
                  >
                    No pending withdrawals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ... rest of the component code remains the same ... */}

        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={
            <Typography
              component="span"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: colorSystem.text.primary
              }}
            >
              Rows per page
            </Typography>
          }
          sx={{
            borderTop: `1px solid ${colorSystem.border}`,
            backgroundColor: colorSystem.background.paper,
            '.MuiTablePagination-select': {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: colorSystem.text.primary
            },
            '.MuiTablePagination-selectLabel': {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: colorSystem.text.primary
            },
            '.MuiTablePagination-displayedRows': {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: colorSystem.text.primary
            },
            '.MuiSelect-select': {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px'
            }
          }}
        />

      </Paper>

      <Dialog
        open={processDialogOpen}
        onClose={() => !processing && setProcessDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }
        }}
      >
        <StyledDialogTitle>
          Process Withdrawal
        </StyledDialogTitle>
        <StyledDialogContent
          sx={{
            "&::-webkit-scrollbar": {
              display: "none"
            },
            "msOverflowStyle": "none",
            "scrollbarWidth": "none",
            "overflowY": "auto",
            padding: '32px'
          }}
        >
          {selectedWithdrawal && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{
                mb: 3,
                p: 2,
                backgroundColor: colorSystem.primary[50],
                borderRadius: '12px',
                border: `1px solid ${colorSystem.primary[100]}`
              }}>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colorSystem.primary[700],
                    mb: 1
                  }}
                >
                  WITHDRAWAL SUMMARY
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: colorSystem.primary.main,
                  }}
                >
                  pkr {Number(selectedWithdrawal.withdrawAmount).toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </Typography>
              </Box>

              <DetailRow>
                <DetailLabel>Transaction ID:</DetailLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DetailValue>{selectedWithdrawal.transactionId}</DetailValue>
                  <Tooltip title="Copy ID">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyToClipboard(selectedWithdrawal.transactionId)}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </DetailRow>

              <DetailRow>
                <DetailLabel>User Mobile:</DetailLabel>
                <DetailValue>{selectedWithdrawal.userMobile}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Request Date:</DetailLabel>
                <DetailValue>
                  {new Date(selectedWithdrawal.withdrawDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DetailValue>
              </DetailRow>

              <Divider sx={{ my: 3 }} />

              {selectedWithdrawal.withdrawMethod === 'BANK_TRANSFER' && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colorSystem.text.primary,
                      mb: 2
                    }}
                  >
                    Bank Account Details
                  </Typography>

                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: colorSystem.primary[50],
                      border: `1px solid ${colorSystem.border}`,
                      borderRadius: '12px'
                    }}
                  >
                    <DetailRow>
                      <DetailLabel>Account Name:</DetailLabel>
                      <DetailValue>
                        {selectedWithdrawal.paymentDetails.bankDetails.accountName}
                      </DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Account Number:</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DetailValue>
                          {selectedWithdrawal.paymentDetails.bankDetails.accountNumber}
                        </DetailValue>
                        <Tooltip title="Copy Account Number">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyToClipboard(selectedWithdrawal.paymentDetails.bankDetails.accountNumber)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Bank Name:</DetailLabel>
                      <DetailValue>
                        {selectedWithdrawal.paymentDetails.bankDetails.bankName}
                      </DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>IFSC Code:</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DetailValue>
                          {selectedWithdrawal.paymentDetails.bankDetails.ifscCode}
                        </DetailValue>
                        <Tooltip title="Copy IFSC">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyToClipboard(selectedWithdrawal.paymentDetails.bankDetails.ifscCode)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Account Type:</DetailLabel>
                      <DetailValue>
                        {selectedWithdrawal.paymentDetails.bankDetails.accountType}
                      </DetailValue>
                    </DetailRow>
                  </Paper>
                </Box>
              )}

              {selectedWithdrawal.withdrawMethod === 'USDT' && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colorSystem.text.primary,
                      mb: 2
                    }}
                  >
                    Crypto Wallet Details
                  </Typography>

                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: colorSystem.primary[50],
                      border: `1px solid ${colorSystem.border}`,
                      borderRadius: '12px'
                    }}
                  >
                    <DetailRow>
                      <DetailLabel>Network:</DetailLabel>
                      <DetailValue>
                        <Chip
                          label={selectedWithdrawal.paymentDetails.cryptoDetails[0].network}
                          size="small"
                          sx={{
                            backgroundColor: colorSystem.primary[50],
                            color: colorSystem.primary[700],
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}
                        />
                      </DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Wallet Address:</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DetailValue
                          sx={{
                            fontFamily: 'monospace',
                            backgroundColor: colorSystem.primary[100],
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}
                        >
                          {selectedWithdrawal.paymentDetails.cryptoDetails[0].address}
                        </DetailValue>
                        <Tooltip title="Copy Address">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyToClipboard(selectedWithdrawal.paymentDetails.cryptoDetails[0].address)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </DetailRow>
                    {selectedWithdrawal.paymentDetails.cryptoDetails[0].alias && (
                      <DetailRow>
                        <DetailLabel>Alias:</DetailLabel>
                        <DetailValue>
                          {selectedWithdrawal.paymentDetails.cryptoDetails[0].alias}
                        </DetailValue>
                      </DetailRow>
                    )}
                  </Paper>
                </Box>
              )}

              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label="Remarks"
                variant="outlined"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={processing}
                placeholder="Enter your remarks here..."
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colorSystem.primary[50]
                  }
                }}
              />
            </Box>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <ActionButton
            variant="outlined"
            onClick={() => setProcessDialogOpen(false)}
            disabled={processing}
            sx={{
              color: colorSystem.text.secondary,
              borderColor: colorSystem.border,
              '&:hover': {
                borderColor: colorSystem.primary.main,
                backgroundColor: colorSystem.primary[50],
              }
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleProcessWithdrawal('REJECTED')}
            disabled={processing}
          >
            Reject
          </ActionButton>
          <ActionButton
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleProcessWithdrawal('COMPLETED')}
            disabled={processing}
          >
            {processing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Approve'
            )}
          </ActionButton>
        </StyledDialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            },
            '& .MuiAlert-message': {
              fontSize: '14px',
              fontWeight: 500,
              padding: '4px 0'
            },
            '& .MuiAlert-action': {
              padding: '4px 0'
            }
          }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {error && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              },
              '& .MuiAlert-message': {
                fontSize: '14px',
                fontWeight: 500,
                padding: '4px 0'
              }
            }}
          >
            {error}
          </Alert>
        </Box>
      )}
      </Box>
    </ThemeProvider>
  );
}

export default PendingWithdraws;