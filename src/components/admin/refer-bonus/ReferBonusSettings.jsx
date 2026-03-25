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
    IconButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

const ReferBonusSettings = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // States
    const [minimumDepositAmount, setMinimumDepositAmount] = useState("");
    const [referBonusAmount, setReferBonusAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const { axiosInstance } = useAuth();

    // Fetch current refer bonus settings
    useEffect(() => {
        fetchReferBonusSettings();
    }, []);

    const fetchReferBonusSettings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${domain}/api/additional/refer-bonus/settings`);
            if (response.data.data) {
                const { minimumDepositAmount, referBonusAmount } = response.data.data;
                setMinimumDepositAmount(minimumDepositAmount !== undefined ? minimumDepositAmount.toString() : "");
                setReferBonusAmount(referBonusAmount !== undefined ? referBonusAmount.toString() : "");
            }
        } catch (err) {
            showNotification("Failed to fetch refer bonus settings", "error");
            console.error("Error fetching refer bonus:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReferBonusSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        const minDepositValue = parseFloat(minimumDepositAmount);
        const bonusValue = parseFloat(referBonusAmount);

        if (isNaN(minDepositValue) || minDepositValue < 0) {
            showNotification("Please enter a valid non-negative number for minimum deposit", "error");
            return;
        }

        if (isNaN(bonusValue) || bonusValue < 0) {
            showNotification("Please enter a valid non-negative number for bonus amount", "error");
            return;
        }

        try {
            setSubmitting(true);
            await axiosInstance.put(`${domain}/api/additional/refer-bonus/settings`, {
                minimumDepositAmount: minDepositValue,
                referBonusAmount: bonusValue
            });

            showNotification("Refer bonus settings updated successfully", "success");
            fetchReferBonusSettings();
        } catch (err) {
            showNotification(
                err.response?.data?.message || "Failed to update refer bonus settings",
                "error"
            );
            console.error("Error updating refer bonus:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const showNotification = (message, severity) => {
        setNotification({
            open: true,
            message,
            severity
        });

        // Auto-hide after 4 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, open: false }));
        }, 4000);
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <CircularProgress
                    size={36}
                    thickness={4}
                    sx={{
                        color: "#f8fafc",
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
            </Box>
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
                    // border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)',
                    },
                    // mt: 4
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: "#f8fafc",
                        mb: 4,
                        fontFamily: 'Inter, sans-serif',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 40,
                            height: 3,
                            backgroundColor: "#6366f1",
                            borderRadius: 1,
                        }
                    }}
                >
                    Refer Bonus Settings
                    <Tooltip title="Configure refer bonus and minimum deposit requirement">
                        <InfoOutlinedIcon sx={{ fontSize: 20, color: '#94a3b8', opacity: 0.9 }} />
                    </Tooltip>
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleReferBonusSubmit}
                    sx={{
                        '& .MuiTextField-root': {
                            mb: 3,
                            transition: 'transform 0.2s',
                            '&:focus-within': {
                                transform: 'scale(1.01)',
                            }
                        }
                    }}
                >
                    <TextField
                        fullWidth
                        label="Minimum Deposit Amount"
                        value={minimumDepositAmount}
                        onChange={(e) => setMinimumDepositAmount(e.target.value)}
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">pkr  </InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'Inter, sans-serif',
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: "#6366f1",
                                    borderWidth: '2px',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: "#6366f1",
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontFamily: 'Inter, sans-serif',
                                '&.Mui-focused': {
                                    color: "#6366f1",
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Refer Bonus Amount"
                        value={referBonusAmount}
                        onChange={(e) => setReferBonusAmount(e.target.value)}
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">pkr </InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: 'Inter, sans-serif',
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: "#6366f1",
                                    borderWidth: '2px',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: "#6366f1",
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontFamily: 'Inter, sans-serif',
                                '&.Mui-focused': {
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
                                '& .MuiAlert-message': {
                                    fontFamily: 'Inter, sans-serif',
                                }
                            }}
                        >
                            Referring users will receive the specified bonus amount when someone they referred makes a first deposit that meets or exceeds the minimum amount. 
                        </Alert>
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{
                            bgcolor: "#6366f1",
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            py: 1.8,
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                                bgcolor: "#818cf8",
                                boxShadow: '0 4px 12px rgba(7,18,81,0.2)',
                                '&:before': {
                                    transform: 'translateX(100%)',
                                }
                            },
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)',
                                transform: 'translateX(-100%)',
                                transition: 'transform 0.6s',
                            }
                        }}
                    >
                        {submitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Update Refer Bonus"
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
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.875rem',
                                borderRadius: 2,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                '& .MuiAlert-message': {
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                },
                                '& .MuiAlert-icon': {
                                    fontSize: '1.25rem',
                                    opacity: 0.9,
                                },
                                bgcolor: notification.severity === 'success'
                                    ? 'success.dark'
                                    : 'error.dark',
                                animation: 'slideIn 0.3s ease-out',
                                '@keyframes slideIn': {
                                    from: {
                                        transform: 'translateY(20px)',
                                        opacity: 0,
                                    },
                                    to: {
                                        transform: 'translateY(0)',
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

export default ReferBonusSettings;