import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
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

const TelegramChannelManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // States
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form states
  const [channelName, setChannelName] = useState("");
  const [channelLink, setChannelLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editChannelId, setEditChannelId] = useState(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);

  const { axiosInstance } = useAuth();

  // Fetch all WhatsApp Channels
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${domain}/api/additional/telegram-channel/get-telegram`
      );
      if (response.data) {
        setChannels(response.data);
      }
    } catch (err) {
      showNotification("Failed to fetch WhatsApp Channels", "error");
      console.error("Error fetching WhatsApp Channels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!channelName.trim() || !channelLink.trim()) {
      showNotification("Please enter both channel name and link", "error");
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEditing) {
        // Update existing channel
        await axiosInstance.put(
          `${domain}/api/additional/telegram-channel/update-telegram/${editChannelId}`,
          {
            name: channelName,
            link: channelLink,
          }
        );
        showNotification("WhatsApp Channel updated successfully", "success");
      } else {
        // Create new channel
        await axiosInstance.post(
          `${domain}/api/additional/telegram-channel/add-telegram`,
          {
            name: channelName,
            link: channelLink,
          }
        );
        showNotification("WhatsApp Channel added successfully", "success");
      }
      
      // Reset form and refresh data
      resetForm();
      fetchChannels();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
        (isEditing ? "Failed to update channel" : "Failed to add channel");
      showNotification(errorMsg, "error");
      console.error("Error submitting channel:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (channel) => {
    setChannelName(channel.name);
    setChannelLink(channel.link);
    setEditChannelId(channel.id);
    setIsEditing(true);
  };

  const handleDeleteConfirmation = (channel) => {
    setChannelToDelete(channel);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!channelToDelete) return;
    
    try {
      setSubmitting(true);
      await axiosInstance.delete(
        `${domain}/api/additional/telegram-channel/delete-telegram/${channelToDelete.id}`
      );
      showNotification("WhatsApp Channel deleted successfully", "success");
      fetchChannels();
    } catch (err) {
      showNotification("Failed to delete WhatsApp Channel", "error");
      console.error("Error deleting WhatsApp Channel:", err);
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
      setChannelToDelete(null);
    }
  };

  const resetForm = () => {
    setChannelName("");
    setChannelLink("");
    setIsEditing(false);
    setEditChannelId(null);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CircularProgress
          size={36}
          thickness={4}
          sx={{
            color: "#f8fafc",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
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
        // border: "1px solid",
        borderColor: "divider",
        background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
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
        WhatsApp Channel Management
        <Tooltip title="Manage WhatsApp Channels for user communication">
          <InfoOutlinedIcon
            sx={{ fontSize: 20, color: '#94a3b8', opacity: 0.9 }}
          />
        </Tooltip>
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mb: 4,
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
          label="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
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
                color: "#f8fafc",
              },
            },
          }}
        />

        <TextField
          fullWidth
          label="Channel Link"
          value={channelLink}
          onChange={(e) => setChannelLink(e.target.value)}
          InputProps={{
            startAdornment: (
              <LinkIcon sx={{ mr: 1, color: "#071251", opacity: 0.7 }} />
            ),
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
                color: "#f8fafc",
              },
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
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
                boxShadow: "0 4px 12px rgba(7,18,81,0.2)",
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
            ) : isEditing ? (
              "Update Channel"
            ) : (
              "Add Channel"
            )}
          </Button>

          {isEditing && (
            <Button
              variant="outlined"
              onClick={resetForm}
              sx={{
                color: "#f8fafc",
                borderColor: "#6366f1",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                py: 1.8,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(7,18,81,0.05)",
                },
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#f8fafc",
          mb: 2,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Channel List
      </Typography>

      {channels.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            "& .MuiAlert-message": {
              fontFamily: "Inter, sans-serif",
            },
          }}
        >
          No WhatsApp Channels added yet.
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            mb: 3,
            maxHeight: 400,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#f8fafc",
                    // backgroundColor: "#f5f7ff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Channel Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#f8fafc",
                    // backgroundColor: "#f5f7ff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Channel Link
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: "#f8fafc",
                    // backgroundColor: "#f5f7ff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {channels.map((channel) => (
                <TableRow
                  key={channel.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(7,18,81,0.02)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {channel.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LinkIcon
                        sx={{ mr: 1, fontSize: 16, color: "#ffffff", opacity: 0.7 }}
                      />
                      <a
                        href={channel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#ffffff",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {channel.link}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => handleEdit(channel)}
                        size="small"
                        color="primary"
                        sx={{ color: "#ffffff" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirmation(channel)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#f8fafc",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Inter, sans-serif" }}>
            Are you sure you want to delete the channel "
            {channelToDelete?.name || ""}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              color: "#f8fafc",
              borderColor: "#6366f1",
              fontFamily: "Inter, sans-serif",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#6366f1",
                backgroundColor: "rgba(7,18,81,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={submitting}
            sx={{
              fontFamily: "Inter, sans-serif",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Alert */}
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

export default TelegramChannelManagement;
