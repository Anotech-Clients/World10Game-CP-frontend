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

// Constants for FiveD game options
const sectionOptions = ["A", "B", "C", "D", "E"];
const numberOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const sizeOptions = [
  { value: "SMALL", color: "#f97316" },
  { value: "BIG", color: "#3b82f6" },
];
const parityOptions = [
  { value: "ODD", color: "#22c55e" },
  { value: "EVEN", color: "#a855f7" },
];
const sumOptions = [
  { value: "0_22", label: "0-22", color: "#ef4444" },
  { value: "23_45", label: "23-45", color: "#ec4899" },
];
const sumSpecialOptions = [
  { value: "SUM_SMALL", label: "Sum Small", color: "#f97316" },
  { value: "SUM_BIG", label: "Sum Big", color: "#3b82f6" },
  { value: "SUM_ODD", label: "Sum Odd", color: "#22c55e" },
  { value: "SUM_EVEN", label: "Sum Even", color: "#a855f7" },
];

const FiveDBettingMonitor = ({ websocketUrl, selectedTimer, periodId }) => {
  const theme = useTheme();
  const [monitorData, setMonitorData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
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
        //console.log("🔌 Connecting to FiveD Bet Monitor WebSocket:", wsUrl);
        setConnectionStatus("connecting");
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isComponentMounted.current) {
            socket.close();
            return;
          }

          //console.log("✅ FiveD Bet Monitor WebSocket connected successfully");
          setIsLoading(false);
          setError(null);
          setConnectionStatus("connected");
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

            if (data.type === "fivedMonitorUpdate" && data.data) {
              setMonitorData(data.data);
              setIsLoading(false);
              setError(null);
            } else if (data.status === "connected") {
              //console.log("✅ FiveD Bet Monitor connection confirmed:", data.message);
              setConnectionStatus("connected");
              setError(null);
            } else if (data.type === "pong") {
              // Pong received - connection healthy
            }
          } catch (err) {
            console.error("❌ Error processing FiveD bet monitor message:", err);
          }
        };

        socket.onerror = (error) => {
          if (!isComponentMounted.current) return;
          console.error("❌ FiveD Bet Monitor WebSocket error:", error);
          setConnectionStatus("error");
        };

        socket.onclose = (event) => {
          if (!isComponentMounted.current) return;
          //console.log("🔌 FiveD Bet Monitor WebSocket closed:", event.code, event.reason);

          if (pingIntervalRef) {
            clearInterval(pingIntervalRef);
            pingIntervalRef = null;
          }

          setConnectionStatus("disconnected");

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
          //console.log(`🔄 Reconnecting FiveD bet monitor in ${delay}ms (attempt ${reconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isComponentMounted.current) {
              connect();
            }
          }, delay);
        };
      } catch (error) {
        if (isComponentMounted.current) {
          console.error("❌ FiveD Bet Monitor WebSocket connection error:", error);
          setConnectionStatus("error");
          
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

    //console.log("🎯 Current FiveD period data:", period);
    //console.log(
    //   "🔍 Looking for FiveD timer:",
    //   selectedTimer,
    //   "period:",
    //   periodId
    // );
    //console.log("📊 Available FiveD periods:", monitorData.activePeriods);

    return period;
  };

  const currentPeriod = getCurrentPeriodData();
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
        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ mt: 1, p: 2 }}
        >
          Loading FiveD betting data... ({connectionStatus})
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
        {error}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Status: {connectionStatus} | Timer: {selectedTimer} | Period:{" "}
          {periodId}
        </Typography>
      </Alert>
    );
  }

  if (!currentPeriod) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
        No FiveD betting data available for the selected timer and period.
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
            <Users size={20} />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
              Active Users: {monitorData?.activeUsers || 0}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingUp size={20} />
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
            color={connectionStatus === "connected" ? "success" : "warning"}
            size="small"
            sx={{ fontSize: "0.75rem" }}
          />
        </Box>

        {/* Sections Grid */}
        <Box
          sx={{
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Grid container spacing={2}>
            {/* Sections A, B, C, D */}
            {sectionOptions.slice(0, 4).map((section) => (
              <Grid item xs={12} sm={6} md={3} key={section}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Section {section}
                  </Typography>

                  {/* Numbers Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberOptions.map((number) => {
                          const betAmount =
                            currentPeriod?.betAmounts[
                              `SECTION_${section}_${number}`
                            ] || 0;
                          const percentage = getBetPercentage(betAmount);

                          return (
                            <TableRow key={number}>
                              <TableCell>
                                <Chip
                                  label={number}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                                />
                              </TableCell>
                              <TableCell>
                                {betAmount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
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
                                        bgcolor: "primary.main",
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

                  {/* Size and Parity Options */}
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    {sizeOptions.map(({ value, color }) => {
                      const betAmount =
                        currentPeriod?.betAmounts[
                          `SECTION_${section}_${value}`
                        ] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                    {parityOptions.map(({ value, color }) => {
                      const betAmount =
                        currentPeriod?.betAmounts[
                          `SECTION_${section}_${value}`
                        ] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
            ))}

            {/* Section E and Sum side by side */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                }}
              >
                {/* Section E */}
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Section E
                  </Typography>

                  {/* Numbers Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {numberOptions.map((number) => {
                          const betAmount =
                            currentPeriod?.betAmounts[`SECTION_E_${number}`] ||
                            0;
                          const percentage = getBetPercentage(betAmount);

                          return (
                            <TableRow key={number}>
                              <TableCell>
                                <Chip
                                  label={number}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                                />
                              </TableCell>
                              <TableCell>
                                {betAmount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
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
                                        bgcolor: "primary.main",
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

                  {/* Size and Parity Options for Section E */}
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    {sizeOptions.map(({ value, color }) => {
                      const betAmount =
                        currentPeriod?.betAmounts[`SECTION_E_${value}`] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                    {parityOptions.map(({ value, color }) => {
                      const betAmount =
                        currentPeriod?.betAmounts[`SECTION_E_${value}`] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>

                {/* Sum Section */}
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Sum
                  </Typography>
                  <Grid container spacing={1}>
                    {/* Sum Special Options (SUM_SMALL, SUM_BIG, SUM_ODD, SUM_EVEN) */}
                    {sumSpecialOptions.map(({ value, label, color }) => {
                      const betAmount = currentPeriod?.betAmounts[value] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}

                    {/* Sum Range Options (0-22, 23-45) */}
                    {sumOptions.map(({ value, label, color }) => {
                      const betAmount = currentPeriod?.betAmounts[value] || 0;
                      const percentage = getTotalPercentage(betAmount);

                      return (
                        <Grid item xs={6} key={value}>
                          <Paper
                            sx={{
                              p: 1,
                              borderTop: `3px solid ${color}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {betAmount.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  bgcolor: theme.palette.grey[100],
                                  borderRadius: 1,
                                  mr: 1,
                                  height: 4,
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
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FiveDBettingMonitor;