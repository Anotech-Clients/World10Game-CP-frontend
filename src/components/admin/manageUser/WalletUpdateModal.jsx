import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  Box,
  ThemeProvider,
  createTheme,
  alpha,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useAuth } from "../../../context/AuthContext";
import { domain } from "../../../utils/Secret";

// Custom theme with Inter font
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
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
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#f8fafc',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: '#f8fafc',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'Inter, sans-serif',
            '&.Mui-focused': {
              color: '#6366f1',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
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
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          boxShadow: 'none',
        },
      },
    },
  },
});

const WalletUpdateModal = ({ open, onClose, userId }) => {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("");
  const { axiosInstance } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!amount || !action) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const { data } = await axiosInstance.patch(
        `${domain}/api/admin/members/users/${userId}/wallet`,
        { amount: Number(amount), updateType: action },
        { withCredentials: true }
      );

      setSnackbarMessage(data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "An error occurred while updating the wallet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0px 4px 35px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ position: 'relative', p: 3 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              color: 'primary.main',
              mb: 3,
              fontSize: '1.75rem',
            }}
          >
            Update Wallet Balance
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="User ID"
                  value={userId}
                  fullWidth
                  disabled
                  sx={{
                    '& .Mui-disabled': {
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  fullWidth
                  required
                  placeholder="Enter amount"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ color: 'grey.600', mr: 1 }}>
                        pkr 
                      </Typography>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontFamily: 'Inter, sans-serif' }}>
                    Action
                  </InputLabel>
                  <Select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    label="Action"
                  >
                    <MenuItem value="INCREASE">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddIcon sx={{ mr: 1, color: 'success.main' }} />
                        Increase Balance
                      </Box>
                    </MenuItem>
                    <MenuItem value="DECREASE">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RemoveIcon sx={{ mr: 1, color: 'error.main' }} />
                        Decrease Balance
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                gap: 2,
                mt: 4 
              }}
            >
              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: alpha('#071251', 0.04),
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Update Balance
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default WalletUpdateModal;