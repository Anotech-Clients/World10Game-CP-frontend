import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  createTheme,
  ThemeProvider,
  alpha,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  TextField,
} from "@mui/material";
import {
  PeopleAlt as PeopleIcon,
  PersonAdd as PersonAddIcon,
  AccountBalance as BalanceIcon,
  TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  AccessTime as TimeIcon,
  CheckCircle as SuccessIcon,
  Cancel as RejectIcon,
  Pending as PendingIcon,
  Casino as CasinoIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// Professional color palette
const colors = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  dark: "#f8fafc",
  light: "#94a3b8",
  background: {
    default: "#0f172a",
    paper: "#1e293b",
    card: "#1e293b",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    disabled: "#64748b",
  },
  border: {
    light: "rgba(148, 163, 184, 0.12)",
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 700,
      fontSize: "1.1rem",
      color: colors.text.primary,
    },
    body1: {
      fontSize: "0.95rem",
      color: colors.text.primary,
    },
    body2: {
      fontSize: "0.875rem",
      color: colors.text.secondary,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderRadius: 16,
          border: `1px solid ${colors.border.light}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          },
        },
      },
    },
  },
});

// Custom styles for charts
const chartStyles = {
  fontSize: "12px",
  fontFamily: "Inter, sans-serif",
};

const Dashboard = () => {
  const { axiosInstance } = useAuth();
  const [stats, setStats] = useState(null);
  const [depositStats, setDepositStats] = useState(null);
  const [withdrawStats, setWithdrawStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winningSettings, setWinningSettings] = useState({
    isRandomWinning: false,
  });
  const [biasedSettings, setBiasedSettings] = useState({
    isBiased: false,
    minBettingAmount: 0,
  });
  const [sameResultSettings, setSameResultSettings] = useState({
    isSameResultLikeOfficial: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          depositRes,
          withdrawRes,
          winningTypeRes,
          biasednessRes,
          sameResultRes
        ] = await Promise.all([
          axiosInstance.get("/api/admin/dashboard/stats"),
          axiosInstance.get("/api/admin/dashboard/deposit-stats"),
          axiosInstance.get("/api/admin/dashboard/withdraw-stats"),
          axiosInstance.get("/api/master-game/winning-type/winning-type"),
          axiosInstance.get("/api/master-game/winning-type/game-biasedness"),
          axiosInstance.get("/api/admin/isSameResult/result-behavior")
        ]);

        setStats(statsRes.data.data);
        setDepositStats(depositRes.data.data);
        setWithdrawStats(withdrawRes.data.data);
        setWinningSettings(winningTypeRes.data.data);
        setBiasedSettings(biasednessRes.data.data);
        setSameResultSettings(sameResultRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  const handleSameResultChange = async (event) => {
    try {
      const isSameResultLikeOfficial = event.target.checked;
      await axiosInstance.post("/api/admin/isSameResult/result-behavior", {
        isSameResultLikeOfficial
      });
      setSameResultSettings({ isSameResultLikeOfficial });

      // If same result is enabled, disable random winning and biased settings
      if (isSameResultLikeOfficial) {
        setWinningSettings({ ...winningSettings, isRandomWinning: false });
        setBiasedSettings({ ...biasedSettings, isBiased: false });
      }
    } catch (error) {
      console.error("Error updating same result behavior:", error);
    }
  };

  const handleWinningTypeChange = async (event) => {
    // Only allow changes if same result is disabled
    if (!sameResultSettings.isSameResultLikeOfficial) {
      try {
        const isRandomWinning = event.target.checked;
        await axiosInstance.put("/api/master-game/winning-type/update-winning-type", { isRandomWinning });
        setWinningSettings({ ...winningSettings, isRandomWinning });

        // If random winning is disabled, also disable biasedness
        if (!isRandomWinning) {
          setBiasedSettings({ ...biasedSettings, isBiased: false });
        }
      } catch (error) {
        console.error("Error updating winning type:", error);
      }
    }
  };
  const handleBiasednessChange = async (event) => {
    try {
      const isBiased = event.target.checked;
      await axiosInstance.put("/api/master-game/winning-type/game-biasedness/update", {
        ...biasedSettings,
        isBiased,
      });
      setBiasedSettings({ ...biasedSettings, isBiased });
    } catch (error) {
      console.error("Error updating biasedness:", error);
    }
  };

  const handleMinBettingAmountChange = async (event) => {
    const minBettingAmount = parseFloat(event.target.value);
    setBiasedSettings({ ...biasedSettings, minBettingAmount });
  };

  const handleMinBettingAmountBlur = async () => {
    try {
      await axiosInstance.put("/game-biasedness/update", biasedSettings);
    } catch (error) {
      console.error("Error updating min betting amount:", error);
    }
  };

  const GameSettingsCard = () => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CasinoIcon sx={{ color: colors.primary, mr: 1 }} />
          <Typography variant="h6">Game Settings</Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={sameResultSettings.isSameResultLikeOfficial}
                    onChange={handleSameResultChange}
                    color="primary"
                  />
                }
                label="Same Period Same Result"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enable to match results with official period results
              </Typography>
            </Paper>
          </Grid> */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                borderRadius: 2,
                opacity: sameResultSettings.isSameResultLikeOfficial ? 0.5 : 1,
                pointerEvents: sameResultSettings.isSameResultLikeOfficial ? 'none' : 'auto',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={winningSettings.isRandomWinning}
                    onChange={handleWinningTypeChange}
                    color="primary"
                    disabled={sameResultSettings.isSameResultLikeOfficial}
                  />
                }
                label="Random Winning"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enable random winning pattern for games
              </Typography>
            </Paper>
          </Grid>
          {winningSettings.isRandomWinning && !sameResultSettings.isSameResultLikeOfficial && (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={biasedSettings.isBiased}
                      onChange={handleBiasednessChange}
                      color="primary"
                    />
                  }
                  label="Biased Winning"
                />
                {biasedSettings.isBiased && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Minimum Betting Amount"
                      type="number"
                      value={biasedSettings.minBettingAmount}
                      onChange={handleMinBettingAmountChange}
                      onBlur={handleMinBettingAmountBlur}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: "₹ ",
                      }}
                    />
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Enable biased winning pattern with minimum betting amount
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, color, icon: Icon, subtitle }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.1),
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color: colors.text.primary, mb: 1 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: alpha(color, 0.8) }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const TransactionCard = ({ title, data, color, icon: Icon }) => {
    const getStatusIcon = (key) => {
      if (key.includes("success")) return <SuccessIcon sx={{ color: colors.success }} />;
      if (key.includes("pending")) return <PendingIcon sx={{ color: colors.warning }} />;
      if (key.includes("rejected")) return <RejectIcon sx={{ color: colors.error }} />;
      return <TimeIcon sx={{ color: colors.info }} />;
    };

    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Icon sx={{ color: color, mr: 1 }} />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Grid container spacing={2}>
            {Object.entries(data || {}).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: colors.background.card,
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    {getStatusIcon(key)}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    ₹ {value.amount.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: alpha(color, 0.1),
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: color,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {value.count} transactions
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const TransactionPieChart = ({ data, title, type }) => {
    const chartData = [
      {
        name: "Pending",
        value: type === 'deposits'
          ? data?.pendingDeposits?.amount || 0
          : data?.pendingWithdraws?.amount || 0
      },
      {
        name: "Success",
        value: type === 'deposits'
          ? data?.successDeposits?.amount || 0
          : data?.successWithdraws?.amount || 0
      },
      {
        name: "Rejected",
        value: type === 'deposits'
          ? data?.rejectedDeposits?.amount || 0
          : data?.rejectedWithdraws?.amount || 0
      },
    ];

    const COLORS = [colors.warning, colors.success, colors.error];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <Box
            sx={{
              backgroundColor: colors.background.paper,
              padding: '12px',
              border: `1px solid ${colors.border.light}`,
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Typography variant="body2" sx={{ color: colors.text.primary }}>
              {`${payload[0].name}: ₹ ${payload[0].value.toLocaleString()}`}
            </Typography>
          </Box>
        );
      }
      return null;
    };

    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      value,
      index
    }) => {
      if (value === 0) return null;

      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 20;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const innerX = cx + (outerRadius - 5) * Math.cos(-midAngle * RADIAN);
      const innerY = cy + (outerRadius - 5) * Math.sin(-midAngle * RADIAN);

      const percentValue = `${(percent * 100).toFixed(0)}%`;

      return (
        <g>
          <path
            d={`M${innerX},${innerY}L${x},${y}`}
            stroke={colors.text.secondary}
            fill="none"
            strokeWidth={1}
          />
          <circle cx={x} cy={y} r={2} fill={colors.text.secondary} />
          <text
            x={x}
            y={y}
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="middle"
            fill={colors.text.primary}
            dx={x > cx ? 5 : -5}
            style={{
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            {percentValue}
          </text>
        </g>
      );
    };

    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>{title}</Typography>
          <Box sx={{ width: "100%", height: 300, position: "relative" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(value, entry) => (
                    <span style={chartStyles}>{value}</span>
                  )}
                  iconSize={10}
                  wrapperStyle={{ ...chartStyles, paddingTop: '20px' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const TransactionBarChart = ({ depositData, withdrawData }) => {
    const chartData = [
      {
        name: "Pending",
        deposits: depositData?.pendingDeposits?.amount || 0,
        withdrawals: withdrawData?.pendingWithdraws?.amount || 0,
      },
      {
        name: "Success",
        deposits: depositData?.successDeposits?.amount || 0,
        withdrawals: withdrawData?.successWithdraws?.amount || 0,
      },
      {
        name: "Rejected",
        deposits: depositData?.rejectedDeposits?.amount || 0,
        withdrawals: withdrawData?.rejectedWithdraws?.amount || 0,
      },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <Box
            sx={{
              backgroundColor: colors.background.paper,
              padding: '12px',
              border: `1px solid ${colors.border.light}`,
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
              {label}
            </Typography>
            {payload.map((entry, index) => (
              <Typography
                key={`tooltip-${index}`}
                variant="body2"
                sx={{
                  color: entry.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {`${entry.name}: ₹ ${entry.value.toLocaleString()}`}
              </Typography>
            ))}
          </Box>
        );
      }
      return null;
    };

    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Transaction Overview</Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontFamily: 'Inter, sans-serif' }}
                />
                <YAxis
                  tick={{ fontFamily: 'Inter, sans-serif' }}
                  tickFormatter={(value) => {
                    if (value < 1000) {
                      return `₹ ${value}`;
                    } else if (value < 100000) {
                      return `₹ ${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
                    } else if (value < 10000000) {
                      return `₹ ${(value / 100000).toFixed(1).replace(/\.0$/, '')}L`;
                    } else {
                      return `₹ ${(value / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
                    }
                  }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={chartStyles}
                  formatter={(value, entry) => (
                    <span style={chartStyles}>{value}</span>
                  )}
                />
                <Bar
                  dataKey="deposits"
                  fill={colors.primary}
                  name="Deposits"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="withdrawals"
                  fill={colors.purple}
                  name="Withdrawals"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", borderRadius: '16px', padding: 3, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>


          {/* Main Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={stats?.activeUsers || 0}
              color={colors.primary}
              icon={PeopleIcon}
              subtitle="Currently online"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              color={colors.purple}
              icon={PersonAddIcon}
              subtitle="Registered users"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Registrations"
              value={stats?.todaysRegistrations || 0}
              color={colors.success}
              icon={TrendingUpIcon}
              subtitle="New users today"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Balance"
              value={`₹ ${stats?.totalUserBalance?.toLocaleString() || 0}`}
              color={colors.warning}
              icon={BalanceIcon}
              subtitle="Current holdings"
            />
          </Grid>

          {/* Transaction Overview */}
          <Grid item xs={12} md={6}>
            <TransactionCard
              title="Deposits Overview"
              data={depositStats}
              color={colors.primary}
              icon={ArrowUpIcon}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TransactionCard
              title="Withdrawals Overview"
              data={withdrawStats}
              color={colors.purple}
              icon={ArrowDownIcon}
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} md={4}>
            <TransactionPieChart
              data={depositStats}
              title="Deposits Distribution"
              type="deposits"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TransactionPieChart
              data={withdrawStats}
              title="Withdrawals Distribution"
              type="withdrawals"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TransactionBarChart
              depositData={depositStats}
              withdrawData={withdrawStats}
            />
          </Grid>

          {/* Game Settings Card */}
          {/* <Grid item xs={12}>
            <GameSettingsCard />
          </Grid> */}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;