import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Alert,
  useTheme,
  alpha,
} from "@mui/material";
import { AccessTime, CheckCircle } from "@mui/icons-material";

const TimerMonitor = ({
  title,
  description,
  timerOptions,
  websocketUrl,
  onTimerSelect,
  onPeriodUpdate,
}) => {
  const theme = useTheme();
  const [timerData, setTimerData] = useState([]);
  const [selectedTimer, setSelectedTimer] = useState(timerOptions[0]?.value);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const selectedTimerRef = useRef(selectedTimer);
  const reconnectTimeoutRef = useRef(null);
  const isComponentMounted = useRef(true);
  const pingIntervalRef = useRef(null);

  useEffect(() => {
    selectedTimerRef.current = selectedTimer;
  }, [selectedTimer]);

  // Map selected timer value to timer type expected by server
  const getTimerType = useCallback((timerValue) => {
    const timerTypeMap = {
      "30s": "THIRTY_TIMER",
      "1min": "ONE_MINUTE_TIMER",
      "3min": "THREE_MINUTE_TIMER",
      "5min": "FIVE_MINUTE_TIMER",
      "10min": "TEN_MINUTE_TIMER",
    };
    return timerTypeMap[timerValue] || timerValue;
  }, []);

  // Memoize the WebSocket message handler
  const handleWebSocketMessage = useCallback(
    (event) => {
      if (!isComponentMounted.current) return;

      try {
        const data = JSON.parse(event.data);
        //console.log("🔍 Timer WS received data:", data);

        // Handle different message types from the unified WebSocket service
        if (data.type === "timerUpdate" && Array.isArray(data.data)) {
          setTimerData(data.data);
          setIsLoading(false);

          // Find the timer that matches the selected timer type
          const currentTimerType = getTimerType(selectedTimer);
          const currentTimer = data.data.find(
            (timer) => timer.timerType === currentTimerType,
          );

          if (currentTimer) {
            //console.log("✅ Found matching timer:", currentTimer);
            onPeriodUpdate?.(currentTimer.periodId);
          } else {
            console.error(
              "⚠️ No matching timer found for type:",
              currentTimerType,
            );
            console.error(
              "Available timers:",
              data.data.map((t) => t.timerType),
            );
          }
        }
        // Handle connection confirmation
        else if (data.status === "connected") {
          //console.log("✅ WebSocket connection confirmed:", data.message);
          setError(null);
          setIsLoading(false);
        }
        // Handle subscription confirmation
        else if (data.type === "subscribed") {
          //console.log("✅ Successfully subscribed to:", data.gameType);
          setError(null);
        }
        // Handle game updates that might contain timer information
        else if (data.type === "gameUpdate") {
          //console.log("🎮 Game update received:", data);
          // Process game updates if they contain timer data
          if (data.data && data.data.timers) {
            setTimerData(data.data.timers);
            setIsLoading(false);
          }
        } else {
          //console.log("📄 Other message type received:", data.type);
        }
      } catch (err) {
        console.error(
          "❌ Error processing WebSocket message:",
          err,
          event.data,
        );
        if (isComponentMounted.current) {
          setError("Error processing timer data: " + err.message);
        }
      }
    },
    [onPeriodUpdate, getTimerType],
  );

  // WebSocket connection setup with proper cleanup
  useEffect(() => {
    isComponentMounted.current = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    // const baseReconnectDelay = 1000;

    const connect = () => {
      if (!isComponentMounted.current) return;

      // 🛑 Prevent duplicate connections
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        //console.log("⚠️ WebSocket already connected, skipping...");
        return;
      }
      try {
        //console.log("🔌 Connecting to Timer WebSocket:", websocketUrl);
        const socket = new WebSocket(websocketUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isComponentMounted.current) {
            socket.close();
            return;
          }

          //console.log("✅ Timer WebSocket connected successfully");
          setIsLoading(false);
          setError(null);
          reconnectAttempts = 0;

          // 📡 Subscribe
          socket.send(
            JSON.stringify({
              type: "subscribe",
              gameType: "WINGO",
            }),
          );

          // ❤️ Start ping (stored in ref)
          pingIntervalRef.current = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);
        };

        socket.onmessage = handleWebSocketMessage;

        socket.onerror = (err) => {
          if (!isComponentMounted.current) return;
          console.error("❌ Timer WebSocket error:", err);
          setError("WebSocket connection error.");
        };

        socket.onclose = (event) => {
          if (!isComponentMounted.current) return;

          //console.log("🔌 Timer WebSocket closed:", event.code, event.reason);

          // 🧹 Clear ping
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
          }

          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000);
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttempts++;
              connect();
            }, delay);
          } else {
            setError("Failed to reconnect. Please refresh.");
          }
        };
      } catch (err) {
        console.error("❌ WebSocket init error:", err);
        setError("Failed to connect WebSocket.");
      }
    };

    connect();
    return () => {
      isComponentMounted.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [websocketUrl]);

  const handleTimerChange = useCallback(
    (e, value) => {
      if (value) {
        //console.log("⏱️ Selected timer changed to:", value);
        setSelectedTimer(value);
        onTimerSelect?.(value);
      }
    },
    [onTimerSelect],
  );

  const currentTimer = useMemo(() => {
    const timerType = getTimerType(selectedTimer);
    const timer = timerData.find((timer) => timer.timerType === timerType);
    //console.log("🎯 Current timer selected:", timer);
    return timer;
  }, [timerData, selectedTimer, getTimerType]);

  const progress = useMemo(
    () =>
      currentTimer
        ? ((currentTimer.totalTime - currentTimer.remainingTime) /
            currentTimer.totalTime) *
          100
        : 0,
    [currentTimer],
  );

  const getProgressColor = useCallback(
    (progress) => {
      if (progress >= 90) return theme.palette.error.main;
      if (progress >= 70) return theme.palette.warning.main;
      return theme.palette.primary.main;
    },
    [theme],
  );

  const timerLabels = {
    ONE_MINUTE_TIMER: "1 Min",
    THREE_MINUTE_TIMER: "3 Min",
    FIVE_MINUTE_TIMER: "5 Min",
    TEN_MINUTE_TIMER: "10 Min",
    THIRTY_TIMER: "30 Sec",
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Box sx={{ width: "100%" }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 1,
              "& .MuiAlert-icon": {
                color: theme.palette.error.main,
              },
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  color: theme.palette.text.primary,
                }}
              >
                {title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>

              <ToggleButtonGroup
                orientation="vertical"
                value={selectedTimer}
                exclusive
                onChange={handleTimerChange}
                sx={{
                  display: "flex",
                  width: "100%",
                  "& .MuiToggleButton-root": {
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1.75,
                    mb: 1,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                  },
                }}
              >
                {timerOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{
                      fontSize: "0.95rem",
                    }}
                  >
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AccessTime fontSize="small" />
                  Loading timer data...
                </Typography>
              </Box>
            ) : currentTimer ? (
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              mb: 0.5,
                              fontWeight: 600,
                              fontSize: { xs: "1.2rem", sm: "1.3rem" },
                              color: theme.palette.text.primary,
                            }}
                          >
                            Period {currentTimer.periodId}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 16 }} />
                            Active {timerLabels[currentTimer.timerType]} Timer
                          </Typography>
                        </Box>
                        <Chip
                          icon={<AccessTime />}
                          label={
                            currentTimer.remainingTimeFormatted ||
                            `${currentTimer.remainingTime}s`
                          }
                          sx={{
                            bgcolor: getProgressColor(progress),
                            color: "#fff",
                            fontSize: { xs: "1.1rem", sm: "1.2rem" },
                            fontWeight: 600,
                            height: "auto",
                            py: 1.25,
                            px: 2,
                            "& .MuiChip-icon": {
                              color: "inherit",
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography color="text.secondary">
                            Progress
                          </Typography>
                          <Typography
                            sx={{
                              color: getProgressColor(progress),
                              fontWeight: 600,
                            }}
                          >
                            {progress.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            "& .MuiLinearProgress-bar": {
                              bgcolor: getProgressColor(progress),
                              transition: "all 0.3s ease",
                            },
                          }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                              borderRadius: 1,
                              height: "100%",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                mb: 0.5,
                              }}
                            >
                              Start Time
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {currentTimer.startTime
                                ? new Date(
                                    currentTimer.startTime,
                                  ).toLocaleTimeString()
                                : "N/A"}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                              borderRadius: 1,
                              height: "100%",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                mb: 0.5,
                              }}
                            >
                              End Time
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {currentTimer.endTime
                                ? new Date(
                                    currentTimer.endTime,
                                  ).toLocaleTimeString()
                                : "N/A"}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  No timer data available for {getTimerType(selectedTimer)}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TimerMonitor;
