import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Snackbar,
    Chip,
    Divider,
    CircularProgress,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    SvgIcon,
    useTheme,
    useMediaQuery,
    FormControlLabel,
    Switch,
    Tooltip,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from '../../context/AuthContext';
import { AccountType } from '../../utils/enums.ts';

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

// Lightweight custom icon component
const ChevronIcon = ({ direction = 'down' }) => (
    <SvgIcon sx={{ fontSize: { xs: 16, sm: 20 } }}>
        {direction === 'up' ? (
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        ) : (
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        )}
    </SvgIcon>
);

// Custom styled components with responsive styles
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: '1rem auto',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
        margin: '2rem auto',
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
    padding: '12px',
    fontSize: '0.875rem',
    [theme.breakpoints.up('sm')]: {
        padding: '16px',
        fontSize: '1rem',
    },
    '&.MuiTableCell-head': {
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        color: '#f8fafc',
        fontWeight: 600,
    },
    color: '#f8fafc',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        fontFamily: 'Inter, sans-serif',
        height: { xs: '40px', sm: '45px' },
        backgroundColor: '#1e293b',
        color: '#f8fafc',
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Inter, sans-serif',
        color: '#94a3b8',
        transform: 'translate(14px, -8px) scale(0.75)',
        '&.Mui-focused': {
            color: '#6366f1',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6366f1',
        },
    },
    '& .MuiInputBase-input': {
        fontSize: { xs: '0.875rem', sm: '1rem' },
    },
    '& .MuiInputBase-input::placeholder': {
        fontFamily: 'Inter, sans-serif',
        color: '#94a3b8',
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiInputBase-root': {
        fontFamily: 'Inter, sans-serif',
        height: { xs: '40px', sm: '45px' },
        backgroundColor: '#1e293b',
        color: '#f8fafc',
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Inter, sans-serif',
        color: '#94a3b8',
        transform: 'translate(14px, -8px) scale(0.75)',
        '&.Mui-focused': {
            color: '#6366f1',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6366f1',
        },
    },
    '& .MuiSelect-select': {
        fontFamily: 'Inter, sans-serif',
        fontSize: { xs: '0.875rem', sm: '1rem' },
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    height: { xs: '40px', sm: '45px' },
    textTransform: 'none',
    borderRadius: '8px',
    fontSize: { xs: '0.875rem', sm: '1rem' },
    fontWeight: 500,
    boxShadow: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
        boxShadow: 'none',
    },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: '#E2E8F0',
        '&.Mui-checked': {
            color: '#3B82F6',
            '& + .MuiSwitch-track': {
                backgroundColor: '#3B82F6',
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#CBD5E1',
        opacity: 1,
    },
}));

const CreateUser = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { axiosInstance } = useAuth();

    // Enhanced form state with Client Demo option
    const [users, setUsers] = useState({
        dummyUsers: [],
        adminUsers: []
    });
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        accountType: '',
        userName: '',
        isClientDemo: false, // New field for Client Demo
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Account types remain the same
    const accountTypes = [
        AccountType.ADMIN,
        AccountType.AGENT,
        AccountType.GAMEHEAD,
        AccountType.FINANCEHEAD,
        AccountType.SETTINGSHEAD,
        AccountType.ADDITIONALHEAD,
        AccountType.SUPPORTHEAD,
    ];

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admin/user-management/non-user-accounts');

            // Separate users by type
            const dummyUsers = response.data.data.users.filter(
                user => user.accountType === AccountType.DUMMYUSER
            );
            const adminUsers = response.data.data.users.filter(
                user => user.accountType !== AccountType.DUMMYUSER
            );

            setUsers({ dummyUsers, adminUsers });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to fetch users',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        if (!formData.password || formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        // Validate that Client Demo is only available for ADMIN accounts
        if (formData.isClientDemo && formData.accountType !== AccountType.ADMIN) {
            newErrors.isClientDemo = 'Client Demo mode is only available for ADMIN account type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateUser = async (isDummy = false) => {
        if (!validateForm()) return;

        setFormLoading(true);
        try {
            const endpoint = isDummy
                ? '/api/admin/user-management/create-dummy-user'
                : '/api/admin/user-management/create-role-user';

            const payload = {
                mobile: Number(formData.mobile),
                password: formData.password,
                ...(isDummy ? {} : { 
                    accountType: formData.accountType,
                    userName: formData.userName || undefined,
                    isClientDemo: formData.isClientDemo // Include Client Demo flag
                })
            };

            const response = await axiosInstance.post(endpoint, payload);

            const demoStatus = formData.isClientDemo ? ' (Client Demo)' : '';
            setSnackbar({
                open: true,
                message: `${isDummy ? 'Dummy user' : `${formData.accountType} user${demoStatus}`} created successfully!`,
                severity: 'success',
            });

            // Reset form and refresh user list
            setFormData({
                mobile: '',
                password: '',
                accountType: '',
                userName: '',
                isClientDemo: false,
            });
            setShowCreateForm(false);
            fetchUsers();

        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to create user',
                severity: 'error',
            });
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }

        // Reset Client Demo when account type changes to non-ADMIN
        if (name === 'accountType' && value !== AccountType.ADMIN) {
            setFormData(prev => ({
                ...prev,
                isClientDemo: false,
            }));
        }
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
        
        // Clear errors when user toggles switch
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const getAccountTypeColor = (type) => {
        const colors = {
            [AccountType.ADMIN]: '#EF4444',
            [AccountType.AGENT]: '#44efe1',
            [AccountType.GAMEHEAD]: '#F59E0B',
            [AccountType.FINANCEHEAD]: '#10B981',
            [AccountType.SETTINGSHEAD]: '#6366F1',
            [AccountType.ADDITIONALHEAD]: '#8B5CF6',
            [AccountType.SUPPORTHEAD]: '#EC4899',
            [AccountType.DUMMYUSER]: '#64748B',
        };
        return colors[type] || '#64748B';
    };

    // Enhanced UserTable component with Client Demo indicator
    const UserTable = ({ users, title }) => (
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    color: '#f8fafc',
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
            >
                {title} ({users.length})
            </Typography>
            <TableContainer sx={{
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(148, 163, 184, 0.3)',
                    borderRadius: '4px',
                },
            }}>
                <Table sx={{ minWidth: { xs: 700, sm: 900 } }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Mobile</StyledTableCell>
                            <StyledTableCell>Account Type</StyledTableCell>
                            <StyledTableCell>Mode</StyledTableCell>
                            <StyledTableCell>Invite Code</StyledTableCell>
                            <StyledTableCell>Created At</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.uid}
                                sx={{
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    },
                                }}
                            >
                                <StyledTableCell>{user.userName}</StyledTableCell>
                                <StyledTableCell>{user.mobile}</StyledTableCell>
                                <StyledTableCell>
                                    <Chip
                                        label={user.accountType}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            backgroundColor: `${getAccountTypeColor(user.accountType)}15`,
                                            color: getAccountTypeColor(user.accountType),
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    {user.isClientDemo ? (
                                        <Chip
                                            label="Client Demo"
                                            size={isMobile ? "small" : "medium"}
                                            sx={{
                                                backgroundColor: '#FEF3C7',
                                                color: '#92400E',
                                                fontFamily: 'Inter, sans-serif',
                                                fontWeight: 500,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Production"
                                            size={isMobile ? "small" : "medium"}
                                            sx={{
                                                backgroundColor: '#D1FAE5',
                                                color: '#065F46',
                                                fontFamily: 'Inter, sans-serif',
                                                fontWeight: 500,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            }}
                                        />
                                    )}
                                </StyledTableCell>
                                <StyledTableCell>{user.inviteCode}</StyledTableCell>
                                <StyledTableCell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    if (loading) {
        return (
            <ThemeProvider theme={darkTheme}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#0f172a',
                }}>
                    <CircularProgress sx={{ color: '#6366f1' }} />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: '#0f172a',
                minHeight: '100vh',
                borderRadius: '16px'
            }}>
            <StyledPaper>
                <Stack spacing={{ xs: 2, sm: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: { xs: 2, sm: 0 }
                    }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                color: '#f8fafc',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}
                        >
                            User Management
                        </Typography>
                        <StyledButton
                            variant="contained"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            endIcon={<ChevronIcon direction={showCreateForm ? 'up' : 'down'} />}
                            sx={{
                                backgroundColor: '#6366f1',
                                '&:hover': { backgroundColor: '#818cf8' },
                            }}
                        >
                            {showCreateForm ? 'Hide Form' : 'Create New User'}
                        </StyledButton>
                    </Box>

                    <Collapse in={showCreateForm}>
                        <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
                            <Stack spacing={{ xs: 2, sm: 3 }}>
                                <StyledTextField
                                    label="Mobile Number"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile}
                                    fullWidth
                                    placeholder="Enter 10-digit mobile number"
                                    disabled={formLoading}
                                    inputProps={{
                                        maxLength: 10,
                                        pattern: '[0-9]*'
                                    }}
                                />

                                <StyledTextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    fullWidth
                                    placeholder="Enter password"
                                    disabled={formLoading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <StyledTextField
                                    label="Username (Optional)"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter custom username or leave blank for auto-generated"
                                    disabled={formLoading}
                                />

                                <StyledFormControl fullWidth error={!!errors.accountType}>
                                    <InputLabel>Account Type</InputLabel>
                                    <Select
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleInputChange}
                                        label="Account Type"
                                        disabled={formLoading}
                                    >
                                        <MenuItem value="" disabled>
                                            <Typography sx={{
                                                fontFamily: 'Inter, sans-serif',
                                                color: '#64748B'
                                            }}>
                                                Select account type
                                            </Typography>
                                        </MenuItem>
                                        {accountTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                <Typography sx={{
                                                    fontFamily: 'Inter, sans-serif'
                                                }}>
                                                    {type}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.accountType && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                            sx={{
                                                fontFamily: 'Inter, sans-serif',
                                                mt: 0.5,
                                                ml: 1
                                            }}
                                        >
                                            {errors.accountType}
                                        </Typography>
                                    )}
                                </StyledFormControl>

                                {/* Client Demo Option - Only shown for ADMIN accounts */}
                                {formData.accountType === AccountType.ADMIN && (
                                    <Box sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(148, 163, 184, 0.12)',
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 1
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography sx={{
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontWeight: 500,
                                                    color: '#f8fafc',
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}>
                                                    Client Demo Mode
                                                </Typography>
                                                <Tooltip title="Client Demo mode creates a demo environment for testing purposes">
                                                    {/* <InfoIcon sx={{
                                                        fontSize: 16,
                                                        color: '#64748B',
                                                        cursor: 'help'
                                                    }} /> */}
                                                </Tooltip>
                                            </Box>
                                            <FormControlLabel
                                                control={
                                                    <StyledSwitch
                                                        checked={formData.isClientDemo}
                                                        onChange={handleSwitchChange}
                                                        name="isClientDemo"
                                                        disabled={formLoading}
                                                    />
                                                }
                                                label=""
                                                sx={{ m: 0 }}
                                            />
                                        </Box>
                                        <Typography sx={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '0.75rem',
                                            color: '#94a3b8',
                                            lineHeight: 1.4
                                        }}>
                                            {formData.isClientDemo 
                                                ? 'This will create a demo admin account for testing purposes.'
                                                : 'This will create a production admin account.'}
                                        </Typography>
                                        {errors.isClientDemo && (
                                            <Typography
                                                color="error"
                                                variant="caption"
                                                sx={{
                                                    fontFamily: 'Inter, sans-serif',
                                                    mt: 0.5,
                                                    display: 'block'
                                                }}
                                            >
                                                {errors.isClientDemo}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                >
                                    <StyledButton
                                        variant="contained"
                                        onClick={() => handleCreateUser(false)}
                                        fullWidth
                                        disabled={formLoading}
                                        sx={{
                                            backgroundColor: '#6366f1',
                                            '&:hover': { backgroundColor: '#818cf8' },
                                        }}
                                    >
                                        {formLoading ? (
                                            <CircularProgress size={24} sx={{ color: 'white' }} />
                                        ) : (
                                            `Create ${formData.accountType || 'Role-Based'} User${formData.isClientDemo ? ' (Demo)' : ''}`
                                        )}
                                    </StyledButton>
                                    <StyledButton
                                        variant="outlined"
                                        onClick={() => handleCreateUser(true)}
                                        fullWidth
                                        disabled={formLoading}
                                        sx={{
                                            borderColor: '#6366f1',
                                            color: '#6366f1',
                                            '&:hover': {
                                                borderColor: '#818cf8',
                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                            },
                                        }}
                                    >
                                        {formLoading ? (
                                            <CircularProgress size={24} sx={{ color: '#6366f1' }} />
                                        ) : (
                                            'Create Dummy User'
                                        )}
                                    </StyledButton>
                                </Stack>
                            </Stack>
                        </Box>
                    </Collapse>

                    <Divider />

                    {users.adminUsers.length > 0 && (
                        <UserTable users={users.adminUsers} title="Admin Users" />
                    )}

                    {users.dummyUsers.length > 0 && (
                        <>
                            <Divider sx={{ my: { xs: 3, sm: 4 } }} />
                            <UserTable users={users.dummyUsers} title="Dummy Users" />
                        </>
                    )}

                    {users.adminUsers.length === 0 && users.dummyUsers.length === 0 && (
                        <Alert
                            severity="info"
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                '& .MuiAlert-message': {
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                },
                                '& .MuiAlert-icon': {
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                }
                            }}
                        >
                            No users found
                        </Alert>
                    )}
                </Stack>
            </StyledPaper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{
                        fontFamily: 'Inter, sans-serif',
                        '& .MuiAlert-message': {
                            fontFamily: 'Inter, sans-serif',
                        },
                        backgroundColor: '#2F343A',
                        color: '#F8FAFC'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default CreateUser;