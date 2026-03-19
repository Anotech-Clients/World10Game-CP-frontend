import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Fade,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  InputAdornment,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  InfoOutlined as InfoOutlinedIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CurrencyBitcoin as CurrencyBitcoinIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { domain } from "../../../utils/Secret";
import DepositBonusSettings from "../../../components/admin/recharge-bonus/DepositBonusSettings";
import ReferBonusSettings from "../../../components/admin/refer-bonus/ReferBonusSettings";
import NeedToDepositSettings from "../../../components/admin/need-to-deposit/NeedToDepositSettings";
import SignUpBonusSetting from "../../../components/admin/signup-bonus/SignUpBonusSetting";
import TelegramChannelManagement from "../../../components/admin/add-telegram/AddTelegram.jsx";

// Dark theme configuration
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

const AdminSettings = () => {
  const { axiosInstance } = useAuth();

  // ========================
  // UPI STATE
  // ========================
  const [upiList, setUpiList] = useState([]);
  const [upiForm, setUpiForm] = useState({
    id: null,
    upiId: "",
    label: "",
    priority: 0,
    imageUrl: null,
  });
  const [upiImage, setUpiImage] = useState(null);
  const [upiImagePreview, setUpiImagePreview] = useState(null);
  const [upiLoading, setUpiLoading] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);

  // ========================
  // TRX STATE
  // ========================
  const [trxList, setTrxList] = useState([]);
  const [trxForm, setTrxForm] = useState({
    id: null,
    trxAddress: "",
    label: "",
    priority: 0,
    trxImageUrl: null,
  });
  const [trxImage, setTrxImage] = useState(null);
  const [trxImagePreview, setTrxImagePreview] = useState(null);
  const [trxLoading, setTrxLoading] = useState(false);
  const [showTrxForm, setShowTrxForm] = useState(false);

  // ========================
  // COMMISSION STATE
  // ========================
  const [commissions, setCommissions] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});

  // ========================
  // GENERAL STATE
  // ========================
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null,
    id: null,
    name: ""
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    data: null,
    type: null
  });

  // ========================
  // INITIAL DATA LOADING
  // ========================
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUpiList(),
        fetchTrxList(),
        fetchCommissions()
      ]);
    } catch (error) {
      showNotification("Failed to fetch settings data", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // UPI DATA FETCHING
  // ========================
  const fetchUpiList = async () => {
    try {
      const response = await axiosInstance.get("/api/upi/admin/upi/all");
      setUpiList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching UPI list:", error);
      setUpiList([]);
    }
  };

  // ========================
  // TRX DATA FETCHING
  // ========================
  const fetchTrxList = async () => {
    try {
      const response = await axiosInstance.get("/api/upi/admin/trx/all");
      setTrxList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching TRX list:", error);
      setTrxList([]);
    }
  };

  // ========================
  // COMMISSION DATA FETCHING
  // ========================
  const fetchCommissions = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/admin/settings-update/level-commissions`);
      setCommissions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      setCommissions([]);
    }
  };

  // ========================
  // UPI HANDLERS
  // ========================
  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    
    if (!upiForm.upiId || upiForm.upiId.trim().length === 0) {
      showNotification("UPI ID is required", "error");
      return;
    }

    setUpiLoading(true);

    try {
      const formData = new FormData();
      formData.append("upiId", upiForm.upiId.trim());
      formData.append("label", upiForm.label || "");
      formData.append("priority", upiForm.priority.toString());

      if (upiImage) {
        formData.append("qrImage", upiImage);
      }

      if (upiForm.id) {
        await axiosInstance.put(`/api/upi/admin/upi/${upiForm.id}`, formData);
        showNotification("UPI settings updated successfully", "success");
      } else {
        await axiosInstance.post("/api/upi/admin/upi", formData);
        showNotification("UPI settings created successfully", "success");
      }

      resetUpiForm();
      fetchUpiList();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to save UPI settings",
        "error"
      );
    } finally {
      setUpiLoading(false);
    }
  };

  const handleEditUpi = (upi) => {
    setUpiForm({
      id: upi.id,
      upiId: upi.upiId || "",
      label: upi.label || "",
      priority: upi.priority || 0,
      imageUrl: upi.imageUrl,
    });
    setUpiImagePreview(upi.imageUrl);
    setUpiImage(null);
    setShowUpiForm(true);
  };

  const handleDeleteUpi = async () => {
    try {
      await axiosInstance.delete(`/api/upi/admin/upi/${deleteDialog.id}`);
      showNotification("UPI settings deleted successfully", "success");
      fetchUpiList();
      closeDeleteDialog();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to delete UPI settings",
        "error"
      );
    }
  };

  const handleToggleUpiStatus = async (id) => {
    try {
      await axiosInstance.patch(`/api/upi/admin/toggle/${id}`);
      showNotification("UPI status updated successfully", "success");
      fetchUpiList();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to toggle status",
        "error"
      );
    }
  };

  const handleUpiImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size should be less than 5MB", "error");
        return;
      }
      setUpiImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpiImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetUpiForm = () => {
    setUpiForm({
      id: null,
      upiId: "",
      label: "",
      priority: 0,
      imageUrl: null,
    });
    setUpiImage(null);
    setUpiImagePreview(null);
    setShowUpiForm(false);
  };

  // ========================
  // TRX HANDLERS
  // ========================
  const handleTrxSubmit = async (e) => {
    e.preventDefault();
    
    if (!trxForm.trxAddress || trxForm.trxAddress.trim().length === 0) {
      showNotification("TRX address is required", "error");
      return;
    }

    setTrxLoading(true);

    try {
      const formData = new FormData();
      formData.append("trxAddress", trxForm.trxAddress.trim());
      formData.append("label", trxForm.label || "");
      formData.append("priority", trxForm.priority.toString());

      if (trxImage) {
        formData.append("trxImage", trxImage);
      }

      if (trxForm.id) {
        await axiosInstance.put(`/api/upi/admin/trx/${trxForm.id}`, formData);
        showNotification("TRX settings updated successfully", "success");
      } else {
        await axiosInstance.post("/api/upi/admin/trx", formData);
        showNotification("TRX settings created successfully", "success");
      }

      resetTrxForm();
      fetchTrxList();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to save TRX settings",
        "error"
      );
    } finally {
      setTrxLoading(false);
    }
  };

  const handleEditTrx = (trx) => {
    setTrxForm({
      id: trx.id,
      trxAddress: trx.trxAddress || "",
      label: trx.label || "",
      priority: trx.priority || 0,
      trxImageUrl: trx.trxImageUrl,
    });
    setTrxImagePreview(trx.trxImageUrl);
    setTrxImage(null);
    setShowTrxForm(true);
  };

  const handleDeleteTrx = async () => {
    try {
      await axiosInstance.delete(`/api/upi/admin/trx/${deleteDialog.id}`);
      showNotification("TRX settings deleted successfully", "success");
      fetchTrxList();
      closeDeleteDialog();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to delete TRX settings",
        "error"
      );
    }
  };

  const handleToggleTrxStatus = async (id) => {
    try {
      await axiosInstance.patch(`/api/upi/admin/toggle/${id}`);
      showNotification("TRX status updated successfully", "success");
      fetchTrxList();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to toggle status",
        "error"
      );
    }
  };

  const handleTrxImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size should be less than 5MB", "error");
        return;
      }
      setTrxImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTrxImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTrxForm = () => {
    setTrxForm({
      id: null,
      trxAddress: "",
      label: "",
      priority: 0,
      trxImageUrl: null,
    });
    setTrxImage(null);
    setTrxImagePreview(null);
    setShowTrxForm(false);
  };

  // ========================
  // COMMISSION HANDLERS
  // ========================
  const handleCommissionChange = (id, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleCommissionUpdate = async (id) => {
    try {
      const changes = pendingChanges[id];
      if (!changes) return;

      await axiosInstance.put(`/api/admin/settings-update/level-commission/${id}`, changes);
      showNotification("Commission updated successfully", "success");
      fetchCommissions();
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update commission",
        "error"
      );
    }
  };

  // ========================
  // UTILITY FUNCTIONS
  // ========================
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (_, reason) => {
    if (reason === "clickaway") return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  const openDeleteDialog = (type, id, name) => {
    setDeleteDialog({
      open: true,
      type,
      id,
      name
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      type: null,
      id: null,
      name: ""
    });
  };

  const openViewDialog = (data, type) => {
    setViewDialog({
      open: true,
      data,
      type
    });
  };

  const closeViewDialog = () => {
    setViewDialog({
      open: false,
      data: null,
      type: null
    });
  };

  // ========================
  // RENDER PAYMENT CARD
  // ========================
  const renderPaymentCard = (item, type) => {
    const isUpi = type === "UPI";
    const address = isUpi ? item.upiId : item.trxAddress;
    const imageUrl = isUpi ? item.imageUrl : item.trxImageUrl;
    const isActive = item.status === "ACTIVE";

    return (
      <Card
        key={item.id}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          border: "1px solid",
          borderColor: isActive ? "#6366f1" : "divider",
          background: isActive 
            ? "linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.08) 100%)"
            : "linear-gradient(145deg, #1e293b 0%, rgba(148, 163, 184, 0.05) 100%)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isUpi ? (
                <AccountBalanceWalletIcon sx={{ color: "#6366f1", fontSize: 28 }} />
              ) : (
                <CurrencyBitcoinIcon sx={{ color: "#6366f1", fontSize: 28 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#f8fafc" }}>
                {type}
              </Typography>
            </Box>
            <Chip
              label={isActive ? "Active" : "Inactive"}
              size="small"
              icon={isActive ? <CheckCircleIcon /> : <CancelIcon />}
              sx={{
                bgcolor: isActive ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: isActive ? "#22c55e" : "#ef4444",
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          </Box>

          {item.label && (
            <Chip
              label={item.label}
              size="small"
              sx={{
                mb: 2,
                bgcolor: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                fontWeight: 500,
              }}
            />
          )}

          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
              mb: 1,
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: "0.7rem",
              letterSpacing: "0.5px",
            }}
          >
            {isUpi ? "UPI ID" : "Wallet Address"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#f8fafc",
              mb: 2,
              fontFamily: "monospace",
              bgcolor: "rgba(99, 102, 241, 0.05)",
              p: 1.5,
              borderRadius: 2,
              wordBreak: "break-all",
              fontSize: "0.875rem",
            }}
          >
            {address}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Priority: <strong style={{ color: "#f8fafc" }}>{item.priority}</strong>
            </Typography>
            {imageUrl && (
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => openViewDialog(item, type)}
                sx={{
                  color: "#6366f1",
                  textTransform: "none",
                  fontSize: "0.75rem",
                }}
              >
                View QR
              </Button>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={() => isUpi ? handleToggleUpiStatus(item.id) : handleToggleTrxStatus(item.id)}
                size="small"
              />
            }
            label={<Typography variant="caption" sx={{ color: "#94a3b8" }}>Active</Typography>}
            sx={{ flex: 1, m: 0 }}
          />
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => isUpi ? handleEditUpi(item) : handleEditTrx(item)}
              sx={{ color: "#6366f1" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => openDeleteDialog(type, item.id, address)}
              sx={{ color: "#ef4444" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    );
  };

  // ========================
  // LOADING STATE
  // ========================
  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
          sx={{ backgroundColor: "#0f172a" }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: "#6366f1",
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  // ========================
  // MAIN RENDER
  // ========================
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ backgroundColor: "#0f172a", p: 3, minHeight: '100vh', borderRadius: '16px' }}>
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            borderRadius: 3,
            p: { xs: 3, md: 3 },
            color: 'white',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.5px',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 4,
                backgroundColor: '#fff',
                borderRadius: 2,
              }
            }}
          >
            Admin Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontFamily: 'Inter, sans-serif',
              mt: 3,
            }}
          >
            Manage payment configurations, commission structure, and bonus settings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* ======================== */}
          {/* UPI PAYMENT SECTION */}
          {/* ======================== */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 32, color: "#6366f1" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: "#f8fafc" }}>
                    UPI Payment Methods
                  </Typography>
                  <Chip
                    label={`${upiList.length} Total`}
                    size="small"
                    sx={{ bgcolor: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={showUpiForm ? <CancelIcon /> : <AddIcon />}
                  disabled={!showUpiForm && upiList.length >= 1}
                  onClick={() => {
                    if (showUpiForm) {
                      resetUpiForm();
                    } else {
                      setShowUpiForm(true);
                    }
                  }}
                  sx={{
                    bgcolor: showUpiForm ? "#64748b" : "#6366f1",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: showUpiForm ? "#475569" : "#818cf8",
                    }
                  }}
                >
                  {showUpiForm ? "Cancel" : "Add New UPI"}
                </Button>
              </Box>

              {/* UPI Form */}
              {showUpiForm && (
                <Fade in={showUpiForm}>
                  <Box
                    component="form"
                    onSubmit={handleUpiSubmit}
                    sx={{
                      mb: 4,
                      p: 3,
                      bgcolor: "rgba(99, 102, 241, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          value={upiForm.upiId}
                          onChange={(e) => setUpiForm(prev => ({ ...prev, upiId: e.target.value }))}
                          required
                          placeholder="example@paytm"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Label (Optional)"
                          value={upiForm.label}
                          onChange={(e) => setUpiForm(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Primary Account"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Priority"
                          type="number"
                          value={upiForm.priority}
                          onChange={(e) => setUpiForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 3,
                            border: "2px dashed rgba(148, 163, 184, 0.3)",
                            borderRadius: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              borderColor: "#6366f1",
                              bgcolor: "rgba(99, 102, 241, 0.05)",
                            }
                          }}
                          onClick={() => document.getElementById("upi-qr-upload").click()}
                        >
                          <input
                            id="upi-qr-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleUpiImageChange}
                            style={{ display: "none" }}
                          />
                          <CloudUploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                          <Typography sx={{ color: "#94a3b8", mb: 1 }}>
                            Click to upload UPI QR code
                          </Typography>
                          {upiImagePreview && (
                            <Box
                              component="img"
                              src={upiImagePreview}
                              alt="UPI QR Preview"
                              sx={{
                                mt: 2,
                                maxWidth: 200,
                                maxHeight: 200,
                                borderRadius: 2,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          disabled={upiLoading}
                          sx={{
                            bgcolor: "#6366f1",
                            py: 1.5,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#818cf8" },
                          }}
                        >
                          {upiLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            upiForm.id ? "Update UPI Settings" : "Create UPI Settings"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* UPI List */}
              {upiList.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 64, color: "#475569", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#94a3b8", mb: 1 }}>
                    No UPI Payment Methods
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Add your first UPI payment method to get started
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {upiList.map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      {renderPaymentCard(item, "UPI")}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* ======================== */}
          {/* TRX PAYMENT SECTION */}
          {/* ======================== */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CurrencyBitcoinIcon sx={{ fontSize: 32, color: "#6366f1" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: "#f8fafc" }}>
                    TRX Payment Methods
                  </Typography>
                  <Chip
                    label={`${trxList.length} Total`}
                    size="small"
                    sx={{ bgcolor: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={showTrxForm ? <CancelIcon /> : <AddIcon />}
                    disabled={!showTrxForm && trxList.length >= 1}
                  onClick={() => {
                    if (showTrxForm) {
                      resetTrxForm();
                    } else {
                      setShowTrxForm(true);
                    }
                  }}
                  sx={{
                    bgcolor: showTrxForm ? "#64748b" : "#6366f1",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: showTrxForm ? "#475569" : "#818cf8",
                    }
                  }}
                >
                  {showTrxForm ? "Cancel" : "Add New TRX"}
                </Button>
              </Box>

              {/* TRX Form */}
              {showTrxForm && (
                <Fade in={showTrxForm}>
                  <Box
                    component="form"
                    onSubmit={handleTrxSubmit}
                    sx={{
                      mb: 4,
                      p: 3,
                      bgcolor: "rgba(99, 102, 241, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="TRX Wallet Address"
                          value={trxForm.trxAddress}
                          onChange={(e) => setTrxForm(prev => ({ ...prev, trxAddress: e.target.value }))}
                          required
                          placeholder="TAbcDefGhijk123..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              fontFamily: "monospace",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Label (Optional)"
                          value={trxForm.label}
                          onChange={(e) => setTrxForm(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Main Wallet"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Priority"
                          type="number"
                          value={trxForm.priority}
                          onChange={(e) => setTrxForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: "#f8fafc",
                              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.3)" },
                              "&:hover fieldset": { borderColor: "#6366f1" },
                              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#94a3b8",
                              "&.Mui-focused": { color: "#6366f1" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 3,
                            border: "2px dashed rgba(148, 163, 184, 0.3)",
                            borderRadius: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              borderColor: "#6366f1",
                              bgcolor: "rgba(99, 102, 241, 0.05)",
                            }
                          }}
                          onClick={() => document.getElementById("trx-qr-upload").click()}
                        >
                          <input
                            id="trx-qr-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleTrxImageChange}
                            style={{ display: "none" }}
                          />
                          <CloudUploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                          <Typography sx={{ color: "#94a3b8", mb: 1 }}>
                            Click to upload TRX QR code
                          </Typography>
                          {trxImagePreview && (
                            <Box
                              component="img"
                              src={trxImagePreview}
                              alt="TRX QR Preview"
                              sx={{
                                mt: 2,
                                maxWidth: 200,
                                maxHeight: 200,
                                borderRadius: 2,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          disabled={trxLoading}
                          sx={{
                            bgcolor: "#6366f1",
                            py: 1.5,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#818cf8" },
                          }}
                        >
                          {trxLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            trxForm.id ? "Update TRX Settings" : "Create TRX Settings"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* TRX List */}
              {trxList.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <CurrencyBitcoinIcon sx={{ fontSize: 64, color: "#475569", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#94a3b8", mb: 1 }}>
                    No TRX Payment Methods
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Add your first TRX wallet address to get started
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {trxList.map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      {renderPaymentCard(item, "TRX")}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* ======================== */}
          {/* COMMISSION SETTINGS */}
          {/* ======================== */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                }
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
                    backgroundColor: '#6366f1',
                    borderRadius: 1,
                  }
                }}
              >
                Commission Settings
                <Tooltip title="Manage commission rates for different levels">
                  <InfoOutlinedIcon sx={{ fontSize: 20, color: '#94a3b8', opacity: 0.9 }} />
                </Tooltip>
              </Typography>

              <Grid container spacing={3}>
                {commissions.map((commission) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={commission.id}>
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: 'space-between' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#f8fafc",
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          Level {commission.level}
                        </Typography>
                        <Tooltip
                          title={`Commission settings for Level ${commission.level}`}
                          arrow
                          placement="top"
                        >
                          <IconButton size="small">
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <TextField
                        label="Commission Rate"
                        type="number"
                        value={pendingChanges[commission.id]?.commission ?? commission.commission}
                        onChange={(e) => handleCommissionChange(commission.id, "commission", e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        fullWidth
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Inter, sans-serif',
                            '&.Mui-focused': {
                              color: '#6366f1',
                            },
                          },
                        }}
                      />

                      {pendingChanges[commission.id] && (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleCommissionUpdate(commission.id)}
                          sx={{
                            bgcolor: "#6366f1",
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            py: 1.5,
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: 'none',
                            '&:hover': {
                              bgcolor: "#818cf8",
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            }
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* ======================== */}
          {/* OTHER SETTINGS COMPONENTS */}
          {/* ======================== */}
          <Grid item xs={12}>
            <NeedToDepositSettings />
          </Grid>

          <Grid item xs={12}>
            <SignUpBonusSetting />
          </Grid>

          <Grid item xs={12}>
            <DepositBonusSettings />
          </Grid>

          <Grid item xs={12}>
            <ReferBonusSettings />
          </Grid>

          <Grid item xs={12}>
            <TelegramChannelManagement />
          </Grid>
        </Grid>

        {/* ======================== */}
        {/* DELETE CONFIRMATION DIALOG */}
        {/* ======================== */}
        <Dialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          PaperProps={{
            sx:{
              bgcolor: "#1e293b",
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }
          }}
        >
          <DialogTitle sx={{ color: "#f8fafc", fontWeight: 600 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#94a3b8", mb: 2 }}>
              Are you sure you want to delete this {deleteDialog.type} payment method?
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(239, 68, 68, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Typography sx={{ color: "#ef4444", fontFamily: "monospace", fontSize: "0.875rem" }}>
                {deleteDialog.name}
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2, bgcolor: "rgba(251, 191, 36, 0.1)" }}>
              This action cannot be undone. The QR code will also be permanently deleted.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={closeDeleteDialog}
              sx={{ color: "#94a3b8", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteDialog.type === "UPI" ? handleDeleteUpi : handleDeleteTrx}
              variant="contained"
              sx={{
                bgcolor: "#ef4444",
                textTransform: "none",
                "&:hover": { bgcolor: "#dc2626" }
              }}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* ======================== */}
        {/* VIEW QR CODE DIALOG */}
        {/* ======================== */}
        <Dialog
          open={viewDialog.open}
          onClose={closeViewDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#1e293b",
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }
          }}
        >
          <DialogTitle sx={{ color: "#f8fafc", fontWeight: 600 }}>
            {viewDialog.type} QR Code
          </DialogTitle>
          <DialogContent>
            {viewDialog.data && (
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={viewDialog.type === "UPI" ? viewDialog.data.imageUrl : viewDialog.data.trxImageUrl}
                  alt={`${viewDialog.type} QR Code`}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 400,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    mb: 2,
                  }}
                />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    borderRadius: 2,
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                    {viewDialog.type === "UPI" ? "UPI ID" : "Wallet Address"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                    }}
                  >
                    {viewDialog.type === "UPI" ? viewDialog.data.upiId : viewDialog.data.trxAddress}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={closeViewDialog}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#6366f1",
                textTransform: "none",
                "&:hover": { bgcolor: "#818cf8" }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ======================== */}
        {/* NOTIFICATION SNACKBAR */}
        {/* ======================== */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          TransitionComponent={Fade}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            elevation={6}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminSettings;