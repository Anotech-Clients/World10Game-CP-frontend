import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    useTheme,
    alpha,
    Chip,
    Pagination,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
    CasinoOutlined as SpinIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

// Dark theme matching admin panel
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
        },
        background: {
            default: '#1e293b',
            paper: '#334155',
        },
        text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
        },
    },
});

// Custom styled components
const StyledTab = styled(Tab)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    textTransform: 'none',
    minWidth: 120,
    '&.Mui-selected': {
        color: '#6366F1',
        fontWeight: 600,
    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#f8fafc',
    fontWeight: 600,
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Inter, sans-serif',
    textTransform: 'none',
    borderRadius: 8,
    boxShadow: 'none',
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: '#6366F1',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#4F46E5',
        boxShadow: 'none',
    },
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: alpha('#6366F1', 0.1),
    color: '#6366F1',
    '&:hover': {
        backgroundColor: alpha('#6366F1', 0.15),
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 12,
    background: 'linear-gradient(145deg, #334155 0%, rgba(99, 102, 241, 0.1) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    height: '100%',
}));

const LuckySpinSetting = () => {
    const { axiosInstance } = useAuth();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [rules, setRules] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(true);
    const [openRuleDialog, setOpenRuleDialog] = useState(false);
    const [openRewardDialog, setOpenRewardDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentRule, setCurrentRule] = useState(null);
    const [currentReward, setCurrentReward] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [statsData, setStatsData] = useState({
        totalRules: 0,
        activeRules: 0,
        totalRewards: 0,
    });

    // Form states
    const [ruleForm, setRuleForm] = useState({
        minDepositAmount: '',
        spinChances: '',
        isActive: true
    });

    const [rewardForm, setRewardForm] = useState({
        position: '',
        rewardAmount: '',
        isDefault: false,
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const calculateStats = (rulesData, rewardsData) => {
        const activeRules = rulesData.filter(rule => rule.isActive).length;

        setStatsData({
            totalRules: rulesData.length,
            activeRules,
            totalRewards: rewardsData.length,
        });
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const rulesResponse = await axiosInstance.get('/api/activity/lucky-spin/rules');
            const rewardsResponse = await axiosInstance.get('/api/activity/lucky-spin/rewards');

            setRules(rulesResponse.data.data || []);
            setRewards(rewardsResponse.data.data || []);

            calculateStats(
                rulesResponse.data.data || [],
                rewardsResponse.data.data || []
            );

            // Check if the system is initialized based on having both rules and rewards
            const hasRules = (rulesResponse.data.data || []).length > 0;
            const hasRewards = (rewardsResponse.data.data || []).length > 0;
            setIsInitialized(hasRules && hasRewards);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            if (error.response?.status === 404) {
                setIsInitialized(false);
            }
            showSnackbar('Failed to fetch data. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInitialize = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/activity/lucky-spin/initialize');
            showSnackbar('Lucky Spin feature initialized successfully!', 'success');
            fetchData();
        } catch (error) {
            console.error("Failed to initialize:", error);
            showSnackbar('Failed to initialize Lucky Spin feature.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRuleDialog = (rule = null) => {
        if (rule) {
            setCurrentRule(rule);
            setRuleForm({
                minDepositAmount: rule.minDepositAmount,
                spinChances: rule.spinChances,
                isActive: rule.isActive
            });
        } else {
            setCurrentRule(null);
            setRuleForm({
                minDepositAmount: '',
                spinChances: '',
                isActive: true
            });
        }
        setOpenRuleDialog(true);
    };

    const handleOpenRewardDialog = (reward = null) => {
        if (reward) {
            setCurrentReward(reward);
            setRewardForm({
                position: reward.position,
                rewardAmount: reward.rewardAmount,
                isDefault: reward.isDefault,
                isActive: reward.isActive
            });
        } else {
            setCurrentReward(null);
            setRewardForm({
                position: '',
                rewardAmount: '',
                isDefault: false,
                isActive: true
            });
        }
        setOpenRewardDialog(true);
    };

    const handleOpenDeleteDialog = (type, id) => {
        setDeleteType(type);
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleRuleChange = (e) => {
        const { name, value, checked } = e.target;
        setRuleForm(prev => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value
        }));
    };

    const handleRewardChange = (e) => {
        const { name, value, checked } = e.target;
        setRewardForm(prev => ({
            ...prev,
            [name]: name === 'isActive' || name === 'isDefault' ? checked : value
        }));
    };

    const handleSaveRule = async () => {
        setIsLoading(true);
        try {
            if (currentRule) {
                // Update existing rule
                await axiosInstance.put(`/api/activity/lucky-spin/rules/${currentRule.id}`, ruleForm);
                showSnackbar('Rule updated successfully!', 'success');
            } else {
                // Create new rule
                await axiosInstance.post('/api/activity/lucky-spin/rules', ruleForm);
                showSnackbar('Rule created successfully!', 'success');
            }
            setOpenRuleDialog(false);
            fetchData();
        } catch (error) {
            console.error("Failed to save rule:", error);
            showSnackbar(error.response?.data?.message || 'Failed to save rule.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveReward = async () => {
        setIsLoading(true);
        try {
            if (currentReward) {
                // Update existing reward
                await axiosInstance.put(`/api/activity/lucky-spin/rewards/${currentReward.id}`, rewardForm);
                showSnackbar('Reward updated successfully!', 'success');
            } else {
                // Create new reward
                await axiosInstance.post('/api/activity/lucky-spin/rewards', rewardForm);
                showSnackbar('Reward created successfully!', 'success');
            }
            setOpenRewardDialog(false);
            fetchData();
        } catch (error) {
            console.error("Failed to save reward:", error);
            showSnackbar(error.response?.data?.message || 'Failed to save reward.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            if (deleteType === 'rule') {
                await axiosInstance.delete(`/api/activity/lucky-spin/rules/${deleteId}`);
                showSnackbar('Rule deleted successfully!', 'success');
            }
            setOpenDeleteDialog(false);
            fetchData();
        } catch (error) {
            console.error("Failed to delete item:", error);
            showSnackbar(error.response?.data?.message || 'Failed to delete item.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Dashboard section with stats
    const renderDashboard = () => (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" fontFamily="Inter, sans-serif" fontWeight={600} gutterBottom>
                                Active Rules
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h3" fontFamily="Inter, sans-serif" fontWeight={700} color="#6366F1">
                                    {statsData.activeRules}
                                </Typography>
                                <Typography variant="body2" fontFamily="Inter, sans-serif" color="text.secondary">
                                    of {statsData.totalRules} total
                                </Typography>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" fontFamily="Inter, sans-serif" fontWeight={600} gutterBottom>
                                Total Rewards
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h3" fontFamily="Inter, sans-serif" fontWeight={700} color="#6366F1">
                                    {statsData.totalRewards}
                                </Typography>
                                <SpinIcon fontSize="large" color="disabled" />
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );

    // Rules tab content
    const renderRulesTab = () => (
        <Box sx={{ mt: 3 }}>
            {isInitialized && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <PrimaryButton
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenRuleDialog()}
                        sx={{ mr: 1 }}
                    >
                        Add Rule
                    </PrimaryButton>
                    <SecondaryButton
                        startIcon={<RefreshIcon />}
                        onClick={fetchData}
                    >
                        Refresh
                    </SecondaryButton>
                </Box>
            )}

            <TableContainer component={Paper} sx={{ borderRadius: 2, background: '#0e1527', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <StyledTableHeadCell>ID</StyledTableHeadCell> */}
                            <StyledTableHeadCell>Min. Deposit</StyledTableHeadCell>
                            <StyledTableHeadCell>Spin Chances</StyledTableHeadCell>
                            <StyledTableHeadCell>Status</StyledTableHeadCell>
                            <StyledTableHeadCell>Created At</StyledTableHeadCell>
                            <StyledTableHeadCell>Actions</StyledTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.length === 0 && !isLoading ? (
                            <TableRow>
                                <StyledTableCell colSpan={6} align="center">
                                    {isInitialized ? (
                                        <Typography fontFamily="Inter, sans-serif">No rules found</Typography>
                                    ) : (
                                        <Typography fontFamily="Inter, sans-serif">
                                            No rules found. Please initialize the Lucky Spin feature first.
                                        </Typography>
                                    )}
                                </StyledTableCell>
                            </TableRow>
                        ) : (
                            rules.map((rule) => (
                                <TableRow key={rule.id} hover>
                                    {/* <StyledTableCell>{rule.id}</StyledTableCell> */}
                                    <StyledTableCell>₹ {rule.minDepositAmount}</StyledTableCell>
                                    <StyledTableCell>{rule.spinChances}</StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={rule.isActive ? 'Active' : 'Inactive'}
                                            color={rule.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{formatDate(rule.createdAt)}</StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenRuleDialog(rule)}
                                            sx={{ color: '#6366F1' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDeleteDialog('rule', rule.id)}
                                            sx={{ color: '#EF4444' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    // Rewards tab content
    const renderRewardsTab = () => (
        <Box sx={{ mt: 3 }}>
            {isInitialized && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    {rewards.length < 8 && (
                        <PrimaryButton
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenRewardDialog()}
                            sx={{ mr: 1 }}
                        >
                            Add Reward
                        </PrimaryButton>
                    )}
                    <SecondaryButton
                        startIcon={<RefreshIcon />}
                        onClick={fetchData}
                    >
                        Refresh
                    </SecondaryButton>
                </Box>
            )}

            <TableContainer component={Paper} sx={{ borderRadius: 2, background: '#0e1527', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <StyledTableHeadCell>ID</StyledTableHeadCell> */}
                            <StyledTableHeadCell>Position</StyledTableHeadCell>
                            <StyledTableHeadCell>Reward Amount</StyledTableHeadCell>
                            <StyledTableHeadCell>Type</StyledTableHeadCell>
                            <StyledTableHeadCell>Status</StyledTableHeadCell>
                            <StyledTableHeadCell>Actions</StyledTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rewards.length === 0 && !isLoading ? (
                            <TableRow>
                                <StyledTableCell colSpan={6} align="center">
                                    {isInitialized ? (
                                        <Typography fontFamily="Inter, sans-serif">No rewards found</Typography>
                                    ) : (
                                        <Typography fontFamily="Inter, sans-serif">
                                            No rewards found. Please initialize the Lucky Spin feature first.
                                        </Typography>
                                    )}
                                </StyledTableCell>
                            </TableRow>
                        ) : (
                            rewards.map((reward) => (
                                <TableRow key={reward.id} hover>
                                    {/* <StyledTableCell>{reward.id}</StyledTableCell> */}
                                    <StyledTableCell>{reward.position}</StyledTableCell>
                                    <StyledTableCell>₹ {reward.rewardAmount}</StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={reward.isDefault ? 'Default' : 'Reward'}
                                            color={reward.isDefault ? 'info' : 'primary'}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={reward.isActive ? 'Active' : 'Inactive'}
                                            color={reward.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenRewardDialog(reward)}
                                            sx={{ color: '#6366F1' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{
                padding: 3,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                minHeight: '100vh',
                borderRadius: '16px',
                border: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        mb: 1,
                        color: '#6366F1'
                    }}
                >
                    Lucky Spin Management
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: 'Inter, sans-serif',
                        color: 'text.secondary',
                        mb: 4
                    }}
                >
                    Configure rules, rewards, and monitor user claims.
                </Typography>

                {!isInitialized && (
                    <Alert
                        severity="info"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleInitialize}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={20} /> : 'Set Initial Rules'}
                            </Button>
                        }
                        sx={{ mb: 3, fontFamily: 'Inter, sans-serif' }}
                    >
                        Lucky Spin feature needs to be initialized with default rules and rewards before use.
                    </Alert>
                )}

                {renderDashboard()}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: '#6366F1',
                            }
                        }}
                    >
                        <StyledTab label="Rules" />
                        <StyledTab label="Rewards" />
                    </Tabs>
                </Box>

                {isLoading && (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                )}

                {!isLoading && (
                    <>
                        {tabValue === 0 && renderRulesTab()}
                        {tabValue === 1 && renderRewardsTab()}
                    </>
                )}

                {/* Rule Dialog */}
                <Dialog
                    open={openRuleDialog}
                    onClose={() => setOpenRuleDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            background: "#0e1527"
                        }
                    }}
                >
                    <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {currentRule ? 'Edit Rule' : 'Create New Rule'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="minDepositAmount"
                            label="Minimum Deposit Amount (₹ )"
                            type="number"
                            fullWidth
                            value={ruleForm.minDepositAmount}
                            onChange={handleRuleChange}
                            InputProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            InputLabelProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="spinChances"
                            label="Spin Chances"
                            type="number"
                            fullWidth
                            value={ruleForm.spinChances}
                            onChange={handleRuleChange}
                            InputProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            InputLabelProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            sx={{ mt: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ruleForm.isActive}
                                    onChange={handleRuleChange}
                                    name="isActive"
                                    color="primary"
                                />
                            }
                            label="Active"
                            sx={{ mt: 2, fontFamily: 'Inter, sans-serif' }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setOpenRuleDialog(false)}
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                                color: 'text.secondary'
                            }}
                        >
                            Cancel
                        </Button>
                        <PrimaryButton onClick={handleSaveRule} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : 'Save'}
                        </PrimaryButton>
                    </DialogActions>
                </Dialog>

                {/* Reward Dialog */}
                <Dialog
                    open={openRewardDialog}
                    onClose={() => setOpenRewardDialog(false)}
                    maxWidth="sm"
                    fullWidth
                     sx={{
                        '& .MuiDialog-paper': {
                            background: "#0e1527"
                        }
                    }}
                >
                    <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {currentReward ? 'Edit Reward' : 'Create New Reward'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="position"
                            label="Position (1-8)"
                            type="number"
                            fullWidth
                            value={rewardForm.position}
                            onChange={handleRewardChange}
                            InputProps={{
                                style: { fontFamily: 'Inter, sans-serif' },
                                readOnly: !!currentReward
                            }}
                            InputLabelProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="rewardAmount"
                            label="Reward Amount (₹ )"
                            type="number"
                            fullWidth
                            value={rewardForm.rewardAmount}
                            onChange={handleRewardChange}
                            InputProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            InputLabelProps={{ style: { fontFamily: 'Inter, sans-serif' } }}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setOpenRewardDialog(false)}
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                                color: 'text.secondary'
                            }}
                        >
                            Cancel
                        </Button>
                        <PrimaryButton onClick={handleSaveReward} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : 'Save'}
                        </PrimaryButton>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>
                            Are you sure you want to delete this {deleteType}? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setOpenDeleteDialog(false)}
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                                color: 'text.secondary'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="error"
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%', fontFamily: 'Inter, sans-serif' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default LuckySpinSetting;