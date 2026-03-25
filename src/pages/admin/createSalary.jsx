import React, { useState, useEffect } from "react";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import {
  Button,
  TextField, Select,
  MenuItem, InputLabel,
  FormControl,
  tableCellClasses,
  styled,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  ShowChart as ChartIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { domain } from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";
import dayjs from 'dayjs';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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

// Custom color palette
const colors = {
  primary: "#6366f1",
  secondary: "#818cf8",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  background: "#0f172a",
  cardBg: "#1e293b",
  text: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "rgba(148, 163, 184, 0.12)",
  hover: "rgba(99, 102, 241, 0.1)",
};

// Responsive typography settings
const getTypographyStyles = (isMobile) => ({
  h4: {
    fontSize: isMobile ? '1rem' : '1.5rem',
    fontWeight: 600,
  },
  h6: {
    fontSize: isMobile ? '1rem' : '1.25rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: isMobile ? '0.875rem' : '1rem',
  },
  stats: {
    fontSize: isMobile ? '1rem' : '1.5rem',
    fontWeight: 600,
  },
});

// Base styles with Inter font
const globalStyles = {
  fontFamily: "Inter, sans-serif !important",
  "& *": {
    fontFamily: "Inter, sans-serif !important",
  },
};

const PageContainer = styled(Box)(({ theme }) => ({
  ...globalStyles,
  minHeight: "85vh",
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  backgroundColor: "#0f172a",
  borderRadius: "16px",
}));

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  borderRadius: "10px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  backgroundColor: colors.cardBg,
  marginBottom: theme.spacing(3),
  border: `1px solid ${colors.border}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: colors.primary,
    color: colors.cardBg,
    fontWeight: 600,
    fontSize: theme.breakpoints.down('sm') ? '12px' : '14px',
    padding: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: theme.breakpoints.down('sm') ? '12px' : '14px',
    color: colors.text,
    padding: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
}));

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: colors.hover,
  },
  "&:hover": {
    backgroundColor: `${colors.hover}!important`,
  },
  transition: "background-color 0.2s ease",
});

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  borderRadius: "16px",
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.cardBg,
  border: `1px solid ${colors.border}`,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
    fontSize: theme.breakpoints.down('sm') ? '14px' : '16px',
    "&:hover fieldset": {
      borderColor: colors.primary,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.primary,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Inter, sans-serif",
    color: colors.textSecondary,
    fontSize: theme.breakpoints.down('sm') ? '14px' : '16px',
  },
  "& .MuiInputAdornment-root": {
    color: colors.primary,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "8px",
  padding: theme.spacing(1, 2),
  fontSize: theme.breakpoints.down('sm') ? '12px' : '14px',
  boxShadow: "none",
  height: theme.breakpoints.down('sm') ? '36px' : '42px',
  "&:hover": {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  fontSize: theme.breakpoints.down('sm') ? '11px' : '13px',
  height: theme.breakpoints.down('sm') ? '24px' : '28px',
  borderRadius: "6px",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(0.75),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
  },
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));


const CreateSalary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { axiosInstance } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const iconSize = isMobile ? 24 : 32;
  const typographyStyles = getTypographyStyles(isMobile);



  // Form states
  const [formData, setFormData] = useState({
    uid: "",
    amount: "",
    frequency: "DAILY",
    count: "",
    startDate: "",
    startTime: "",
    immediateFirstPayment: false,
    addTurnOver: false, // New field
    timeFormat: "AM",
    hour: "",
    minute: "",
  });

  // UI states
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Stats state
  const [stats, setStats] = useState({
    totalSalaryPaid: 0,
    activeSalaryRules: 0,
    totalUsers: 0,
    frequencyDistribution: {},
    monthlyTotal: [],
  });

  const formatTimeForAPI = () => {
    if (!formData.hour || !formData.minute) return "";

    let hour = parseInt(formData.hour);

    // Convert to 24-hour format
    if (formData.timeFormat === "PM") {
      if (hour !== 12) {
        hour += 12;
      }
    } else if (formData.timeFormat === "AM" && hour === 12) {
      hour = 0;
    }

    // Format minutes with leading zero
    const minute = formData.minute.padStart(2, '0');

    // Return in 12-hour format with AM/PM
    const period = formData.timeFormat;
    return `${formData.hour}:${minute} ${period}`;
  };

  const parseTimeFromAPI = (timeString) => {
    if (!timeString) return { hour: "", minute: "", timeFormat: "AM" };

    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return { hour: "", minute: "", timeFormat: "AM" };

    let [_, hour, minute, format] = match;
    hour = parseInt(hour);

    return {
      hour: hour.toString(),
      minute,
      timeFormat: format.toUpperCase()
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        immediateFirstPayment: false,
        startTime: value ? prev.startTime : "",
        hour: value ? prev.hour : "",
        minute: value ? prev.minute : "",
        timeFormat: value ? prev.timeFormat : "AM",
      }));
      return;
    }

    if (name === "hour") {
      const hourValue = parseInt(value);
      if (hourValue >= 0 && hourValue <= 12) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "minute") {
      const minuteValue = parseInt(value);
      if (minuteValue >= 0 && minuteValue <= 59) {
        setFormData(prev => ({ ...prev, [name]: value.padStart(2, '0') }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchSalaryRules = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/admin/salary/rules`);
      setSalaryRecords(response.data.data);
    } catch (error) {
      showSnackbar("Error fetching salary rules", "error");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/admin/salary/stats`);
      setStats(response.data.data);
    } catch (error) {
      showSnackbar("Error fetching statistics", "error");
    }
  };

  useEffect(() => {
    fetchSalaryRules();
    fetchStats();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedTime = formatTimeForAPI();

    const payload = {
      uid: formData.uid,
      frequency: formData.frequency,
      amount: parseFloat(formData.amount),
      count: parseInt(formData.count),
      immediateFirstPayment: formData.startDate ? false : formData.immediateFirstPayment,
      addTurnOver: formData.addTurnOver, // Add the new field to payload
      ...(formData.startDate && { startDate: formData.startDate }),
      ...(formData.startDate && formattedTime && { startTime: formattedTime }),
    };

    try {
      if (editingId) {
        await axiosInstance.put(`${domain}/api/admin/salary/rules/${editingId}`, payload);
        showSnackbar("Salary rule updated successfully");
      } else {
        await axiosInstance.post(`${domain}/api/admin/salary/rules`, payload);
        showSnackbar("Salary rule created successfully");
      }
      setEditingId(null);
      resetForm();
      fetchSalaryRules();
      fetchStats();
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Error processing request", "error");
    }
  };

  const handleEdit = (record) => {
    const timeInfo = record.startTime ? parseTimeFromAPI(record.startTime) : { hour: "", minute: "", timeFormat: "PM" };

    setEditingId(record.id);
    setFormData({
      uid: record.userId,
      amount: record.amount.toString(),
      frequency: record.frequency,
      // Use remainingCount instead of totalCount when editing
      count: record.remainingCount.toString(),
      startDate: record.startDate ? dayjs(record.startDate).format('YYYY-MM-DD') : "",
      immediateFirstPayment: false,
      addTurnOver: record.addTurnOver || false,
      hour: timeInfo.hour,
      minute: timeInfo.minute,
      timeFormat: timeInfo.timeFormat,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${domain}/api/admin/salary/rules/${id}`);
      showSnackbar("Salary rule deleted successfully");
      fetchSalaryRules();
      fetchStats();
    } catch (error) {
      showSnackbar("Error deleting salary rule", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      uid: "",
      amount: "",
      frequency: "DAILY",
      count: "",
      startDate: "",
      immediateFirstPayment: false,
      addTurnOver: false, // Reset addTurnOver
      hour: "",
      minute: "",
      timeFormat: "AM",
    });
    setEditingId(null);
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      MINUTELY: "#F87171",
      HOURLY: "#818CF8",
      DAILY: "#38BDF8",
      WEEKLY: "#4ADE80",
      MONTHLY: "#FB923C"
    };
    return colors[frequency] || "#94A3B8";
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <PageContainer>
        <Box sx={{
          background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
          borderRadius: '16px',
          padding: '0',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.12)'
        }}>
          {/* Header section */}
          <Box sx={{
            background: '#6366f1',
            padding: isMobile ? '20px' : '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AccountBalanceWalletIcon sx={{ fontSize: '30px', color: '#fff' }} />
            </Box>

            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ color: '#fff', letterSpacing: '0.5px' }}
            >
              {editingId ? "Edit Salary Rule" : "Create Salary Rule"}
            </Typography>

            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              right: '-10px',
              top: '-10px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
            }} />
            <Box sx={{
              position: 'absolute',
              right: '40px',
              bottom: '-30px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
            }} />
          </Box>

          <Box sx={{ padding: isMobile ? '24px 16px' : '32px' }}>
            <form onSubmit={handleSubmit}>
              {/* User ID and Amount */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '11px'
                    }}>
                      User Identification
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Enter user ID"
                    name="uid"
                    value={formData.uid}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{
                          mr: 1,
                          backgroundColor: 'rgba(52, 152, 219, 0.15)',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px'
                        }}>
                          <PeopleIcon sx={{ color: '#3498db' }} />
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        color: '#f8fafc',
                        '& fieldset': {
                          borderColor: 'rgba(148, 163, 184, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(148, 163, 184, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6366f1',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#6366f1',
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '11px'
                    }}>
                      Salary Amount
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{
                          mr: 1,
                          backgroundColor: 'rgba(67, 160, 71, 0.15)',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px'
                        }}>
                          <AccountBalanceWalletIcon sx={{ color: '#43a047' }} />
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        '& fieldset': {
                          borderColor: 'rgba(148, 163, 184, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(148, 163, 184, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#43a047',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Frequency settings with unique design */}
              <Box sx={{
                mb: 4,
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '14px',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                padding: '24px'
              }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#f8fafc',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      width: '4px',
                      height: '18px',
                      backgroundColor: '#6366f1',
                      marginRight: '10px',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Payment Frequency Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Typography variant="caption" sx={{ mb: 1, color: '#5e6c84', fontWeight: 500 }}>
                        Payment Frequency
                      </Typography>
                      <Select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        required
                        displayEmpty
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: '#1e293b',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(148, 163, 184, 0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(148, 163, 184, 0.3)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3498db',
                          },
                          height: '52px'
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            },
                          },
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <Typography sx={{ color: '#94a3b8' }}>Select frequency</Typography>;
                          }
                          const icons = {
                            MINUTELY: "⏱️",
                            HOURLY: "🕒",
                            DAILY: "📆",
                            WEEKLY: "📅",
                            MONTHLY: "📅"
                          };
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ mr: 1 }}>{icons[selected]}</Typography>
                              <Typography>{selected.charAt(0) + selected.slice(1).toLowerCase()}</Typography>
                            </Box>
                          );
                        }}
                      >
                        <MenuItem value="MINUTELY">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>⏱️</Typography>
                            <Typography>Minutely</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="HOURLY">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>🕒</Typography>
                            <Typography>Hourly</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="DAILY">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>📆</Typography>
                            <Typography>Daily</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="WEEKLY">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>📅</Typography>
                            <Typography>Weekly</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="MONTHLY">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>📅</Typography>
                            <Typography>Monthly</Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ mb: 1, color: '#5e6c84', fontWeight: 500 }}>
                      Maximum Payments
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter limit"
                      name="count"
                      type="number"
                      value={formData.count}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 1
                          }}>
                            <ChartIcon sx={{ color: '#9c27b0' }} />
                          </Box>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#1e293b',
                          height: '52px',
                          '& fieldset': {
                            borderColor: 'rgba(148, 163, 184, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(148, 163, 184, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#9c27b0',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Schedule section with timeline-like visual */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#334155',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      width: '4px',
                      height: '18px',
                      backgroundColor: '#ff9800',
                      marginRight: '10px',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Schedule Configuration
                </Typography>

                <Box sx={{
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: '18px',
                    top: '40px',
                    bottom: formData.startDate ? '80px' : '0',
                    width: '2px',
                    backgroundColor: '#e2e8f0',
                    zIndex: 0
                  }
                }}>
                  <Box sx={{ display: 'flex', mb: formData.startDate ? 3 : 0, position: 'relative' }}>
                    <Box sx={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 152, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #ff9800',
                      mr: 2,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <CalendarIcon sx={{ color: '#ff9800', fontSize: '18px' }} />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ color: '#5e6c84', fontWeight: 500, display: 'block', mb: 1 }}>
                        Start Date
                      </Typography>
                      <TextField
                        fullWidth
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        inputProps={{ min: today }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#1e293b',
                            '& fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff9800',
                            }
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {formData.startDate && (
                    <Box sx={{ display: 'flex', position: 'relative' }}>
                      <Box sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(52, 152, 219, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #3498db',
                        mr: 2,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <TimeIcon sx={{ color: '#3498db', fontSize: '18px' }} />
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" sx={{ color: '#5e6c84', fontWeight: 500, display: 'block', mb: 1 }}>
                          Start Time
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            label="Hour"
                            name="hour"
                            value={formData.hour}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 1, max: 12 }}
                            sx={{
                              width: '32%',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#1e293b',
                                '& fieldset': {
                                  borderColor: 'rgba(148, 163, 184, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(148, 163, 184, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#3498db',
                                }
                              }
                            }}
                          />
                          <TextField
                            label="Minute"
                            name="minute"
                            value={formData.minute}
                            onChange={handleInputChange}
                            type="number"
                            inputProps={{ min: 0, max: 59 }}
                            sx={{
                              width: '32%',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#1e293b',
                                '& fieldset': {
                                  borderColor: 'rgba(148, 163, 184, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(148, 163, 184, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#3498db',
                                }
                              }
                            }}
                          />
                          <FormControl sx={{ width: '32%' }}>
                            <InputLabel>AM/PM</InputLabel>
                            <Select
                              name="timeFormat"
                              value={formData.timeFormat}
                              onChange={handleInputChange}
                              label="AM/PM"
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: '#1e293b',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(148, 163, 184, 0.2)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(148, 163, 184, 0.3)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#3498db',
                                }
                              }}
                            >
                              <MenuItem value="AM">AM</MenuItem>
                              <MenuItem value="PM">PM</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Toggle options in cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {!formData.startDate && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 3,
                      borderRadius: '14px',
                      backgroundColor: formData.immediateFirstPayment ? 'rgba(52, 152, 219, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                      border: formData.immediateFirstPayment ? '1px solid rgba(52, 152, 219, 0.3)' : '1px solid rgba(148, 163, 184, 0.12)',
                      transition: 'all 0.3s ease'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: formData.immediateFirstPayment ? 'rgba(52, 152, 219, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}>
                            <FlashOnIcon sx={{ color: formData.immediateFirstPayment ? '#3498db' : '#94a3b8' }} />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: formData.immediateFirstPayment ? '#3498db' : '#f8fafc' }}>
                            Immediate First Payment
                          </Typography>
                        </Box>
                        <Switch
                          checked={formData.immediateFirstPayment}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            immediateFirstPayment: e.target.checked
                          }))}
                          name="immediateFirstPayment"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#3498db',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#3498db',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', ml: 7 }}>
                        Process the first payment immediately after rule creation
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} md={formData.startDate ? 12 : 6}>
                  <Box sx={{
                    p: 3,
                    borderRadius: '14px',
                    backgroundColor: formData.addTurnOver ? 'rgba(67, 160, 71, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                    border: formData.addTurnOver ? '1px solid rgba(67, 160, 71, 0.3)' : '1px solid rgba(148, 163, 184, 0.12)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: formData.addTurnOver ? 'rgba(67, 160, 71, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <TrendingUpIcon sx={{ color: formData.addTurnOver ? '#43a047' : '#94a3b8' }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: formData.addTurnOver ? '#43a047' : '#f8fafc' }}>
                          Add To Turnover
                        </Typography>
                      </Box>
                      <Switch
                        checked={formData.addTurnOver}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          addTurnOver: e.target.checked
                        }))}
                        name="addTurnOver"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#43a047',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#43a047',
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', ml: 7 }}>
                      Include these payments in overall turnover calculations
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Action buttons with attractive styling */}
              <Box sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
                pt: 3,
                borderTop: '1px solid #e2e8f0'
              }}>
                {editingId && (
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    startIcon={<CancelIcon />}
                    sx={{
                      color: '#e53e3e',
                      borderColor: '#e53e3e',
                      borderRadius: '10px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#c53030',
                        backgroundColor: 'rgba(229, 62, 62, 0.08)',
                      },
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: '#3498db',
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                      boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)',
                    },
                  }}
                >
                  {editingId ? "Update Rule" : "Create Rule"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>

        {/* Stats Section */}
        <FormCard elevation={0}>
          <Box display="flex" alignItems="center" mb={4}>
            <ChartIcon sx={{ fontSize: 32, color: colors.primary, mr: 1 }} />
            <Typography
              variant="h4"
              fontWeight={600}
              color={colors.primary}
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', fontWeight: 600 } }} // Smaller font size on small devices
            >
              Salary Statistics
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }} // Smaller font size on small devices
                >
                  Total Paid
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color={colors.primary}
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Smaller font size on small devices
                >
                  {stats.totalSalaryPaid.toLocaleString()}
                </Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <ScheduleIcon sx={{ fontSize: 40, color: colors.success, mb: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }} // Smaller font size on small devices
                >
                  Active Rules
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color={colors.success}
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Smaller font size on small devices
                >
                  {stats.activeSalaryRules}
                </Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <PeopleIcon sx={{ fontSize: 40, color: colors.warning, mb: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }} // Smaller font size on small devices
                >
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color={colors.warning}
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Smaller font size on small devices
                >
                  {stats.totalUsers}
                </Typography>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <ChartIcon sx={{ fontSize: 40, color: colors.secondary, mb: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }} // Smaller font size on small devices
                >
                  Frequency Distribution
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                  {Object.entries(stats.frequencyDistribution).map(([key, value]) => (
                    <StyledChip
                      key={key}
                      label={`${key}: ${value}`}
                      sx={{
                        backgroundColor: getFrequencyColor(key),
                        color: colors.cardBg,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </StatCard>
            </Grid>
          </Grid>
        </FormCard>

        {/* Salary Rules Table */}
        <FormCard elevation={0}>
          <Box display="flex" alignItems="center" mb={4}>
            <AccountBalanceWalletIcon sx={{ fontSize: 32, color: colors.primary }} />
            <Typography
              variant="h4"
              fontWeight={600}
              color={colors.primary}
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Smaller font size on small devices
            >
              Active Salary Rules
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Uid</StyledTableCell>
                  <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Amount</StyledTableCell>
                  <StyledTableCell align="center">Frequency</StyledTableCell>
                  <StyledTableCell align="center">Progress</StyledTableCell>
                  <StyledTableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Start Date</StyledTableCell>
                  <StyledTableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Start Time</StyledTableCell>
                  <StyledTableCell align="center">Next Payment</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {salaryRecords.map((record) => (
                  <StyledTableRow key={record.id}>
                    <StyledTableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Box display="flex" alignItems="center">
                        <PeopleIcon sx={{ mr: 1, color: colors.primary }} />
                        <Typography sx={{ color: colors.text, fontWeight: 500, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {record.userId}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <StyledChip
                        label={`${record.amount}`}
                        sx={{
                          backgroundColor: `${colors.primary}15`,
                          color: colors.primary,
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font size on small devices
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StyledChip
                        label={record.frequency}
                        sx={{
                          backgroundColor: getFrequencyColor(record.frequency),
                          color: colors.cardBg,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font size on small devices
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StyledChip
                        label={`${record.remainingCount}/${record.totalCount}`}
                        sx={{
                          backgroundColor: `${colors.success}15`,
                          color: colors.success,
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font size on small devices
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {record.startDate ? dayjs(record.startDate).format('YYYY-MM-DD') : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {record.startTime || 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {record.nextPaymentAt ? (
                        <StyledChip
                          label={dayjs(record.nextPaymentAt).format('YYYY-MM-DD HH:mm')}
                          sx={{
                            backgroundColor: `${colors.warning}15`,
                            color: colors.warning,
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font size on small devices
                          }}
                        />
                      ) : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens, horizontally on larger screens
                          gap: { xs: 1, sm: 0 }, // Add a gap between icons when stacked vertically
                          alignItems: 'center', // Center align the icons
                        }}
                      >
                        <StyledIconButton
                          onClick={() => handleEdit(record)}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.primary}15`,
                            mr: { xs: 0, sm: 1 }, // Remove margin-right on small screens
                            '&:hover': {
                              backgroundColor: `${colors.primary}25`,
                            },
                          }}
                        >
                          <EditIcon sx={{ color: colors.primary, fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                        </StyledIconButton>
                        <StyledIconButton
                          onClick={() => handleDelete(record.id)}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.error}15`,
                            '&:hover': {
                              backgroundColor: `${colors.error}25`,
                            },
                          }}
                        >
                          <DeleteIcon sx={{ color: colors.error, fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                        </StyledIconButton>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormCard>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontFamily: "Inter, sans-serif",
              backgroundColor: snackbar.severity === 'success' ? colors.success : colors.error,
              color: colors.cardBg,
              '& .MuiAlert-icon': {
                color: colors.cardBg,
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PageContainer>
    </ThemeProvider>
  );
};

export default CreateSalary;