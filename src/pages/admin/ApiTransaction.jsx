import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Collapse,
  Pagination,
  Tooltip,
  LinearProgress,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  PeopleAlt,
  Casino,
  EmojiEvents,
  Refresh,
  Analytics,
  ExpandMore,
  ExpandLess,
  Assessment,
  MonetizationOn,
  Games,
  Timeline,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Using the imports as specified
import {
  apidomain,
  clientPrefix,
  clientSecretKey,
  domain,
} from "../../utils/Secret";
import { useAuth } from "../../context/AuthContext";

// Dark theme color palette
const theme = {
  primary: "#6366f1",
  secondary: "#818cf8",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  background: "#0f172a",
  cardBg: "#1e293b",
  accent: "rgba(99, 102, 241, 0.05)",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  shadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  borderRadius: "16px",
  textPrimary: "#ffffff",
  textSecondary: "#cccccc",
  border: "rgba(148, 163, 184, 0.12)",
};

const CHART_COLORS = [
  "#6366f1",
  "#818cf8",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
];

const ApiTransaction = () => {
  // State management
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedClients, setExpandedClients] = useState(new Set());
  const [apiCoins, setApiCoins] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [coinsLoading, setCoinsLoading] = useState(false);

  const { axiosInstance } = useAuth();

  // Fetch API coins balance
  const fetchApiCoins = useCallback(async () => {
    setCoinsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${domain}/api/huidu/admin/client-api-coins`,
        {
          apiKey: clientPrefix,
          apiSecret: clientSecretKey,
          wrapperUrl: apidomain,
        }
      );

      if (
        response.data?.success &&
        response.data?.data?.remaining_coins !== undefined
      ) {
        setApiCoins(response.data.data.remaining_coins);
      }
    } catch (error) {
      console.error("Error fetching API coins:", error);
      setError("Failed to fetch API coins balance");
    } finally {
      setCoinsLoading(false);
    }
  }, [axiosInstance]);

  // Fetch transaction analytics
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `${domain}/api/huidu/admin/transaction-analytics`,
        {
          apiKey: clientPrefix,
          apiSecret: clientSecretKey,
          wrapperUrl: apidomain,
          page: "1",
          limit: "100",
          status: "COMPLETED",
          includeGGR: "true",
          includePlatformFees: "true",
          sortBy: "created_at",
          sortOrder: "desc",
        }
      );

      if (response.data?.success) {
        setAnalyticsData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch analytics data");
      }
    } catch (err) {
      setError("Error connecting to analytics service");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  // Initialize data on component mount
  useEffect(() => {
    fetchApiCoins();
    fetchAnalytics();
  }, [fetchApiCoins, fetchAnalytics]);

  // Calculate overall metrics with platform fees
  const calculateOverallMetrics = useCallback(() => {
    if (!analyticsData?.clientAnalytics) return null;

    const clients = analyticsData.clientAnalytics;
    const totalClients = clients.length;
    const totalGames = clients.reduce(
      (sum, client) => sum + client.totalGameRounds,
      0
    );
    const totalBets = clients.reduce(
      (sum, client) => sum + client.summary.totalBetAmount,
      0
    );
    const totalWins = clients.reduce(
      (sum, client) => sum + client.summary.totalWinAmount,
      0
    );
    const totalPlatformFees = clients.reduce(
      (sum, client) => sum + (client.summary.totalPlatformFees || 0),
      0
    );
    const totalBetFees = clients.reduce(
      (sum, client) => sum + (client.summary.totalBetFees || 0),
      0
    );
    const totalFees = totalPlatformFees + totalBetFees;
    const adminProfit = totalBets - totalWins; // Gross profit/loss from games
    const netRevenue = adminProfit - totalFees; // Net revenue after paying fees to provider
    const avgWinRate =
      totalClients > 0
        ? clients.reduce((sum, client) => sum + client.winRate, 0) /
          totalClients
        : 0;
    const totalGameRounds = clients.reduce(
      (sum, client) => sum + client.totalGameRounds,
      0
    );

    return {
      totalClients,
      totalGames,
      totalBets,
      totalWins,
      totalPlatformFees,
      totalBetFees,
      totalFees,
      adminProfit,
      netRevenue,
      avgWinRate,
      totalGameRounds,
    };
  }, [analyticsData]);

  // Prepare chart data - COMBINED DATA (NOT CLIENT SPECIFIC)
  const prepareChartData = useCallback(() => {
    if (!analyticsData?.clientAnalytics) return { pieData: [], barData: [] };

    const overallMetrics = calculateOverallMetrics();

    // PIE CHART: Overall distribution
    const pieData = [
      {
        name: "Total Bets",
        value: overallMetrics.totalBets,
        fill: CHART_COLORS[0],
      },
      {
        name: "Total Wins",
        value: overallMetrics.totalWins,
        fill: CHART_COLORS[1],
      },
      {
        name: "Platform Fees",
        value: overallMetrics.totalPlatformFees,
        fill: CHART_COLORS[2],
      },
      {
        name: "Bet Fees",
        value: overallMetrics.totalBetFees,
        fill: CHART_COLORS[3],
      },
    ];

    // BAR CHART: Combined metrics summary
    const barData = [
      {
        category: "Revenue",
        bets: overallMetrics.totalBets,
        wins: overallMetrics.totalWins,
        platformFees: overallMetrics.totalPlatformFees,
        betFees: overallMetrics.totalBetFees,
        adminProfit: overallMetrics.adminProfit,
        netRevenue: overallMetrics.netRevenue,
      },
    ];

    return { pieData, barData };
  }, [analyticsData, calculateOverallMetrics]);

  // Pagination logic
  const getPaginatedClients = useCallback(() => {
    if (!analyticsData?.clientAnalytics) return [];

    const startIndex = (currentPage - 1) * clientsPerPage;
    const endIndex = startIndex + clientsPerPage;
    return analyticsData.clientAnalytics.slice(startIndex, endIndex);
  }, [analyticsData, currentPage, clientsPerPage]);

  // Toggle client expansion
  const toggleClientExpansion = (clientUid) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientUid)) {
      newExpanded.delete(clientUid);
    } else {
      newExpanded.add(clientUid);
    }
    setExpandedClients(newExpanded);
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "₹",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num || 0);
  };

  const formatCompactNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return formatNumber(num);
  };

  const overallMetrics = calculateOverallMetrics();
  const { pieData, barData } = prepareChartData();
  const paginatedClients = getPaginatedClients();
  const totalPages = analyticsData?.clientAnalytics
    ? Math.ceil(analyticsData.clientAnalytics.length / clientsPerPage)
    : 0;

  // Loading state
  if (loading && !analyticsData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
          p: 3,
        }}
      >
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: theme.borderRadius,
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
          }}
        >
          <CircularProgress size={60} sx={{ color: theme.primary, mb: 2 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary }} gutterBottom>
            Loading Analytics Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: theme.textSecondary }}>
            Fetching transaction data and preparing insights...
          </Typography>
        </Card>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: theme.background, minHeight: "100vh", borderRadius: "16px" }}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.error}`,
            borderRadius: theme.borderRadius,
            color: theme.textPrimary,
            '& .MuiAlert-icon': {
              color: theme.error
            },
            '& .MuiAlert-message': {
              color: theme.textPrimary
            }
          }}
          action={
            <Button
              sx={{
                color: theme.textPrimary,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }
              }}
              onClick={() => {
                fetchAnalytics();
                fetchApiCoins();
              }}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom sx={{ color: theme.textPrimary }}>
            Analytics Error
          </Typography>
          <Typography sx={{ color: theme.textSecondary }}>
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: theme.background, minHeight: "100vh", borderRadius: "16px" }}>
      {/* Header Section */}
      <Fade in={true} timeout={800}>
        <Card
          sx={{
            background: theme.gradient,
            color: "white",
            borderRadius: theme.borderRadius,
            boxShadow: theme.shadow,
            mb: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Assessment sx={{ fontSize: 40, mr: 2, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Analytics Command Center
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      Real-time gaming transaction insights with platform fee
                      analytics
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  display="flex"
                  gap={2}
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  flexWrap="wrap"
                >
                  <Card
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      p: 2,
                      minWidth: "140px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={1}
                    >
                      <MonetizationOn
                        sx={{ mr: 1, opacity: 0.8, color: "white" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ opacity: 1, color: "white" }}
                      >
                        API Balance
                      </Typography>
                    </Box>
                    {coinsLoading ? (
                      <Skeleton
                        variant="text"
                        width="60%"
                        sx={{ mx: "auto" }}
                      />
                    ) : (
                      <Typography
                        sx={{ color: "white" }}
                        variant="h6"
                        fontWeight="bold"
                      >
                        {formatCompactNumber(apiCoins)} Coins
                      </Typography>
                    )}
                  </Card>
                </Box>
              </Grid>
            </Grid>

            {loading && (
              <LinearProgress
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Fade>

      {analyticsData && overallMetrics && (
        <>
          {/* Key Metrics Grid - UPDATED WITH PLATFORM FEES */}
          <Fade in={true} timeout={1000}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  title: "Active Clients",
                  value: overallMetrics.totalClients,
                  icon: PeopleAlt,
                  color: theme.primary,
                  trend: "+12%",
                  subtitle: "gaming clients",
                },
                {
                  title: "Total Games",
                  value: formatCompactNumber(overallMetrics.totalGameRounds),
                  icon: Casino,
                  color: theme.info,
                  trend: "+8%",
                  subtitle: "game rounds played",
                },
                {
                  title: "Platform Fees",
                  value: formatCompactNumber(overallMetrics.totalPlatformFees),
                  icon: MonetizationOn,
                  color: theme.warning,
                  trend: "+25%",
                  subtitle: "platform fees collected",
                },
                {
                  title: "Admin Profit",
                  value: formatCompactNumber(overallMetrics.adminProfit),
                  icon: TrendingUp,
                  color:
                    overallMetrics.adminProfit >= 0
                      ? theme.success
                      : theme.error,
                  trend: "+15%",
                  subtitle: "gross profit from games",
                },
                {
                  title: "Net Revenue",
                  value: formatCompactNumber(overallMetrics.netRevenue),
                  icon: MonetizationOn,
                  color:
                    overallMetrics.netRevenue >= 0
                      ? theme.success
                      : theme.error,
                  trend: "+10%",
                  subtitle: "profit after fees paid",
                },
              ].map((metric, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: theme.borderRadius,
                      boxShadow: theme.shadow,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 40px ${metric.color}40`,
                        borderColor: `${metric.color}60`,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "14px",
                            backgroundColor: `${metric.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <metric.icon
                            sx={{ fontSize: 28, color: metric.color }}
                          />
                        </Box>
                        <Chip
                          label={metric.trend}
                          size="small"
                          sx={{
                            backgroundColor: metric.trend.startsWith("+")
                              ? "#e8f5e8"
                              : "#ffeaa7",
                            color: metric.trend.startsWith("+")
                              ? theme.success
                              : theme.warning,
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={metric.color}
                        gutterBottom
                      >
                        {metric.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.textSecondary }}
                        fontWeight="medium"
                      >
                        {metric.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                        {metric.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>

          {/* Charts Section - UPDATED WITH COMBINED DATA */}
          <Fade in={true} timeout={1200}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Pie Chart - Overall Distribution */}
              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.shadow,
                    height: 400,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                      <Timeline sx={{ mr: 2, color: theme.primary }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: theme.textPrimary }}>
                        Revenue Distribution
                      </Typography>
                    </Box>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="value"
                            label={(props) => {
                              const { name, percent } = props;
                              return {
                                ...props,
                                fill: theme.textPrimary,
                                fontSize: 12,
                                value: `${name} (${(percent * 100).toFixed(1)}%)`
                              };
                            }}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name) => [
                              formatCurrency(value),
                              name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Bar Chart - Combined Metrics */}
              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.borderRadius,
                    boxShadow: theme.shadow,
                    height: 400,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                      <Assessment sx={{ mr: 2, color: theme.primary }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: theme.textPrimary }}>
                        Combined Performance Overview
                      </Typography>
                    </Box>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.border}
                          />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fill: theme.textSecondary }}
                            stroke={theme.border}
                          />
                          <YAxis 
                            tick={{ fill: theme.textSecondary }}
                            stroke={theme.border}
                          />
                          <RechartsTooltip
                            formatter={(value) => [
                              formatCurrency(value),
                              "Amount",
                            ]}
                            labelStyle={{ color: "#333" }}
                          />
                          <Legend />
                          <Bar
                            dataKey="bets"
                            fill={theme.primary}
                            name="Total Bets"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="wins"
                            fill={theme.success}
                            name="Total Wins"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="platformFees"
                            fill={theme.warning}
                            name="Platform Fees (Cost)"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="betFees"
                            fill={theme.secondary}
                            name="Bet Fees (Cost)"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="adminProfit"
                            fill={theme.info}
                            name="Admin Profit"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="netRevenue"
                            fill={theme.primary}
                            name="Net Revenue"
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Fade>

          {/* Detailed Client Analytics with Pagination - UPDATED WITH PLATFORM FEES */}
          <Fade in={true} timeout={1400}>
            <Card
              sx={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.borderRadius,
                boxShadow: theme.shadow,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.border}` }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center">
                      <Games sx={{ mr: 2, color: theme.primary }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.textPrimary }}>
                          Detailed Client Analytics
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                          Comprehensive performance insights with platform fee
                          breakdown
                        </Typography>
                      </Box>
                    </Box>

                    {loading && <CircularProgress size={24} />}
                  </Box>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.accent }}>
                        <TableCell
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Client Details
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Games
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Win Rate
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Total Bets
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Total Wins
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Platform Fees
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Bet Fees
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Net Result
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", color: theme.primary }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedClients.map((client) => (
                        <React.Fragment key={client.clientUid}>
                          <TableRow
                            sx={{
                              "&:hover": { backgroundColor: theme.accent },
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                  color={theme.primary}
                                >
                                  Client {client.clientUid}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: theme.textSecondary }}
                                >
                                  {client.completedGames} completed •{" "}
                                  {client.incompleteGames} pending
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={client.totalGameRounds}
                                size="small"
                                sx={{
                                  backgroundColor: `${theme.info}15`,
                                  color: theme.info,
                                  fontWeight: "bold",
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                              >
                                {client.winRate >= 50 ? (
                                  <TrendingUp
                                    sx={{
                                      color: theme.success,
                                      mr: 0.5,
                                      fontSize: 18,
                                    }}
                                  />
                                ) : (
                                  <TrendingDown
                                    sx={{
                                      color: theme.error,
                                      mr: 0.5,
                                      fontSize: 18,
                                    }}
                                  />
                                )}
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  color={
                                    client.winRate >= 50
                                      ? theme.success
                                      : theme.error
                                  }
                                >
                                  {client.winRate.toFixed(1)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold", color:"white" }}
                            >
                              {formatCompactNumber(
                                client.summary.totalBetAmount
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: theme.success, fontWeight: "bold" }}
                            >
                              {formatCompactNumber(
                                client.summary.totalWinAmount
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: theme.warning, fontWeight: "bold" }}
                            >
                              {formatCompactNumber(
                                client.summary.totalPlatformFees || 0
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: theme.secondary,
                                fontWeight: "bold",
                              }}
                            >
                              {formatCompactNumber(
                                client.summary.totalBetFees || 0
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color:
                                  client.netPlayerResult >= 0
                                    ? theme.success
                                    : theme.error,
                                fontWeight: "bold",
                              }}
                            >
                              {client.netPlayerResult >= 0 ? "+" : ""}
                              {formatCompactNumber(client.netPlayerResult)}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View game details">
                                <IconButton
                                  onClick={() =>
                                    toggleClientExpansion(client.clientUid)
                                  }
                                  size="small"
                                  sx={{
                                    color: theme.primary,
                                    "&:hover": {
                                      backgroundColor: `${theme.primary}10`,
                                    },
                                  }}
                                >
                                  {expandedClients.has(client.clientUid) ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>

                          {/* Expanded Row */}
                          <TableRow>
                            <TableCell colSpan={9} sx={{ p: 0, border: 0 }}>
                              <Collapse
                                in={expandedClients.has(client.clientUid)}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box
                                  sx={{
                                    p: 3,
                                    backgroundColor: theme.accent,
                                    borderRadius: "0 0 12px 12px",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    gutterBottom
                                    color={theme.primary}
                                  >
                                    Recent Game Analysis - Client{" "}
                                    {client.clientUid}
                                  </Typography>

                                  <Grid container spacing={2}>
                                    {client.gameFlows
                                      .slice(0, 4)
                                      .map((flow, index) => (
                                        <Grid
                                          item
                                          xs={12}
                                          md={6}
                                          lg={3}
                                          key={flow.gameRound}
                                        >
                                          <Card
                                            sx={{
                                              p: 2,
                                              backgroundColor: "#0e1527",
                                              borderRadius: "12px",
                                              boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.1)",
                                              height: "100%",
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              color={theme.textSecondary}
                                              gutterBottom
                                            >
                                              Round: {flow.gameRound.slice(-8)}
                                              ...
                                            </Typography>

                                            <Box
                                              display="flex"
                                              justifyContent="space-between"
                                              alignItems="center"
                                              mb={1}
                                            >
                                              <Chip
                                                label={
                                                  flow.outcome === "PLAYER_WIN"
                                                    ? "WIN"
                                                    : flow.outcome ===
                                                      "HOUSE_WIN"
                                                    ? "LOSS"
                                                    : flow.outcome
                                                }
                                                size="small"
                                                sx={{
                                                  backgroundColor:
                                                    flow.outcome ===
                                                    "PLAYER_WIN"
                                                      ? `${theme.success}15`
                                                      : flow.outcome ===
                                                        "HOUSE_WIN"
                                                      ? `${theme.error}15`
                                                      : `${theme.warning}15`,
                                                  color:
                                                    flow.outcome ===
                                                    "PLAYER_WIN"
                                                      ? theme.success
                                                      : flow.outcome ===
                                                        "HOUSE_WIN"
                                                      ? theme.error
                                                      : theme.warning,
                                                  fontWeight: "bold",
                                                }}
                                              />
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                color={
                                                  flow.netResult >= 0
                                                    ? theme.success
                                                    : theme.error
                                                }
                                              >
                                                {flow.netResult >= 0 ? "+" : ""}
                                                {formatCompactNumber(
                                                  flow.netResult
                                                )}
                                              </Typography>
                                            </Box>

                                            <Typography
                                              variant="caption"
                                              color={theme.textSecondary}
                                              sx={{
                                                display: "block",
                                                lineHeight: 1.3,
                                                mt: 1,
                                              }}
                                            >
                                              {flow.analysis}
                                            </Typography>

                                            <Box
                                              mt={1}
                                              pt={1}
                                              borderTop="1px solid #f0f0f0"
                                            >
                                              <Typography
                                                variant="caption"
                                                color={theme.textSecondary}
                                              >
                                                Bet:{" "}
                                                {formatCompactNumber(
                                                  flow.actualBetAmount
                                                )}{" "}
                                                • Win:{" "}
                                                {formatCompactNumber(
                                                  flow.actualWinAmount
                                                )}
                                              </Typography>
                                              {flow.platformFee > 0 && (
                                                <Typography
                                                  variant="caption"
                                                  color={theme.warning}
                                                  sx={{ display: "block" }}
                                                >
                                                  Platform Fee:{" "}
                                                  {formatCompactNumber(
                                                    flow.platformFee
                                                  )}
                                                </Typography>
                                              )}
                                            </Box>
                                          </Card>
                                        </Grid>
                                      ))}
                                  </Grid>

                                  {/* Client Summary Stats - UPDATED WITH PLATFORM FEES */}
                                  <Box
                                    mt={3}
                                    p={2}
                                    sx={{
                                      backgroundColor: "#0e1527",
                                      borderRadius: "12px",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      gutterBottom
                                      color={theme.primary}
                                    >
                                      Performance Summary
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Biggest Win
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color={theme.success}
                                        >
                                          {formatCompactNumber(
                                            client.summary.biggestWin
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Biggest Loss
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color={theme.error}
                                        >
                                          {formatCompactNumber(
                                            client.summary.biggestLoss
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Avg Bet Size
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color="white"
                                        >
                                          {formatCompactNumber(
                                            client.summary.averageBetSize
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Platform Fees
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color={theme.warning}
                                        >
                                          {formatCompactNumber(
                                            client.summary.totalPlatformFees ||
                                              0
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Bet Fees
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color={theme.secondary}
                                        >
                                          {formatCompactNumber(
                                            client.summary.totalBetFees || 0
                                          )}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={2}>
                                        <Typography
                                          variant="caption"
                                          color={theme.textSecondary}
                                        >
                                          Avg Duration
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                        >
                                          {(
                                            client.summary.averageGameDuration /
                                            1000
                                          ).toFixed(1)}
                                          s
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      justifyContent: "center",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: "8px",
                          fontWeight: "medium",
                        },
                        "& .Mui-selected": {
                          backgroundColor: theme.primary,
                          color: "white",
                          "&:hover": {
                            backgroundColor: theme.secondary,
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>

          {/* Performance Insights Card - UPDATED WITH PLATFORM FEES */}
          <Fade in={true} timeout={1600}>
            <Card
              sx={{
                mt: 4,
                borderRadius: theme.borderRadius,
                boxShadow: theme.shadow,
                background: "#1e293b",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Analytics
                    sx={{ mr: 2, color: theme.primary, fontSize: 32 }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={theme.primary}
                    >
                      Performance Insights with Fee Analytics
                    </Typography>
                    <Typography variant="body2" color={theme.textSecondary}>
                      Key observations from gaming data including platform fee
                      performance
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box
                      p={3}
                      sx={{
                        backgroundColor: "#0e1527",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        height: "100%",
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <TrendingUp sx={{ color: theme.success, mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          Admin Profit Margin
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={
                          overallMetrics.adminProfit >= 0
                            ? theme.success
                            : theme.error
                        }
                        gutterBottom
                      >
                        {overallMetrics.adminProfit >= 0 ? "+" : ""}
                        {(
                          (overallMetrics.adminProfit /
                            (overallMetrics.totalBets || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="body2" color={theme.textSecondary}>
                        Admin profit margin from total betting volume
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box
                      p={3}
                      sx={{
                        backgroundColor: "#0e1527",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        height: "100%",
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <MonetizationOn sx={{ color: theme.warning, mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          Platform Fee Rate
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={theme.warning}
                        gutterBottom
                      >
                        {(
                          (overallMetrics.totalPlatformFees /
                            (overallMetrics.totalBets || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="body2" color={theme.textSecondary}>
                        Platform fees as % of total bets
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box
                      p={3}
                      sx={{
                        backgroundColor: "#0e1527",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        height: "100%",
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <PeopleAlt sx={{ color: theme.info, mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          Client Activity
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={theme.info}
                        gutterBottom
                      >
                        {(
                          overallMetrics.totalGameRounds /
                          overallMetrics.totalClients
                        ).toFixed(0)}
                      </Typography>
                      <Typography variant="body2" color={theme.textSecondary}>
                        Average games per active client
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box
                      p={3}
                      sx={{
                        backgroundColor: "#0e1527",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        height: "100%",
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Casino sx={{ color: theme.secondary, mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          Total Fee Collection
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={theme.secondary}
                        gutterBottom
                      >
                        {formatCompactNumber(overallMetrics.totalFees)}
                      </Typography>
                      <Typography variant="body2" color={theme.textSecondary}>
                        Combined platform and betting fees
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  mt={4}
                  p={3}
                  sx={{
                    backgroundColor: "rgba(26, 35, 126, 0.05)",
                    borderRadius: "12px",
                    border: `1px solid ${theme.primary}20`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color={theme.primary}
                    gutterBottom
                  >
                    📊 Enhanced Analytics Summary
                  </Typography>
                  <Typography
                    variant="body2"
                    color={theme.textSecondary}
                    sx={{ lineHeight: 1.6 }}
                  >
                    Currently tracking{" "}
                    <strong>
                      {overallMetrics.totalClients} active clients
                    </strong>{" "}
                    with
                    <strong>
                      {" "}
                      {formatNumber(overallMetrics.totalGameRounds)} total game
                      rounds
                    </strong>
                    . Admin gross profit:{" "}
                    <strong>{overallMetrics.adminProfit} rupees</strong>
                    {overallMetrics.adminProfit >= 0
                      ? " (profitable)"
                      : " (losing)"}
                    . Coins used by players:{" "}
                    <strong>{overallMetrics.totalFees} coins</strong> (Platform
                    usage: {overallMetrics.totalPlatformFees} coins, Bet
                    placements: {overallMetrics.totalBetFees} coins). Final net
                    revenue: <strong>{overallMetrics.netRevenue} rupees</strong>
                    {overallMetrics.netRevenue >= 0 ? " ✅" : " ❌"}.
                  </Typography>
                </Box>

                {/* Coin Usage Breakdown */}
                <Box
                  mt={3}
                  p={3}
                  sx={{
                    backgroundColor: "rgba(245, 124, 0, 0.05)",
                    borderRadius: "12px",
                    border: `1px solid ${theme.warning}20`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color={theme.warning}
                    gutterBottom
                  >
                    💸 Coin Usage Breakdown
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={theme.textSecondary}>
                        <strong>Platform Usage Coins:</strong>{" "}
                        {overallMetrics.totalPlatformFees} coins (
                        {(
                          (overallMetrics.totalPlatformFees /
                            overallMetrics.totalFees) *
                          100
                        ).toFixed(1)}
                        % of total coins used)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={theme.textSecondary}>
                        <strong>Bet Placement Coins:</strong>{" "}
                        {overallMetrics.totalBetFees} coins (
                        {(
                          (overallMetrics.totalBetFees /
                            overallMetrics.totalFees) *
                          100
                        ).toFixed(1)}
                        % of total coins used)
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography
                    variant="body2"
                    color={theme.textSecondary}
                    sx={{ mt: 2 }}
                  >
                    <strong>Total Coins Used:</strong>{" "}
                    {overallMetrics.totalFees} coins, reducing admin profit by{" "}
                    {(
                      (overallMetrics.totalFees /
                        Math.abs(overallMetrics.adminProfit || 1)) *
                      100
                    ).toFixed(1)}
                    %.
                    <br />
                    <strong>Final Result:</strong> Admin{" "}
                    {overallMetrics.netRevenue >= 0 ? "PROFIT" : "LOSS"} of{" "}
                    {Math.abs(overallMetrics.netRevenue)} rupees
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </>
      )}

      {/* No Data State */}
      {!analyticsData && !loading && (
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" sx={{ py: 8 }}>
            <Card
              sx={{
                p: 6,
                borderRadius: theme.borderRadius,
                boxShadow: theme.shadow,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <Analytics sx={{ fontSize: 80, color: "text.disabled", mb: 3 }} />
              <Typography variant="h6" color={theme.textSecondary} gutterBottom>
                No Analytics Data Available
              </Typography>
              <Typography variant="body2" color={theme.textSecondary} sx={{ mb: 3 }}>
                Start by loading analytics data to view comprehensive gaming
                insights with platform fee analytics
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  fetchAnalytics();
                  fetchApiCoins();
                }}
                startIcon={<Refresh />}
                sx={{
                  backgroundColor: theme.primary,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: theme.secondary,
                  },
                }}
              >
                Load Analytics Data
              </Button>
            </Card>
          </Box>
        </Fade>
      )}

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: "center", pb: 4 }}>
        <Typography variant="body2" color={theme.textSecondary}>
          Analytics dashboard with enhanced platform fee tracking and combined
          data visualization
        </Typography>
        <Typography variant="caption" color={theme.textSecondary}>
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ApiTransaction;
