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
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    let reconnectAttempts = 0;
    let pingIntervalRef = null;

    const connect = () => {
      if (!isComponentMounted.current) return;

      // Clear existing connection safely
      if (wsRef.current) {
        try {
          wsRef.current.onclose = null;
          wsRef.current.onerror = null;
          wsRef.current.close();
        } catch (e) {
          console.warn("Error closing existing WebSocket:", e);
        }
      }

      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found. Please login again.");
        setIsLoading(false);
        return;
      }

      const wsUrl = `${websocketUrl}?token=${accessToken}`;
      
      try {
        //console.log("🔌 Connecting to Car Race Monitor WebSocket:", wsUrl);
        setConnectionStatus('connecting');
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isComponentMounted.current) {
            socket.close();
            return;
          }
          
          //console.log("✅ Car Race Monitor WebSocket connected successfully");
          setIsLoading(false);
          setError(null);
          setConnectionStatus('connected');
          reconnectAttempts = 0;

          // Send ping to keep connection alive
          if (pingIntervalRef) clearInterval(pingIntervalRef);
          pingIntervalRef = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              try {
                socket.send(JSON.stringify({ type: "ping" }));
              } catch (e) {
                console.warn("Ping failed:", e);
              }
            } else {
              clearInterval(pingIntervalRef);
            }
          }, 25000);
        };

        socket.onmessage = (event) => {
          if (!isComponentMounted.current) return;

          try {
            const data = JSON.parse(event.data);

            // Handle Car Race monitor updates
            if (data.type === "carRaceMonitorUpdate" && data.data) {
              setMonitorData(data.data);
              setIsLoading(false);
              setError(null);
            }
            else if (data.status === "connected") {
              //console.log("✅ Car Race Monitor connection confirmed:", data.message);
              setConnectionStatus('connected');
              setError(null);
            }
            else if (data.type === "pong") {
              // Pong received - connection healthy
            }
          } catch (err) {
            console.error("❌ Error processing Car Race monitor message:", err);
          }
        };

        socket.onerror = (error) => {
          if (!isComponentMounted.current) return;
          console.error("❌ Car Race Monitor WebSocket error:", error);
          setConnectionStatus('error');
        };

        socket.onclose = (event) => {
          if (!isComponentMounted.current) return;
          //console.log("🔌 Car Race Monitor WebSocket closed:", event.code, event.reason);
          
          if (pingIntervalRef) {
            clearInterval(pingIntervalRef);
            pingIntervalRef = null;
          }
          
          setConnectionStatus('disconnected');
          
          // Handle auth errors - don't reconnect
          if (event.code === 4001 || event.code === 4002 || event.code === 4003) {
            const authErrors = {
              4001: "Authentication failed. Token required.",
              4002: "Invalid or expired token. Please login again.",
              4003: "Access denied. Admin privileges required."
            };
            setError(authErrors[event.code]);
            return;
          }

          // INFINITE RECONNECTION with exponential backoff (max 30 seconds)
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(1.5, Math.min(reconnectAttempts, 10)), 30000);
          
          setError(`Connection lost. Reconnecting in ${Math.round(delay/1000)}s... (attempt ${reconnectAttempts})`);
          //console.log(`🔄 Reconnecting Car Race monitor in ${delay}ms (attempt ${reconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isComponentMounted.current) {
              connect();
            }
          }, delay);
        };

      } catch (error) {
        if (isComponentMounted.current) {
          console.error("❌ Car Race Monitor WebSocket connection error:", error);
          setConnectionStatus('error');
          
          reconnectAttempts++;
          const delay = Math.min(2000 * Math.pow(1.5, Math.min(reconnectAttempts, 8)), 30000);
          setError(`Connection failed. Retrying in ${Math.round(delay/1000)}s...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isComponentMounted.current) {
              connect();
            }
          }, delay);
        }
      }
    };

    connect();

    return () => {
      isComponentMounted.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (pingIntervalRef) {
        clearInterval(pingIntervalRef);
      }

      if (wsRef.current) {
        try {
          wsRef.current.onclose = null;
          wsRef.current.onerror = null;
          wsRef.current.close();
        } catch (e) {
          console.warn("Error during cleanup:", e);
        }
      }
    };
  }, [websocketUrl]);

  const getCurrentPeriodData = () => {
    if (!monitorData || !monitorData.activePeriods) return null;
    
    const period = monitorData.activePeriods.find(
      (period) =>
        period.timerType === selectedTimer && period.periodId === periodId
    );
    
    //console.log("🎯 Current Car Race period data:", period);
    //console.log("🔍 Looking for timer:", selectedTimer, "period:", periodId);
    //console.log("📊 Available periods:", monitorData.activePeriods);
    
    return period;
  };

  const getTimerBetAmounts = () => {
    if (!monitorData || !monitorData.timerSummary) return null;
    return monitorData.timerSummary[selectedTimer] || null;
  };

  const currentPeriod = getCurrentPeriodData();
  const timerBetAmounts = getTimerBetAmounts();
  const maxBetAmount = currentPeriod
    ? Math.max(...Object.values(currentPeriod.betAmounts || {}))
    : 0;

  const getBetPercentage = (amount) => {
    if (!maxBetAmount || !amount) return 0;
    return (amount / maxBetAmount) * 100;
  };

  const getTotalPercentage = (amount) => {
    const total = currentPeriod?.totalBetAmount || 0;
    if (!total || !amount) return 0;
    return (amount / total) * 100;
  };

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <LinearProgress />
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 1, p: 2 }}>
          Loading Car Race betting data... ({connectionStatus})
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
        {error}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Status: {connectionStatus} | Timer: {selectedTimer} | Period: {periodId}
        </Typography>
      </Alert>
    );
  }

  if (!currentPeriod) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
        No Car Race betting data available for the selected timer and period.
        <Typography variant="body2" sx={{ mt: 1 }}>
          Timer: {selectedTimer} | Period: {periodId}
        </Typography>
        <Typography variant="body2">
          Available periods: {monitorData?.activePeriods?.length || 0}
        </Typography>
      </Alert>
    );
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