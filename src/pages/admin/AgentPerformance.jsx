import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Tooltip as MuiTooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';
import { jwtDecode } from 'jwt-decode';

// Styled components with consistent Inter font
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#1e293b',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
  borderRadius: '16px',
  backdropFilter: 'blur(24px)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)'
  },
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  backgroundColor: '#1e293b',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(24px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  color: '#f8fafc',
  borderColor: 'rgba(148, 163, 184, 0.12)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const STATUS_COLORS = {
  active: '#00C853',
  inactive: '#757575',
  suspended: '#E91E63',
};

function AgentPerformance() {
  const { axiosInstance } = useAuth();
  const [uid, setUid] = useState('');
  const [networkData, setNetworkData] = useState(null);
  const [userPerformance, setUserPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Get admin's UID from token
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        setUid(decodedToken.uid || '');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const fetchData = async () => {
    if (!uid) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [networkResponse, performanceResponse] = await Promise.all([
        axiosInstance.get(`/api/admin/agent/network-summary/${uid}`),
        axiosInstance.get(`/api/admin/agent/user-performance/${uid}`),
      ]);

      setNetworkData(networkResponse.data.data);
      setUserPerformance(performanceResponse.data.data);
    } catch (err) {
      setError('Failed to fetch data. Please check the User ID and try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'pkr',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPerformanceMetrics = () => {
    if (!networkData) return [];
    const { bettingStats } = networkData;

    const winRate = (bettingStats.totalWinAmount / bettingStats.totalBetAmount) * 100;
    return [
      {
        label: 'Win Rate',
        value: `${winRate.toFixed(1)}%`,
        color: winRate >= 50 ? '#00C853' : '#E91E63',
      },
      {
        label: 'Average Bet',
        value: formatCurrency(bettingStats.totalBetAmount / networkData.totalUsers),
        color: '#2196F3',
      },
      {
        label: 'Efficiency',
        value: `${((networkData.commissionStats.totalCommission / bettingStats.totalBetAmount) * 100).toFixed(1)}%`,
        color: '#FFB300',
      },
    ];
  };

  // Prepare level-wise performance data from the API response
  const getLevelWisePerformanceData = () => {
    if (!userPerformance || !userPerformance.levelWiseStats) return [];

    return userPerformance.levelWiseStats.map(level => ({
      level: `Level ${level.level}`,
      userCount: level.userCount,
      deposits: level.deposits,
      withdrawals: level.withdrawals,
      betAmount: level.betAmount,
      winAmount: level.winAmount,
      profitLoss: level.profitLoss,
    }));
  };

  // Calculate financial summary for pie chart
  const getFinancialSummaryData = () => {
    if (!networkData) return [];

    return [
      { name: 'Deposits', value: networkData.financialStats.totalDeposits },
      { name: 'Withdrawals', value: networkData.financialStats.totalWithdrawals },
      { name: 'Bet Amount', value: networkData.bettingStats.totalBetAmount },
      { name: 'Win Amount', value: networkData.bettingStats.totalWinAmount },
      { name: 'Commission', value: networkData.commissionStats.totalCommission },
    ];
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3 },
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '16px',
    }}>
      <DashboardHeader>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#f8fafc' }}>
            Agent Performance Dashboard
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <TextField
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              label="User ID"
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              sx={{
                width: { xs: '100%', sm: '200px' },
                '& .MuiInputBase-root': {
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  color: '#f8fafc',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.12)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                  color: '#94a3b8',
                  '&.Mui-focused': {
                    color: '#6366f1'
                  }
                },
              }}
            />
            <Button
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              fullWidth={isMobile}
              sx={{
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #818cf8 0%, #8b5cf6 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)'
                },
                textTransform: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                height: '40px',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze Performance'}
            </Button>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ fontFamily: 'Inter, sans-serif' }}>
            {error}
          </Typography>
        )}
      </DashboardHeader>

      {networkData && userPerformance && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard>
              <Box>
                <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                  Total Network Size
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontFamily: 'Inter', color: '#6366f1', mt: 1 }}>
                  {networkData.totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#94a3b8', mt: 1 }}>
                Active across {networkData.levelWiseCounts.length} levels
              </Typography>
            </MetricCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard>
              <Box>
                <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                  Net Deposits
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontFamily: 'Inter', color: '#10b981', mt: 1 }}>
                  {formatCurrency(networkData.financialStats.netDeposits)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#94a3b8', mt: 1 }}>
                {networkData.financialStats.totalDeposits > 0
                  ? `${((networkData.financialStats.netDeposits / networkData.financialStats.totalDeposits) * 100).toFixed(1)}% retention rate`
                  : 'No deposits yet'}
              </Typography>
            </MetricCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard>
              <Box>
                <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                  Net Profit
                </Typography>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontFamily: 'Inter',
                    color: networkData.bettingStats.netProfitLoss >= 0 ? '#10b981' : '#ef4444',
                    mt: 1
                  }}
                >
                  {formatCurrency(networkData.bettingStats.netProfitLoss)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#94a3b8', mt: 1 }}>
                {`${(networkData.bettingStats.totalWinAmount / networkData.bettingStats.totalBetAmount * 100).toFixed(1)}% win rate`}
              </Typography>
            </MetricCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard>
              <Box>
                <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                  Commission Earned
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontFamily: 'Inter', color: '#f59e0b', mt: 1 }}>
                  {formatCurrency(networkData.commissionStats.totalCommission)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#94a3b8', mt: 1 }}>
                {`${(networkData.commissionStats.totalCommission / networkData.bettingStats.totalBetAmount * 100).toFixed(1)}% of total bets`}
              </Typography>
            </MetricCard>
          </Grid>

          {/* Level-Wise Performance Chart (replacing the old performance trends) */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 1, sm: 2 } }}>
                  Level-Wise Performance Breakdown
                </Typography>
                <Box sx={{ height: { xs: 250, sm: 300 }, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={getLevelWisePerformanceData()}
                      margin={{ top: 5, right: 20, left: isMobile ? 5 : 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="level"
                        tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: '#94a3b8' }}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: '#94a3b8' }}
                        tickFormatter={(value) => `pkr ${value / 1000}k`}
                        label={{
                          value: 'Amount (pkr )',
                          angle: -90,
                          position: 'insideLeft',
                          fontFamily: 'Inter',
                          fontSize: isMobile ? 10 : 12,
                          dx: isMobile ? -15 : -10
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: '#94a3b8' }}
                        label={{
                          value: 'Users',
                          angle: 90,
                          position: 'insideRight',
                          fontFamily: 'Inter',
                          fontSize: isMobile ? 10 : 12,
                          dx: isMobile ? 15 : 10
                        }}
                      />
                      <Tooltip
                        contentStyle={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12 }}
                        formatter={(value, name) => {
                          if (name === 'userCount') return [`${value} users`, 'User Count'];
                          return [formatCurrency(value), name];
                        }}
                      />
                      <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12 }} />
                      <Bar yAxisId="left" dataKey="deposits" fill="#2196F3" name="Deposits" />
                      <Bar yAxisId="left" dataKey="betAmount" fill="#FFB300" name="Bet Amount" />
                      <Bar yAxisId="left" dataKey="winAmount" fill="#00C853" name="Win Amount" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="userCount"
                        stroke="#E91E63"
                        strokeWidth={2}
                        name="User Count"
                        dot={{ fill: '#E91E63', r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Level Distribution */}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 1, sm: 2 } }}>
                  Network Level Distribution
                </Typography>
                <Box sx={{ height: { xs: 250, sm: 300 }, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={networkData.levelWiseCounts}
                      margin={{ top: 5, right: 5, left: isMobile ? 0 : 5, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="level"
                        label={{
                          value: 'Level',
                          position: 'bottom',
                          fontFamily: 'Inter',
                          fontSize: isMobile ? 10 : 12,
                          dy: 10
                        }}
                        tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: '#f8fafc' }}
                      />
                      <YAxis
                        label={{
                          value: 'Users',
                          angle: -90,
                          position: 'insideLeft',
                          fontFamily: 'Inter',
                          fontSize: isMobile ? 10 : 12,
                          dx: isMobile ? -15 : -10
                        }}
                        tick={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12, fill: '#f8fafc' }}
                        width={isMobile ? 35 : 45}
                      />
                      <Tooltip
                        contentStyle={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12 }}
                        formatter={(value) => [`${value} users`, 'Count']}
                      />
                      <Bar dataKey="count" fill="#2196F3" name="Users">
                        {networkData.levelWiseCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Financial Distribution */}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 1, sm: 2 } }}>
                  Financial Distribution
                </Typography>
                <Box sx={{ height: { xs: 250, sm: 300 }, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getFinancialSummaryData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 70 : 100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {getFinancialSummaryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12 }}
                        formatter={(value, name) => [formatCurrency(value), name]}
                      />
                      <Legend
                        formatter={(value) => <span style={{ fontFamily: 'Inter', fontSize: isMobile ? 10 : 12 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 2, sm: 3 } }}>
                  Network Performance Metrics
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {getPerformanceMetrics().map((metric, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{
                        p: { xs: 2, sm: 3 },
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.5)'
                      }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontFamily: 'Inter',
                            color: '#94a3b8',
                            mb: 1
                          }}
                        >
                          {metric.label}
                        </Typography>
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{
                            fontFamily: 'Inter',
                            color: metric.color,
                            fontWeight: 600
                          }}
                        >
                          {metric.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Level-wise Stats Table */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 2, sm: 3 } }}>
                  Level-wise Performance Details
                </Typography>
                <TableContainer sx={{ overflow: 'auto' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Level</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Users</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Deposits</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Withdrawals</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Bet Amount</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Win Amount</StyledTableHeaderCell>
                        <StyledTableHeaderCell sx={{ color: '#f8fafc' }}>Profit/Loss</StyledTableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userPerformance.levelWiseStats.map((level, index) => (
                        <TableRow key={index} sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'rgba(15, 23, 42, 0.3)' },
                          '& .MuiTableCell-root': { color: '#f8fafc', borderColor: 'rgba(148, 163, 184, 0.12)' }
                        }}>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              Level {level.level}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              {level.userCount}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              {formatCurrency(level.deposits)}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              {formatCurrency(level.withdrawals)}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              {formatCurrency(level.betAmount)}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontFamily: 'Inter' }}>
                              {formatCurrency(level.winAmount)}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#f8fafc' }}>
                            <Typography
                              variant={isMobile ? "body2" : "body1"}
                              sx={{
                                fontFamily: 'Inter',
                                color: level.profitLoss >= 0 ? '#10b981' : '#ef4444'
                              }}
                            >
                              {formatCurrency(level.profitLoss)}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* User Information */}
          {userPerformance.user && (
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: 'Inter', color: '#f8fafc', mb: { xs: 2, sm: 3 } }}>
                    Agent Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          User ID
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', color: '#f8fafc', mt: 0.5 }}>
                          {userPerformance.user.uid}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          Username
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', color: '#f8fafc', mt: 0.5 }}>
                          {userPerformance.user.userName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          Mobile
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', color: '#f8fafc', mt: 0.5 }}>
                          {userPerformance.user.mobile}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          Wallet Balance
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', mt: 0.5, color: '#10b981' }}>
                          {formatCurrency(parseInt(userPerformance.user.walletBalance))}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          Account Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', color: '#f8fafc', mt: 0.5 }}>
                          {userPerformance.user.accountType}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px' }}>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#94a3b8' }}>
                          Created At
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Inter', color: '#f8fafc', mt: 0.5 }}>
                          {new Date(userPerformance.user.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default AgentPerformance;