import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { Users, TrendingUp } from "lucide-react";

// Car Race data structure - exactly matching WebSocket service
const firstPlaceNumbers = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];
const secondPlaceNumbers = ["SECOND_ONE", "SECOND_TWO", "SECOND_THREE", "SECOND_FOUR", "SECOND_FIVE", "SECOND_SIX", "SECOND_SEVEN", "SECOND_EIGHT", "SECOND_NINE", "SECOND_TEN"];
const thirdPlaceNumbers = ["THIRD_ONE", "THIRD_TWO", "THIRD_THREE", "THIRD_FOUR", "THIRD_FIVE", "THIRD_SIX", "THIRD_SEVEN", "THIRD_EIGHT", "THIRD_NINE", "THIRD_TEN"];

const placeCharacteristics = [
  {
    label: "First Place",
    color: "#FFD700",
    options: [
      { key: "FIRST_PLACE_BIG", label: "BIG", color: "#22c55e" },
      { key: "FIRST_PLACE_SMALL", label: "SMALL", color: "#f97316" },
      { key: "FIRST_PLACE_ODD", label: "ODD", color: "#3b82f6" },
      { key: "FIRST_PLACE_EVEN", label: "EVEN", color: "#a855f7" }
    ]
  },
  {
    label: "Second Place", 
    color: "#C0C0C0",
    options: [
      { key: "SECOND_PLACE_BIG", label: "BIG", color: "#22c55e" },
      { key: "SECOND_PLACE_SMALL", label: "SMALL", color: "#f97316" },
      { key: "SECOND_PLACE_ODD", label: "ODD", color: "#3b82f6" },
      { key: "SECOND_PLACE_EVEN", label: "EVEN", color: "#a855f7" }
    ]
  },
  {
    label: "Third Place",
    color: "#CD7F32", 
    options: [
      { key: "THIRD_PLACE_BIG", label: "BIG", color: "#22c55e" },
      { key: "THIRD_PLACE_SMALL", label: "SMALL", color: "#f97316" },
      { key: "THIRD_PLACE_ODD", label: "ODD", color: "#3b82f6" },
      { key: "THIRD_PLACE_EVEN", label: "EVEN", color: "#a855f7" }
    ]
  }
];

const CarRaceBettingMonitor = ({ websocketUrl, selectedTimer, periodId }) => {
  const theme = useTheme();
  const [monitorData, setMonitorData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  /* -------------------- NORMALIZE TIMER -------------------- */
  const normalizedTimer = useMemo(
    () => TIMER_MAP[selectedTimer] ?? selectedTimer,
    [selectedTimer]
  );

  /* -------------------- WEBSOCKET -------------------- */
  useEffect(() => {
    mountedRef.current = true;
    let reconnectAttempts = 0;
    let pingInterval;

    const connect = () => {
      if (!mountedRef.current) return;

      if (wsRef.current) wsRef.current.close();

      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const socket = new WebSocket(`${websocketUrl}?token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsLoading(false);
        setError(null);
        setConnectionStatus("connected");

        pingInterval = setInterval(() => {
          socket.readyState === 1 && socket.send(JSON.stringify({ type: "ping" }));
        }, 25000);
      };

      socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "carRaceMonitorUpdate") {
          setMonitorData(msg.data);
        }
      };

      socket.onclose = () => {
        clearInterval(pingInterval);
        setConnectionStatus("disconnected");

        reconnectAttempts++;
        const delay = Math.min(1000 * 1.5 ** reconnectAttempts, 30000);

        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [websocketUrl]);

  /* -------------------- CURRENT PERIOD -------------------- */
  const currentPeriod = useMemo(() => {
    if (!monitorData?.activePeriods) return null;

    return (
      monitorData.activePeriods.find(
        p => p.timerType === normalizedTimer && p.periodId === periodId
      ) ||
      monitorData.activePeriods
        .filter(p => p.timerType === normalizedTimer)
        .slice(-1)[0] ||
      null
    );
  }, [monitorData, normalizedTimer, periodId]);

  const timerBetAmounts = monitorData?.timerSummary?.[normalizedTimer] || {};

  const maxBetAmount = useMemo(() => {
    if (!currentPeriod?.betAmounts) return 0;
    return Math.max(0, ...Object.values(currentPeriod.betAmounts));
  }, [currentPeriod]);

  const getPercent = (amount) =>
    !maxBetAmount || !amount ? 0 : (amount / maxBetAmount) * 100;

  /* -------------------- STATES -------------------- */
  if (isLoading) {
    return (
      <Card>
        <LinearProgress />
        <Typography textAlign="center" p={2}>
          Loading Car Race data…
        </Typography>
      </Card>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!currentPeriod) {
    return <Alert severity="warning">No data for this period</Alert>;
  }


  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: 2,
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Header Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Users size={20} className="text-gray-600" />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                  🏎️ Car Race - Active Users: {monitorData?.activeUsers || 0}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp size={20} className="text-gray-600" />
                <Chip
                  label={`Total Bet Amount: ${
                    currentPeriod?.totalBetAmount?.toLocaleString() || 0
                  }`}
                  color="primary"
                  sx={{
                    ml: 1,
                    height: 28,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            </Box>

            {/* Connection Status */}
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Status: ${connectionStatus} | Period: ${periodId}`}
                color={connectionStatus === 'connected' ? 'success' : 'warning'}
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            </Box>

            {/* Car Numbers Section */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* First Place */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    bgcolor: "#FFD70020",
                    height: "100%",
                  }}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              bgcolor: "#DAA520",
                              color: "white",
                              fontSize: "0.875rem",
                            }}
                            colSpan={3}
                          >
                            🥇 First Place (1-10)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {firstPlaceNumbers.map((number, index) => {
                          const betAmount = timerBetAmounts?.[number] || 0;
                          const percentage = getBetPercentage(betAmount);

                          return (
                            <TableRow key={number}>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  sx={{
                                    bgcolor: "#DAA520",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {betAmount.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      flexGrow: 1,
                                      bgcolor: theme.palette.grey[200],
                                      borderRadius: 1,
                                      mr: 1,
                                      height: 6,
                                      position: "relative",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        height: "100%",
                                        bgcolor: "#DAA520",
                                        width: `${percentage}%`,
                                        transition: "width 0.3s ease",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontSize: "0.75rem" }}
                                  >
                                    {percentage.toFixed(1)}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Second Place */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    bgcolor: "#C0C0C020",
                    height: "100%",
                  }}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              bgcolor: "#999999",
                              color: "white",
                              fontSize: "0.875rem",
                            }}
                            colSpan={3}
                          >
                            🥈 Second Place (1-10)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {secondPlaceNumbers.map((number, index) => {
                          const betAmount = timerBetAmounts?.[number] || 0;
                          const percentage = getBetPercentage(betAmount);

                          return (
                            <TableRow key={number}>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  sx={{
                                    bgcolor: "#999999",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {betAmount.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      flexGrow: 1,
                                      bgcolor: theme.palette.grey[200],
                                      borderRadius: 1,
                                      mr: 1,
                                      height: 6,
                                      position: "relative",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        height: "100%",
                                        bgcolor: "#999999",
                                        width: `${percentage}%`,
                                        transition: "width 0.3s ease",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontSize: "0.75rem" }}
                                  >
                                    {percentage.toFixed(1)}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Third Place */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    bgcolor: "#CD7F3220",
                    height: "100%",
                  }}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              bgcolor: "#CD7F32",
                              color: "white",
                              fontSize: "0.875rem",
                            }}
                            colSpan={3}
                          >
                            🥉 Third Place (1-10)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {thirdPlaceNumbers.map((number, index) => {
                          const betAmount = timerBetAmounts?.[number] || 0;
                          const percentage = getBetPercentage(betAmount);

                          return (
                            <TableRow key={number}>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  sx={{
                                    bgcolor: "#CD7F32",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {betAmount.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.875rem" }}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      flexGrow: 1,
                                      bgcolor: theme.palette.grey[200],
                                      borderRadius: 1,
                                      mr: 1,
                                      height: 6,
                                      position: "relative",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        height: "100%",
                                        bgcolor: "#CD7F32",
                                        width: `${percentage}%`,
                                        transition: "width 0.3s ease",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontSize: "0.75rem" }}
                                  >
                                    {percentage.toFixed(1)}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Place Characteristics */}
            {placeCharacteristics.map((place) => (
              <Grid container spacing={2} sx={{ mb: 2 }} key={place.label}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: place.color }}>
                    🏆 {place.label} Characteristics
                  </Typography>
                </Grid>
                {place.options.map(({ key, label, color }) => {
                  const betAmount = timerBetAmounts?.[key] || 0;
                  const percentage = getTotalPercentage(betAmount);

                  return (
                    <Grid item xs={6} sm={3} key={key}>
                      <Paper
                        sx={{
                          p: 2,
                          borderTop: `3px solid ${color}`,
                          borderRadius: 1,
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: color,
                              mr: 1,
                            }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                          >
                            {label}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                          {betAmount.toLocaleString()}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              flexGrow: 1,
                              bgcolor: theme.palette.grey[100],
                              borderRadius: 1,
                              mr: 1,
                              height: 6,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                bgcolor: color,
                                width: `${percentage}%`,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "0.75rem",
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CarRaceBettingMonitor;