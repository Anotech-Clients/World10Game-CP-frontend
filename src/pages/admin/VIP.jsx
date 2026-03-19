import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Paper,
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
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CssBaseline,
  Tooltip,
  Chip,
  Divider,
  Stack,
  InputAdornment,
  useMediaQuery
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Stars as StarsIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  CurrencyExchange as RebateIcon,
  CalendarMonth as MonthlyIcon,
  Rocket as LevelUpIcon,
  Numbers as LevelIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
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
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    h1: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      color: '#f8fafc',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      color: '#94a3b8',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          color: '#f8fafc',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          color: '#f8fafc',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
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

const VIP = () => {
  const { axiosInstance } = useAuth();
  const [vipRules, setVipRules] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    minimumBettingAmount: '',
    oneTimeBonus: '',
    monthlyBonus: '',
    rebatePercentage: ''
  });

  useEffect(() => {
    fetchVIPRules();
  }, []);

  const fetchVIPRules = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/vip/rules');
      setVipRules(response.data.data || []);
    } catch (error) {
      showSnackbar('Failed to fetch VIP rules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await axiosInstance.post('/api/vip/rules', formData);
      showSnackbar('VIP rule added successfully', 'success');
      setOpenAddDialog(false);
      resetForm();
      fetchVIPRules();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to add VIP rule', 'error');
    }
  };

  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/api/vip/rules/${selectedRule.id}`, formData);
      showSnackbar('VIP rule updated successfully', 'success');
      setOpenEditDialog(false);
      resetForm();
      fetchVIPRules();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to update VIP rule', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/vip/rules/${selectedRule.id}`);
      showSnackbar('VIP rule deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchVIPRules();
    } catch (error) {
      showSnackbar('Failed to delete VIP rule', 'error');
    }
  };

  const handleQuickSetup = async () => {
    try {
      await axiosInstance.post('/api/vip/quick-setup');
      showSnackbar('Quick VIP setup completed successfully', 'success');
      fetchVIPRules();
    } catch (error) {
      showSnackbar('Failed to perform quick setup', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      minimumBettingAmount: '',
      oneTimeBonus: '',
      monthlyBonus: '',
      rebatePercentage: ''
    });
    setSelectedRule(null);
  };

  const handleEditClick = (rule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      level: rule.level,
      minimumBettingAmount: rule.minimumBettingAmount,
      oneTimeBonus: rule.oneTimeBonus,
      monthlyBonus: rule.monthlyBonus,
      rebatePercentage: rule.rebatePercentage
    });
    setOpenEditDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const VIPForm = ({ onSubmit, title }) => (
    <>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <StarsIcon color="primary" />
          <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'name'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StarsIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Level"
            type="number"
            onFocus={() => setFocusedField('Level')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'Level'}
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LevelIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Minimum Betting Amount (Rs)"
            type="number"
            onFocus={() => setFocusedField('Minimum Betting Amount (Rs)')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'Minimum Betting Amount (Rs)'}
            value={formData.minimumBettingAmount}
            onChange={(e) => setFormData({ ...formData, minimumBettingAmount: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="One-Time Bonus (Rs)"
            type="number"
            onFocus={() => setFocusedField('One-Time Bonus (Rs)')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'One-Time Bonus (Rs)'}
            value={formData.oneTimeBonus}
            onChange={(e) => setFormData({ ...formData, oneTimeBonus: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LevelUpIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Monthly Bonus (Rs)"
            type="number"
            onFocus={() => setFocusedField('Monthly Bonus (Rs)')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'Monthly Bonus (Rs)'}
            value={formData.monthlyBonus}
            onChange={(e) => setFormData({ ...formData, monthlyBonus: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonthlyIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Rebate Percentage"
            type="number"
            onFocus={() => setFocusedField('Rebate Percentage')}
            onBlur={() => setFocusedField(null)}
            autoFocus={focusedField === 'Rebate Percentage'}
            value={formData.rebatePercentage}
            onChange={(e) => setFormData({ ...formData, rebatePercentage: e.target.value })}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RebateIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => {
            setOpenAddDialog(false);
            setOpenEditDialog(false);
            resetForm();
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          startIcon={title === 'Add VIP Rule' ? <AddIcon /> : <EditIcon />}
        >
          {title === 'Add VIP Rule' ? 'Add Rule' : 'Update Rule'}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: '0 auto', p: 3, backgroundColor: '#0f172a', borderRadius: '16px', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3, background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
  <Stack
    direction={{ xs: 'column', sm: 'row' }} // Stack vertically on small screens, horizontally on larger screens
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'center' }} // Align items to the start on small screens, center on larger screens
    spacing={2}
  >
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
        VIP Rules Management
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage VIP levels, bonuses, and rebate rules
      </Typography>
    </Box>
    <Stack
      direction={{ xs: 'column', sm: 'row' }} // Stack buttons vertically on small screens, horizontally on larger screens
      spacing={2}
      sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on small screens, auto width on larger screens
    >
      {vipRules.length === 0 && (
        <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={handleQuickSetup}
        fullWidth={{ xs: true, sm: false }} // Full width on small screens, auto width on larger screens
      >
        Quick Setup
      </Button>
      )}
      {/* <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddDialog(true)}
        fullWidth={{ xs: true, sm: false }} // Full width on small screens, auto width on larger screens
      >
        Add New Rule
      </Button> */}
    </Stack>
  </Stack>
</Paper>

        <Paper elevation={0} sx={{ borderRadius: 2, background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Min. Betting</TableCell>
                  <TableCell>One-Time Bonus</TableCell>
                  <TableCell>Monthly Bonus</TableCell>
                  <TableCell>Rebate %</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vipRules.map((rule) => (
                  <TableRow key={rule.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StarsIcon color="primary" fontSize="small" />
                        <Typography>{rule.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Level ${rule.level}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color="primary.main" fontWeight={500}>
                        ₹{rule.minimumBettingAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{rule.oneTimeBonus.toLocaleString()}</TableCell>
                    <TableCell>₹{rule.monthlyBonus.toLocaleString()}</TableCell>
                    <TableCell>{rule.rebatePercentage}%</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Rule">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(rule)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Rule">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedRule(rule);
                            setOpenDeleteDialog(true);
                          }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 }
          }}
        >
          <VIPForm onSubmit={handleAdd} title="Add VIP Rule" />
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 }
          }}
        >
          <VIPForm onSubmit={handleEdit} title="Edit VIP Rule" />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DeleteIcon color="error" />
              <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>
                Delete VIP Rule
              </Typography>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>
              Are you sure you want to delete VIP Level {selectedRule?.level} ({selectedRule?.name})? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{ fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ fontFamily: 'Inter, sans-serif' }}
            >
              Delete Rule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
            sx={{
              width: '100%',
              fontFamily: 'Inter, sans-serif',
              '& .MuiAlert-message': {
                fontFamily: 'Inter, sans-serif'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default VIP;