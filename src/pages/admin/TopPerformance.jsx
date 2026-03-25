import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Skeleton,
    Stack,
    IconButton,
    Tooltip,
    Divider,
    CircularProgress,
    alpha,
    Paper,
    Button,
    useMediaQuery,
    useTheme,
    ThemeProvider,
    createTheme
} from '@mui/material';
import {
    AccessTimeFilled,
    PersonOutlined,
    PhoneOutlined,
    AccountBalanceWalletOutlined,
    EmojiEventsOutlined,
    RefreshOutlined,
    CurrencyRupeeOutlined,
    MonetizationOnOutlined,
    CasinoOutlined,
    CalendarTodayOutlined,
    SpeedOutlined,
    LocalActivityOutlined,
    ThumbUpOutlined,
    AccountBalanceOutlined
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

// Custom theme colors - Dark Mode
const customColors = {
    primary: '#6366f1',
    secondary: '#EC4899',
    success: '#10b981',
    info: '#3B82F6',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.12)',
    hover: 'rgba(99, 102, 241, 0.1)'
};

const TimeFrame = {
    THIS_WEEK: 'THIS_WEEK',
    LAST_WEEK: 'LAST_WEEK',
    THIS_MONTH: 'THIS_MONTH',
    LAST_MONTH: 'LAST_MONTH',
    // CUSTOM: 'CUSTOM'
};

const StatItem = ({ icon: Icon, label, value, subValue, color, tooltipText }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Tooltip title={tooltipText || ''} arrow>
            <Box
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(color || customColors.primary, 0.08)} 0%, ${alpha(color || customColors.primary, 0.03)} 100%)`,
                    border: `1px solid ${alpha(color || customColors.primary, 0.15)}`,
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: `0 4px 12px ${alpha(color || customColors.primary, 0.08)}`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(color || customColors.primary, 0.15)} 0%, ${alpha(color || customColors.primary, 0.08)} 100%)`,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${alpha(color || customColors.primary, 0.15)}`,
                        borderColor: alpha(color || customColors.primary, 0.3)
                    },
                    height: '100%'
                }}
            >
                <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box
                            sx={{
                                background: `linear-gradient(135deg, ${alpha(color || customColors.primary, 0.2)} 0%, ${alpha(color || customColors.primary, 0.1)} 100%)`,
                                borderRadius: '10px',
                                p: { xs: 0.8, sm: 1 },
                                boxShadow: `0 4px 12px ${alpha(color || customColors.primary, 0.2)}`
                            }}
                        >
                            <Icon sx={{ fontSize: { xs: 18, sm: 20 }, color: color || customColors.primary }} />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Inter',
                                color: customColors.textSecondary,
                                fontWeight: 500,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Inter',
                                color: color || customColors.text,
                                fontWeight: 600,
                                fontSize: { xs: '0.85rem', sm: '1rem' },
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {value}
                        </Typography>
                        {subValue && (
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: 'Inter',
                                    color: customColors.textSecondary,
                                    display: 'block',
                                    mt: 0.5,
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                }}
                            >
                                {subValue}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Tooltip>
    );
};

const PerformanceIndicator = ({ value, maxValue, color, size = 40 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const adjustedSize = isMobile ? Math.max(32, size * 0.8) : size;
    
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress
                variant="determinate"
                value={(value / maxValue) * 100}
                size={adjustedSize}
                thickness={4}
                sx={{
                    color: color,
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        color: color,
                        fontSize: isMobile ? '0.65rem' : '0.75rem'
                    }}
                >
                    {((value / maxValue) * 100).toFixed(0)}%
                </Typography>
            </Box>
        </Box>
    );
};

// Create dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b'
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8'
        }
    },
    typography: {
        fontFamily: 'Inter, sans-serif'
    }
});

function TopPerformance() {
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState(TimeFrame.THIS_WEEK);
    const { axiosInstance } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const fetchPerformers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/api/admin/top-performers/performers?timeFrame=${timeFrame}&filterType=OVERALL&limit=10`
            );
            setPerformers(response.data.data);
        } catch (error) {
            console.error('Error fetching performers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformers();
    }, [timeFrame]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'pkr',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return `${format(date, 'PPp')} (${formatDistanceToNow(date, { addSuffix: true })})`;
    };

    const getPerformanceColor = (score) => {
        if (score >= 500) return customColors.success;
        if (score >= 300) return customColors.warning;
        return customColors.info;
    };

    const getPerformanceLevel = (score) => {
        if (score >= 500) return 'Elite';
        if (score >= 300) return 'Premium';
        if (score >= 100) return 'Advanced';
        return 'Standard';
    };

    const PerformerCard = ({ performer }) => {
        const performanceColor = getPerformanceColor(performer.performanceScore);

        return (
            <Card
                sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${customColors.cardBg} 0%, ${alpha(customColors.cardBg, 0.8)} 100%)`,
                    border: `2px solid ${alpha(performanceColor, 0.2)}`,
                    borderRadius: 4,
                    boxShadow: `0 8px 32px ${alpha(performanceColor, 0.15)}`,
                    backdropFilter: 'blur(24px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${performanceColor} 0%, ${alpha(performanceColor, 0.5)} 100%)`
                    },
                    '&:hover': {
                        borderColor: performanceColor,
                        boxShadow: `0 12px 48px ${alpha(performanceColor, 0.35)}`,
                        transform: 'translateY(-8px) scale(1.02)'
                    },
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ height: '100%' }}>
                        {/* Header Section */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    background: `linear-gradient(135deg, ${alpha(performanceColor, 0.15)} 0%, ${alpha(performanceColor, 0.05)} 100%)`,
                                    borderRadius: '24px',
                                    border: `1px solid ${alpha(performanceColor, 0.2)}`,
                                    py: 1,
                                    px: { xs: 2, sm: 2.5 },
                                    boxShadow: `0 4px 12px ${alpha(performanceColor, 0.15)}`
                                }}
                            >
                                <EmojiEventsOutlined sx={{ color: performanceColor, fontSize: { xs: 16, sm: 20 } }} />
                                <Stack>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: performanceColor,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            lineHeight: 1
                                        }}
                                    >
                                        Rank #{performer.rank}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: alpha(performanceColor, 0.8),
                                            fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                        }}
                                    >
                                        {getPerformanceLevel(performer.performanceScore)}
                                    </Typography>
                                </Stack>
                            </Box>
                            <PerformanceIndicator
                                value={performer.performanceScore}
                                maxValue={1000}
                                color={performanceColor}
                                size={isMobile ? 40 : 48}
                            />
                        </Box>

                        {/* User Info Section */}
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: 'Inter',
                                    color: customColors.text,
                                    fontWeight: 600,
                                    mb: 1,
                                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {performer.userName}
                            </Typography>
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }} 
                                spacing={{ xs: 1, sm: 2 }} 
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PhoneOutlined sx={{ color: customColors.textSecondary, fontSize: { xs: 16, sm: 18 } }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.textSecondary,
                                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                        }}
                                    >
                                        {performer.mobile}
                                    </Typography>
                                </Box>
                                <Tooltip title={formatDate(performer.lastActive)} arrow>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <AccessTimeFilled sx={{ color: customColors.textSecondary, fontSize: { xs: 16, sm: 18 } }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: 'Inter',
                                                color: customColors.textSecondary,
                                                fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                            }}
                                        >
                                            {performer.lastActive ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Stack>
                        </Box>

                        <Divider sx={{ borderColor: customColors.border, my: { xs: 1, sm: 0 } }} />

                        {/* Main Stats Grid */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <StatItem
                                    icon={AccountBalanceOutlined}
                                    label="Total Deposits"
                                    value={formatCurrency(performer.totalDeposits)}
                                    subValue={`${performer.transactionCount} transactions`}
                                    color={customColors.success}
                                    tooltipText="Total amount deposited by the user"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StatItem
                                    icon={MonetizationOnOutlined}
                                    label="Total Withdrawals"
                                    value={formatCurrency(performer.totalWithdrawals)}
                                    subValue={`${performer.depositWithdrawRatio}% ratio`}
                                    color={customColors.error}
                                    tooltipText="Total amount withdrawn by the user"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StatItem
                                    icon={CasinoOutlined}
                                    label="Betting Activity"
                                    value={`${performer.totalBets} bets`}
                                    subValue={`${performer.winRate}% win rate`}
                                    color={customColors.info}
                                    tooltipText="Total number of bets placed"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StatItem
                                    icon={AccountBalanceWalletOutlined}
                                    label="Current Balance"
                                    value={formatCurrency(performer.currentBalance)}
                                    subValue={`${performer.roi}% ROI`}
                                    color={customColors.warning}
                                    tooltipText="Current available balance"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ borderColor: customColors.border, my: { xs: 1, sm: 0 } }} />

                        {/* Additional Stats */}
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Box textAlign="center">
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.textSecondary,
                                            display: 'block',
                                            mb: 0.5,
                                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                        }}
                                    >
                                        Avg Bet Size
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.text,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' }
                                        }}
                                    >
                                        {formatCurrency(performer.avgBetSize)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box textAlign="center">
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.textSecondary,
                                            display: 'block',
                                            mb: 0.5,
                                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                        }}
                                    >
                                        Activity Score
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.text,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' }
                                        }}
                                    >
                                        {performer.activityDensity.toFixed(1)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box textAlign="center">
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.textSecondary,
                                            display: 'block',
                                            mb: 0.5,
                                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                        }}
                                    >
                                        Retention
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'Inter',
                                            color: customColors.text,
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' }
                                        }}
                                    >
                                        {performer.retentionScore}%
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Performance Message */}
                        <Paper
                            elevation={0}
                            sx={{
                                background: `linear-gradient(135deg, ${alpha(performanceColor, 0.08)} 0%, ${alpha(performanceColor, 0.03)} 100%)`,
                                p: { xs: 1.5, sm: 2 },
                                borderRadius: 3,
                                border: `1px solid ${alpha(performanceColor, 0.2)}`,
                                boxShadow: `0 4px 12px ${alpha(performanceColor, 0.1)}`,
                                mt: 'auto'
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'Inter',
                                    color: customColors.text,
                                    lineHeight: 1.5,
                                    fontSize: { xs: '0.75rem', sm: '0.85rem' }
                                }}
                            >
                                {performer.rankMessage}
                            </Typography>
                        </Paper>
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
        <Box 
            sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: customColors.background,
                minHeight: '100vh',
                borderRadius: '16px'
            }}
        >
            {/* Header Section */}
            <Box 
                display="flex" 
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', md: 'center' }}
                mb={{ xs: 3, md: 4 }}
                gap={2}
            >
                <Stack spacing={1}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            color: customColors.text,
                            fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
                        }}
                    >
                        Top Performers
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Inter',
                            color: customColors.textSecondary,
                            fontSize: { xs: '0.8rem', sm: '0.85rem' }
                        }}
                    >
                        Analyzing player performance and activity metrics
                    </Typography>
                </Stack>

                <Box 
                    display="flex" 
                    gap={2} 
                    alignItems="center"
                    width={{ xs: '100%', md: 'auto' }}
                    justifyContent={{ xs: 'space-between', md: 'flex-end' }}
                >
                    <FormControl
                        size="small"
                        sx={{
                            width: { xs: '75%', sm: 'auto', minWidth: { xs: 160, sm: 200 } },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                borderColor: alpha(customColors.primary, 0.2),
                                fontFamily: 'Inter',
                                '&:hover': {
                                    borderColor: customColors.primary
                                }
                            }
                        }}
                    >
                        <InputLabel
                            id="timeframe-select-label"
                            sx={{
                                fontFamily: 'Inter',
                                color: customColors.textSecondary,
                                fontSize: { xs: '0.8rem', sm: '0.85rem' }
                            }}
                        >
                            Time Frame
                        </InputLabel>
                        <Select
                            labelId="timeframe-select-label"
                            value={timeFrame}
                            label="Time Frame"
                            onChange={(e) => setTimeFrame(e.target.value)}
                            sx={{
                                fontFamily: 'Inter',
                                '& .MuiSelect-select': {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontSize: { xs: '0.8rem', sm: '0.85rem' }
                                }
                            }}
                        >
                            {Object.entries(TimeFrame).map(([key, value]) => (
                                <MenuItem
                                    key={value}
                                    value={value}
                                    sx={{
                                        fontFamily: 'Inter',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: { xs: '0.8rem', sm: '0.85rem' }
                                    }}
                                >
                                    <CalendarTodayOutlined sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                    {key.split('_').map(word =>
                                        word.charAt(0) + word.slice(1).toLowerCase()
                                    ).join(' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Tooltip title="Refresh data">
                        <IconButton
                            onClick={fetchPerformers}
                            sx={{
                                backgroundColor: alpha(customColors.primary, 0.1),
                                '&:hover': {
                                    backgroundColor: alpha(customColors.primary, 0.2)
                                }
                            }}
                        >
                            <RefreshOutlined sx={{ color: customColors.primary, fontSize: { xs: 20, sm: 24 } }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Summary Stats */}
            <Box mb={{ xs: 3, md: 4 }}>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {performers.length > 0 && (
                        <>
                            <Grid item xs={6} sm={6} md={3}>
                                <StatItem
                                    icon={MonetizationOnOutlined}
                                    label="Total Deposits"
                                    value={formatCurrency(
                                        performers.reduce((sum, p) => sum + p.totalDeposits, 0)
                                    )}
                                    subValue="Across all performers"
                                    color={customColors.success}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <StatItem
                                    icon={SpeedOutlined}
                                    label="Average ROI"
                                    value={`${(
                                        performers.reduce((sum, p) => sum + p.roi, 0) / performers.length
                                    ).toFixed(2)}%`}
                                    subValue="Return on investment"
                                    color={customColors.info}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <StatItem
                                    icon={LocalActivityOutlined}
                                    label="Total Bets"
                                    value={performers.reduce((sum, p) => sum + p.totalBets, 0)}
                                    subValue="Combined activity"
                                    color={customColors.warning}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <StatItem
                                    icon={ThumbUpOutlined}
                                    label="Avg Win Rate"
                                    value={`${(
                                        performers.reduce((sum, p) => sum + p.winRate, 0) / performers.length
                                    ).toFixed(2)}%`}
                                    subValue="Success rate"
                                    color={customColors.secondary}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>

            {/* Performers Grid */}
            {loading ? (
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton
                                variant="rectangular"
                                height={{ xs: 420, sm: 520 }}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: alpha(customColors.primary, 0.1)
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : performers.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: { xs: 8, sm: 10 },
                        background: `linear-gradient(135deg, ${alpha(customColors.primary, 0.08)} 0%, ${alpha(customColors.primary, 0.03)} 100%)`,
                        borderRadius: 4,
                        border: `2px dashed ${alpha(customColors.primary, 0.2)}`
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'Inter',
                            color: customColors.text,
                            mb: 2,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                    >
                        No performers found for the selected time frame
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<RefreshOutlined />}
                        onClick={fetchPerformers}
                        sx={{
                            fontFamily: 'Inter',
                            textTransform: 'none',
                            backgroundColor: customColors.primary,
                            px: { xs: 2, sm: 3 },
                            py: { xs: 0.75, sm: 1 },
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            '&:hover': {
                                backgroundColor: alpha(customColors.primary, 0.9)
                            }
                        }}
                    >
                        Refresh Data
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {performers.map((performer) => (
                        <Grid item xs={12} sm={6} md={4} key={performer.userId}>
                            <PerformerCard performer={performer} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
        </ThemeProvider>
    );
}

export default TopPerformance;