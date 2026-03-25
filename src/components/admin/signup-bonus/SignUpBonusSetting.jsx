import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../../../context/AuthContext";
import { domain } from "../../../utils/Secret";

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
});

const SignUpBonusSetting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // States
  const [defaultWalletAmount, setDefaultWalletAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { axiosInstance } = useAuth();

  // Fetch current default wallet amount
  useEffect(() => {
    fetchDefaultWalletAmount();
  }, []);

  const fetchDefaultWalletAmount = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${domain}/api/user/default-wallet`
      );
      if (response.data.body) {
        const { amount } = response.data.body;
        setDefaultWalletAmount(amount !== undefined ? amount.toString() : "");
      }
    } catch (err) {
      showNotification("Failed to fetch default wallet amount", "error");
      console.error("Error fetching default wallet amount:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaultWalletSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    const walletAmount = parseFloat(defaultWalletAmount);

    if (isNaN(walletAmount) || walletAmount < 0) {
      showNotification("Please enter a valid non-negative number", "error");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post(`${domain}/api/user/signupBonus`, {
        defaultWalletAmount: walletAmount,
      });

      showNotification("Default wallet amount updated successfully", "success");
      fetchDefaultWalletAmount();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update default wallet amount",
        "error"
      );
      console.error("Error updating default wallet amount:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{
            background: "#0f172a",
            backdropFilter: "blur(8px)",
          }}
        >
          <CircularProgress
            size={36}
            thickness={4}
            sx={{
              color: "#6366f1",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          height: "100%",
          border: "1px solid rgba(148, 163, 184, 0.12)",
          background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            transform: "translateY(-2px)",
          },
        }}
      >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#f8fafc",
          mb: 4,
          fontFamily: "Inter, sans-serif",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1,
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 40,
            height: 3,
            backgroundColor: "#6366f1",
            borderRadius: 1,
          },
        }}
      >
        Default Wallet Settings
        <Tooltip title="Configure default wallet amount for new users">
          <InfoOutlinedIcon
            sx={{ fontSize: 20, color: "#94a3b8", opacity: 0.9 }}
          />
        </Tooltip>
      </Typography>

      <Box
        component="form"
        onSubmit={handleDefaultWalletSubmit}
        sx={{
          "& .MuiTextField-root": {
            mb: 3,
            transition: "transform 0.2s",
            "&:focus-within": {
              transform: "scale(1.01)",
            },
          },
        }}
      >
        <TextField
          fullWidth
          label="Default Wallet Amount"
          value={defaultWalletAmount}
          onChange={(e) => setDefaultWalletAmount(e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">₹  </InputAdornment>,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "Inter, sans-serif",
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#6366f1",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
              },
            },
            "& .MuiInputLabel-root": {
              fontFamily: "Inter, sans-serif",
              "&.Mui-focused": {
                color: "#6366f1",
              },
            },
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontFamily: "Inter, sans-serif",
              },
            }}
          >
            This amount will be automatically added to new users' wallets upon
            registration.
          </Alert>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            bgcolor: "#6366f1",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            py: 1.8,
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "none",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              bgcolor: "#818cf8",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              "&:before": {
                transform: "translateX(100%)",
              },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)",
              transform: "translateX(-100%)",
              transition: "transform 0.6s",
            },
          }}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Default Wallet"
          )}
        </Button>
      </Box>

        {notification.open && (
        <Fade in={notification.open} timeout={300}>
          <Alert
            severity={notification.severity}
            variant="filled"
            sx={{
              mt: 3,
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              "& .MuiAlert-message": {
                fontSize: "0.875rem",
                fontWeight: 500,
              },
              "& .MuiAlert-icon": {
                fontSize: "1.25rem",
                opacity: 0.9,
              },
              bgcolor:
                notification.severity === "success"
                  ? "success.dark"
                  : "error.dark",
              animation: "slideIn 0.3s ease-out",
              "@keyframes slideIn": {
                from: {
                  transform: "translateY(20px)",
                  opacity: 0,
                },
                to: {
                  transform: "translateY(0)",
                  opacity: 1,
                },
              },
            }}
          >
            {notification.message}
          </Alert>
        </Fade>
      )}
      </Paper>
    </ThemeProvider>
  );
};

export default SignUpBonusSetting;
