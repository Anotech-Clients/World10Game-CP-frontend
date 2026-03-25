import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Snackbar,
  FormControlLabel,
  Switch,
  Alert,
  Box,
  TextField,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Info as InfoIcon } from "@mui/icons-material";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";
import { max } from "date-fns";

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
        },
      },
    },
  },
});

const StyledContainer = styled(Container)({
  padding: "20px", // Reduced padding
  // maxWidth: "800px !important",
  margin: "0 auto",
  minHeight: "calc(100vh - 15vh)",
  backgroundColor: "#0f172a",
  borderRadius: '16px',
});

const StyledPaper = styled(Paper)({
  padding: "16px", // Reduced padding
  background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(0, 0, 0, 0.2)",
  borderRadius: "16px",
});

const CustomTextField = styled(TextField)({
  "& .MuiContainer-root": {
    minWidth: "100%",
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "Inter, sans-serif !important",
    height: "40px",
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6366f1",
        borderWidth: "1px",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(148, 163, 184, 0.2)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6366f1",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Inter, sans-serif !important",
    color: "#94a3b8",
    fontSize: "13px",
    "&.Mui-focused": {
      color: "#6366f1",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontFamily: "Inter, sans-serif !important",
    fontSize: "14px",
    padding: "8px 14px",
    "&::placeholder": {
      color: "#64748b",
    },
  },
  "& .MuiSelect-select": {
    fontFamily: "Inter, sans-serif !important",
    fontSize: "14px",
  },
});

const WithdrawalLimitSetting = () => {
  const [settings, setSettings] = useState({
    withdrawalStartHour: "",
    withdrawalStartPeriod: "AM",
    withdrawalEndHour: "",
    withdrawalEndPeriod: "PM",
    maxWithdrawRequestsPerDay: "",
    minWithdrawAmount: "",
    maxWithdrawAmount: "",
    isAllTimeWithdrawal: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { axiosInstance } = useAuth();

  const convertTo12HourFormat = (hour) => {
    if (hour === 0) return { hour: 12, period: "AM" };
    if (hour === 12) return { hour: 12, period: "PM" };
    if (hour > 12) return { hour: hour - 12, period: "PM" };
    return { hour, period: "AM" };
  };

  const convertTo24HourFormat = (hour, period) => {
    if (period === "PM" && hour !== 12) return hour + 12;
    if (period === "AM" && hour === 12) return 0;
    return hour;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/wallet/withdraw/settings`, {
        withCredentials: true,
      });

      const data = response.data.data;
      const startTime = convertTo12HourFormat(data.withdrawalStartHour);
      const endTime = convertTo12HourFormat(data.withdrawalEndHour);

      setSettings({
        withdrawalStartHour: startTime.hour,
        withdrawalStartPeriod: startTime.period,
        withdrawalEndHour: endTime.hour,
        withdrawalEndPeriod: endTime.period,
        maxWithdrawRequestsPerDay: data.maxWithdrawRequestsPerDay,
        minWithdrawAmount: data.minWithdrawAmount,
        maxWithdrawAmount: data.maxWithdrawAmount,
        isAllTimeWithdrawal:
          data.withdrawalStartHour === 0 && data.withdrawalEndHour === 23,
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
      showSnackbar("Error fetching settings", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("Hour")
          ? Math.min(Math.max(parseInt(value) || "", 0), 12)
          : name.includes("Amount") || name.includes("RequestsPerDay")
          ? parseInt(value, 10) || ""
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...settings };

      if (settings.isAllTimeWithdrawal) {
        dataToSubmit.withdrawalStartHour = 0;
        dataToSubmit.withdrawalStartPeriod = "AM";
        dataToSubmit.withdrawalEndHour = 23;
        dataToSubmit.withdrawalEndPeriod = "PM";
      } else {
        dataToSubmit.withdrawalStartHour = convertTo24HourFormat(
          parseInt(settings.withdrawalStartHour),
          settings.withdrawalStartPeriod
        );
        dataToSubmit.withdrawalEndHour = convertTo24HourFormat(
          parseInt(settings.withdrawalEndHour),
          settings.withdrawalEndPeriod
        );
      }

      delete dataToSubmit.isAllTimeWithdrawal;

      await axiosInstance.post(
        `${domain}/api/wallet/withdraw/admin/settings`,
        dataToSubmit,
        { withCredentials: true }
      );
      
      showSnackbar("Settings updated successfully", "success");
      fetchSettings();
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to update settings",
        "error"
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledContainer sx={{minWidth:"100%"}}>
        <StyledPaper>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Inter, sans-serif !important",
              fontSize: "18px",
              fontWeight: 600,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            Withdrawal Limits Configuration
          </Typography>
          <Tooltip title="Configure withdrawal time windows and amount limits">
            <IconButton size="small" sx={{ ml: 0.5, color: "#94a3b8" }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.isAllTimeWithdrawal}
                  onChange={handleChange}
                  name="isAllTimeWithdrawal"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#6366f1",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#6366f1",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    fontSize: "14px",
                    color: "#94a3b8",
                  }}
                >
                  Enable 24/7 Withdrawals
                </Typography>
              }
            />
          </Box>

          {!settings.isAllTimeWithdrawal && (
            <>
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif !important",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  mb: 1,
                }}
              >
                Withdrawal Time Window
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <CustomTextField
                    fullWidth
                    name="withdrawalStartHour"
                    label="Start Hour"
                    type="number"
                    value={settings.withdrawalStartHour}
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 12 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    select
                    fullWidth
                    name="withdrawalStartPeriod"
                    label="Period"
                    value={settings.withdrawalStartPeriod}
                    onChange={handleChange}
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    fullWidth
                    name="withdrawalEndHour"
                    label="End Hour"
                    type="number"
                    value={settings.withdrawalEndHour}
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 12 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    select
                    fullWidth
                    name="withdrawalEndPeriod"
                    label="Period"
                    value={settings.withdrawalEndPeriod}
                    onChange={handleChange}
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </CustomTextField>
                </Grid>
              </Grid>
            </>
          )}

          <Typography
            sx={{
              fontFamily: "Inter, sans-serif !important",
              fontSize: "13px",
              fontWeight: 500,
              color: "#94a3b8",
              mb: 1,
            }}
          >
            Withdrawal Limits
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                name="maxWithdrawRequestsPerDay"
                label="Maximum Withdrawal Requests Per Day"
                type="number"
                value={settings.maxWithdrawRequestsPerDay}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                name="minWithdrawAmount"
                label="Minimum Withdrawal Amount"
                type="number"
                value={settings.minWithdrawAmount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif !important",
                        fontSize: "14px",
                        color: "#94a3b8",
                        mr: 0.5,
                      }}
                    >
                      pkr 
                    </Typography>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                name="maxWithdrawAmount"
                label="Maximum Withdrawal Amount"
                type="number"
                value={settings.maxWithdrawAmount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif !important",
                        fontSize: "14px",
                        color: "#94a3b8",
                        mr: 0.5,
                      }}
                    >
                      pkr 
                    </Typography>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              fontFamily: "Inter, sans-serif !important",
              mt: 3,
              height: "40px",
              backgroundColor: "#6366f1",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#818cf8",
                boxShadow: "none",
              },
            }}
          >
            Save Changes
          </Button>
        </form>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontFamily: "Inter, sans-serif !important",
            "& .MuiAlert-message": {
              fontFamily: "Inter, sans-serif !important",
              fontSize: "14px",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default WithdrawalLimitSetting;