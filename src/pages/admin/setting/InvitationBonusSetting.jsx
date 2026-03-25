import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Modal,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";

// Modern Dark theme
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

// Base font styles
const StyledContainer = styled('div')({
  fontFamily: 'Inter, sans-serif !important',
  '& *': {
    fontFamily: 'Inter, sans-serif !important'
  }
});

const StyledTypography = styled(Typography)({
  fontFamily: 'Inter, sans-serif !important',
  fontWeight: 500
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontFamily: 'Inter, sans-serif !important',
    color: '#f8fafc',
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Inter, sans-serif !important',
    color: '#94a3b8',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#6366f1'
    }
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    '& fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.2)'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(99, 102, 241, 0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1'
    }
  }
});

const AddButton = styled(Button)({
  fontFamily: 'Inter, sans-serif !important',
  backgroundColor: '#6366f1',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#818cf8'
  }
});

const EditButton = styled(Button)({
  fontFamily: 'Inter, sans-serif !important',
  textTransform: 'none',
  fontWeight: 500,
  color: '#6366f1',
  borderColor: 'rgba(148, 163, 184, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366f1'
  }
});

const StyledTableCell = styled(TableCell)({
  fontFamily: 'Inter, sans-serif !important',
  fontWeight: 500,
  padding: '16px',
  color: '#f8fafc',
  borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
  '&.header': {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    color: '#f8fafc',
    fontWeight: 600
  }
});
;

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
});

const ActionButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontWeight: 500,
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1e293b',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  p: 4,
};

const InvitationBonusSetting = () => {
  const [formData, setFormData] = useState({
    minSubordinates: "",
    minDepositAmount: "",
    bonusAmount: "",
  });
  const [existingRecords, setExistingRecords] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const { axiosInstance } = useAuth();

  useEffect(() => {
    fetchExistingRecords();
  }, []);

  const fetchExistingRecords = async () => {
    try {
      const response = await axiosInstance.get(`${domain}/api/activity/invitation-bonus/rules`);
      setExistingRecords(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching existing records:", error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      minSubordinates: "",
      minDepositAmount: "",
      bonusAmount: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const newRule = {
        requiredReferrals: parseInt(formData.minSubordinates, 10),
        minDepositAmount: parseFloat(formData.minDepositAmount),
        bonusAmount: parseFloat(formData.bonusAmount),
      };
      await axiosInstance.post(`${domain}/api/activity/invitation-bonus/rules`, newRule);
      fetchExistingRecords();
      resetForm();
    } catch (error) {
      console.error("Error submitting new rule:", error);
    }
  };

  const handleEditClick = (rule) => {
    setSelectedRule(rule);
    setFormData({
      minSubordinates: rule.requiredReferrals.toString(),
      minDepositAmount: rule.minDepositAmount.toString(),
      bonusAmount: rule.bonusAmount.toString(),
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedRule = {
        requiredReferrals: parseInt(formData.minSubordinates, 10),
        minDepositAmount: parseFloat(formData.minDepositAmount),
        bonusAmount: parseFloat(formData.bonusAmount),
      };
      await axiosInstance.put(
        `${domain}/api/activity/invitation-bonus/rules/${selectedRule.id}`,
        updatedRule
      );
      fetchExistingRecords();
      setEditModalOpen(false);
      setSelectedRule(null);
      resetForm();
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledContainer>
        <Container sx={{ 
          py: 3, 
          minWidth: '100%',
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            p={3}
            sx={{
              background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <StyledTypography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: '#f8fafc',
                fontSize: '1.75rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Invitation Bonus Dashboard
            </StyledTypography>
            <AddButton
              startIcon={<AddIcon />}
              onClick={handleSubmit}
            >
              Add New Rule
            </AddButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3,
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px'
              }}
            >
              <StyledTypography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: '#f8fafc',
                  fontSize: '1rem'
                }}
              >
                Add New Bonus Rule
              </StyledTypography>
              
              <Box component="form" noValidate autoComplete="off">
                <StyledTextField
                  fullWidth
                  label="Minimum Subordinates"
                  type="number"
                  value={formData.minSubordinates}
                  onChange={handleInputChange("minSubordinates")}
                  margin="normal"
                  InputProps={{
                    startAdornment: <PersonAddIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                  }}
                />
                <StyledTextField
                  fullWidth
                  label="Minimum Deposit Amount"
                  type="number"
                  value={formData.minDepositAmount}
                  onChange={handleInputChange("minDepositAmount")}
                  margin="normal"
                  InputProps={{
                    startAdornment: <MonetizationOnIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                  }}
                />
                <StyledTextField
                  fullWidth
                  label="Bonus Amount"
                  type="number"
                  value={formData.bonusAmount}
                  onChange={handleInputChange("bonusAmount")}
                  margin="normal"
                  InputProps={{
                    startAdornment: <CardGiftcardIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <StyledTypography 
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#f8fafc',
                    fontSize: '1rem'
                  }}
                >
                  Existing Bonus Rules
                </StyledTypography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell className="header">Sr No</StyledTableCell>
                      <StyledTableCell className="header">Min Subordinates</StyledTableCell>
                      <StyledTableCell className="header">Min Deposit</StyledTableCell>
                      <StyledTableCell className="header">Bonus Amount</StyledTableCell>
                      <StyledTableCell className="header">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingRecords.map((record, index) => (
                      <TableRow key={record.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{record.requiredReferrals}</StyledTableCell>
                        <StyledTableCell>pkr {record.minDepositAmount}</StyledTableCell>
                        <StyledTableCell>pkr {record.bonusAmount}</StyledTableCell>
                        <StyledTableCell>
                          <EditButton
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(record)}
                            size="small"
                          >
                            Edit
                          </EditButton>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Modal 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#334155',
            background: '#0e1527',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            p: 4,
          }}>
            <StyledTypography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#f8fafc',
                fontSize: '1rem'
              }}
            >
              Edit Bonus Rule
            </StyledTypography>
            
            <Box component="form" noValidate autoComplete="off">
              <StyledTextField
                fullWidth
                label="Minimum Subordinates"
                type="number"
                value={formData.minSubordinates}
                onChange={handleInputChange("minSubordinates")}
                margin="normal"
                InputProps={{
                  startAdornment: <PersonAddIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Minimum Deposit Amount"
                type="number"
                value={formData.minDepositAmount}
                onChange={handleInputChange("minDepositAmount")}
                margin="normal"
                InputProps={{
                  startAdornment: <MonetizationOnIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Bonus Amount"
                type="number"
                value={formData.bonusAmount}
                onChange={handleInputChange("bonusAmount")}
                margin="normal"
                InputProps={{
                  startAdornment: <CardGiftcardIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                }}
              />
              <AddButton
                fullWidth
                onClick={handleEditSubmit}
                sx={{ mt: 2 }}
              >
                Save Changes
              </AddButton>
            </Box>
          </Box>
        </Modal>
      </Container>
    </StyledContainer>
    </ThemeProvider>
  );
};

export default InvitationBonusSetting;