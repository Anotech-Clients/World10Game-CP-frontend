import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PaidIcon from '@mui/icons-material/Paid';
import DiscountIcon from '@mui/icons-material/Discount';
import FilterListIcon from '@mui/icons-material/FilterList';
import { domain } from '../../../utils/Secret';
import { useAuth } from '../../../context/AuthContext';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
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
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

const styles = {
  wrapper: {
    p: { xs: 2, md: 3 },
    backgroundColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
  },
  paper: {
    p: { xs: 3, md: 4 },
    mb: 4,
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
  },
  sectionTitle: {
    fontSize: { xs: '1.5rem', md: '1.75rem' },
    color: '#f8fafc',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    mb: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    '& svg': {
      color: '#6366f1',
      fontSize: '2rem',
    },
  },
  sectionDescription: {
    color: '#94a3b8',
    fontFamily: 'Inter, sans-serif',
    mb: 4,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  formHeading: {
    fontSize: { xs: '1.25rem', md: '1.5rem' },
    color: '#f8fafc',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 3,
    '& svg': {
      color: '#6366f1',
    },
  },
  formControl: {
    width: '100%',
    '& .MuiInputLabel-root': {
      fontFamily: 'Inter, sans-serif',
    },
    '& .MuiSelect-select': {
      fontFamily: 'Inter, sans-serif',
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px',
      '&:hover fieldset': {
        borderColor: '#6366f1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },
    },
    '& .MuiMenuItem-root': {
      fontFamily: 'Inter, sans-serif',
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontFamily: 'Inter, sans-serif',
      '&:hover fieldset': {
        borderColor: '#6366f1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'Inter, sans-serif',
    },
    '& .MuiInputBase-input': {
      fontFamily: 'Inter, sans-serif',
    },
  },
  button: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    borderRadius: '12px',
    textTransform: 'none',
    py: 1.5,
    px: 4,
    boxShadow: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
    },
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    },
  },
  secondaryButton: {
    color: '#6366f1',
    borderColor: '#6366f1',
    '&:hover': {
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(99, 102, 241, 0.04)',
    },
  },
  filterBox: {
    p: 3,
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    mb: 4,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  },
  tableContainer: {
    mt: 3,
    borderRadius: '16px',
    border: '1px solid rgba(231, 235, 240, 0.8)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    overflow: 'hidden',
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: '0',
    },
  },
  tableWrapper: {
    width: '100%',
    overflow: 'auto',
    // Hide scrollbar for Chrome, Safari, and Opera
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    // Hide scrollbar for IE, Edge, and Firefox
    'msOverflowStyle': 'none',
    'scrollbarWidth': 'none',
    // Ensure smooth scrolling on iOS
    '-webkit-overflow-scrolling': 'touch',
  },
  tableInner: {
    minWidth: {
      xs: '800px', // Minimum width for mobile
      md: '100%',  // Full width for desktop
    },
  },
  tableHeader: {
    background: 'rgba(99, 102, 241, 0.05)',
    '& .MuiTableCell-head': {
      color: '#f8fafc',
      fontWeight: 600,
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.875rem',
      borderBottom: '2px solid rgba(148, 163, 184, 0.12)',
      padding: '16px',
    },
  },
  tableCell: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    color: '#f8fafc',
    padding: '16px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
  },
  tableRow: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    '&:last-child td': {
      borderBottom: 'none',
    },
  },
  chip: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    height: 28,
    fontSize: '0.75rem',
    borderRadius: '8px',
    padding: '0 12px',
  },
  chipActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    '& .MuiChip-label': {
      fontFamily: 'Inter, sans-serif',
    },
  },
  chipExpired: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    '& .MuiChip-label': {
      fontFamily: 'Inter, sans-serif',
    },
  },
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '400px',
    },
  },
  dialogTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#1e293b',
    padding: 0,
    marginBottom: '16px',
  },
  dialogContent: {
    padding: 0,
    marginBottom: '24px',
    '& .MuiTypography-root': {
      fontFamily: 'Inter, sans-serif',
      color: '#64748b',
    },
  },
  dialogActions: {
    padding: 0,
    gap: '12px',
  },
  snackbar: {
    '& .MuiAlert-root': {
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    mt: 4,
    '& .MuiTypography-root': {
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b',
      fontWeight: 600,
    },
  },
};

const CreateGift = () => {
  const { axiosInstance } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    redemptionLimit: '',
    expiryType: 'NEVER',
    expiryDays: 1,
    expiryDate: new Date().toISOString().split('T')[0],
  });

  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    code: '',
    startDate: '',
    endDate: '',
    includeExpired: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    couponId: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.code) {
      errors.code = 'Code is required';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.code)) {
      errors.code = 'Code can only contain letters, numbers, underscores, and hyphens';
    }

    if (!formData.discount || formData.discount <= 0) {
      errors.discount = 'Discount must be a positive number';
    }

    if (!formData.redemptionLimit || formData.redemptionLimit <= 0) {
      errors.redemptionLimit = 'Redemption limit must be a positive number';
    }

    if (formData.expiryType === 'DAYS') {
      if (!formData.expiryDays || formData.expiryDays <= 0 || formData.expiryDays > 365) {
        errors.expiryDays = 'Days must be between 1 and 365';
      }
    }

    if (formData.expiryType === 'DATE') {
      const selectedDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!formData.expiryDate || selectedDate <= today) {
        errors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      const response = await axiosInstance.get(
        `${domain}/api/account/v1/tokens/admin/coupons?${queryParams}`,
        { withCredentials: true }
      );

      const responseData = response.data.data;
      setCoupons(responseData.data);
      setPagination({
        ...pagination,
        total: responseData.pagination.total,
        pages: responseData.pagination.pages,
      });
    } catch (error) {
      showSnackbar('Failed to fetch coupons', 'error');
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${domain}/api/account/v1/tokens/admin/coupons`,
        {
          code: formData.code,
          discount: parseFloat(formData.discount),
          redemptionLimit: parseInt(formData.redemptionLimit),
          expiryType: formData.expiryType,
          ...(formData.expiryType === 'DAYS' && { expiryDays: parseInt(formData.expiryDays) }),
          ...(formData.expiryType === 'DATE' && { expiryDate: formData.expiryDate }),
        },
        { withCredentials: true }
      );

      if (response.data) {
        showSnackbar('Coupon created successfully', 'success');
        resetForm();
        fetchCoupons();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to create coupon', 'error');
      console.error('Error creating coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `${domain}/api/account/v1/tokens/admin/coupons/${id}`,
        { withCredentials: true }
      );

      if (response.data) {
        showSnackbar('Coupon deleted successfully', 'success');
        fetchCoupons();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to delete coupon', 'error');
      console.error('Error deleting coupon:', error);
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, couponId: null });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      redemptionLimit: '',
      expiryType: 'NEVER',
      expiryDays: 1,
      expiryDate: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    showSnackbar('Code copied to clipboard', 'success');
  };

  useEffect(() => {
    fetchCoupons();
  }, [pagination.page, filters]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={styles.wrapper}>
        <Typography variant="h4" sx={styles.sectionTitle}>
          <DiscountIcon /> Coupon Management
      </Typography>

      {/* Create Coupon Form */}
      <Paper sx={styles.paper} elevation={0}>
        <Typography variant="h5" sx={styles.formHeading}>
          <AddCircleIcon /> Create New Coupon
        </Typography>
        <Grid container spacing={3} component="form" onSubmit={createCoupon} noValidate>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Coupon Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={!!formErrors.code}
              helperText={formErrors.code}
              required
              InputProps={{
                startAdornment: <LocalOfferIcon sx={{ color: '#6366f1', mr: 1 }} />,
              }}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Gift Amount"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              error={!!formErrors.discount}
              helperText={formErrors.discount}
              required
              InputProps={{
                startAdornment: <PaidIcon sx={{ color: '#6366f1', mr: 1 }} />,
              }}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Redemption Limit"
              type="number"
              value={formData.redemptionLimit}
              onChange={(e) => setFormData({ ...formData, redemptionLimit: e.target.value })}
              error={!!formErrors.redemptionLimit}
              helperText={formErrors.redemptionLimit}
              required
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={styles.formControl}>
              <InputLabel>Expiry Type</InputLabel>
              <Select
                value={formData.expiryType}
                onChange={(e) => setFormData({ ...formData, expiryType: e.target.value })}
                label="Expiry Type"
              >
                <MenuItem value="NEVER">Never</MenuItem>
                <MenuItem value="DAYS">Days</MenuItem>
                <MenuItem value="DATE">Specific Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.expiryType === 'DAYS' && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Days until expiry"
                type="number"
                value={formData.expiryDays}
                onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                error={!!formErrors.expiryDays}
                helperText={formErrors.expiryDays}
                InputProps={{
                  startAdornment: <CalendarTodayIcon sx={{ color: '#6366f1', mr: 1 }} />,
                }}
                inputProps={{ min: 1, max: 365 }}
                required
                sx={styles.input}
              />
            </Grid>
          )}

          {formData.expiryType === 'DATE' && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                error={!!formErrors.expiryDate}
                helperText={formErrors.expiryDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                required
                sx={styles.input}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ ...styles.button, ...styles.primaryButton }}
              startIcon={<AddCircleIcon />}
            >
              Create Coupon
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters Section */}
      <Paper sx={styles.paper} elevation={0}>
        <Typography variant="h5" sx={styles.formHeading}>
          <FilterListIcon /> Search & Filter
        </Typography>
        <Box sx={styles.filterBox}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search by code"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#6366f1', mr: 1 }} />,
                }}
                sx={styles.input}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth sx={styles.formControl}>
                <InputLabel>Include Expired</InputLabel>
                <Select
                  value={filters.includeExpired}
                  onChange={(e) => setFilters({ ...filters, includeExpired: e.target.value })}
                  label="Include Expired"
                >
                  <MenuItem value={false}>Active Only</MenuItem>
                  <MenuItem value={true}>Include Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilters({
                    code: '',
                    startDate: '',
                    endDate: '',
                    includeExpired: false,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                  });
                }}
                startIcon={<RefreshIcon />}
                sx={{ ...styles.button, ...styles.secondaryButton, height: '56px' }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Coupons Table */}
        <Typography variant="h5" sx={styles.formHeading}>
          <LocalOfferIcon /> Active Coupons
        </Typography>
        <TableContainer sx={styles.tableContainer}>
          <Box sx={styles.tableWrapper}>
            <Box sx={styles.tableInner}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell>Code</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Redemption Limit</TableCell>
                    <TableCell align="right">Used</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(coupons) && coupons.map((coupon) => (
                    <TableRow key={coupon.id} sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{
                            fontFamily: 'Inter, monospace',
                            fontWeight: 500,
                            color: '#6366f1',
                          }}>
                            {coupon.code}
                          </Typography>
                          <Tooltip title="Copy code">
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(coupon.code)}
                              sx={{
                                color: '#6366f1',
                                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.04)' },
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={styles.tableCell}>
                        pkr {coupon.discount}
                      </TableCell>
                      <TableCell align="right" sx={styles.tableCell}>
                        {coupon.redemptionLimit}
                      </TableCell>
                      <TableCell align="right" sx={styles.tableCell}>
                        {coupon.redemptionCount}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={coupon.isExpired ? 'Expired' : 'Active'}
                          sx={coupon.isExpired ? styles.chipExpired : styles.chipActive}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete coupon">
                          <IconButton
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, couponId: coupon.id })}
                            sx={{
                              '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </TableContainer>

        {/* Pagination */}
        <Box sx={styles.paginationContainer}>
          <Button
            variant="outlined"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            startIcon={<NavigateBeforeIcon />}
            sx={{ ...styles.button, ...styles.secondaryButton }}
          >
            Previous
          </Button>
          <Typography sx={{color: '#f8fafc'}}>
            Page {pagination.page} of {pagination.pages}
          </Typography>
          <Button
            variant="outlined"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            endIcon={<NavigateNextIcon />}
            sx={{ ...styles.button, ...styles.secondaryButton }}
          >
            Next
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={styles.snackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, couponId: null })}
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          Delete Coupon
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Typography>
            Are you sure you want to delete this coupon? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={() => setDeleteDialog({ open: false, couponId: null })}
            sx={{
              ...styles.button,
              color: '#6366f1',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteCoupon(deleteDialog.couponId)}
            disabled={loading}
            sx={{
              ...styles.button,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default CreateGift;