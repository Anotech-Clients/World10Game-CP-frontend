import React, { useEffect, useMemo, useRef, useState } from "react";
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

/* -------------------- TIMER MAP -------------------- */
const TIMER_MAP = {
  ONE: "ONE_MINUTE_TIMER",
  THREE: "THREE_MINUTE_TIMER",
  FIVE: "FIVE_MINUTE_TIMER",
  TEN: "TEN_MINUTE_TIMER",
  THIRTY: "THIRTY_TIMER",
};

/* -------------------- PLACE CONFIG -------------------- */
const PLACES = [
  {
    title: "🥇 First Place (1-10)",
    bg: "#FFD70020",
    bar: "#DAA520",
    numbers: ["ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN"],
  },
  {
    title: "🥈 Second Place (1-10)",
    bg: "#C0C0C020",
    bar: "#999999",
    numbers: ["SECOND_ONE","SECOND_TWO","SECOND_THREE","SECOND_FOUR","SECOND_FIVE","SECOND_SIX","SECOND_SEVEN","SECOND_EIGHT","SECOND_NINE","SECOND_TEN"],
  },
  {
    title: "🥉 Third Place (1-10)",
    bg: "#CD7F3220",
    bar: "#CD7F32",
    numbers: ["THIRD_ONE","THIRD_TWO","THIRD_THREE","THIRD_FOUR","THIRD_FIVE","THIRD_SIX","THIRD_SEVEN","THIRD_EIGHT","THIRD_NINE","THIRD_TEN"],
  },
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

  /* -------------------- RENDER -------------------- */
  return (
    <Card sx={{ mt: 2, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            🏎️ Active Users: {monitorData?.activeUsers || 0}
          </Typography>
          <Chip
            label={`Total: ${currentPeriod.totalBetAmount.toLocaleString()}`}
            color="primary"
          />
        </Box>

        <Grid container spacing={2}>
          {PLACES.map((place) => (
            <Grid item xs={12} md={4} key={place.title}>
              <Paper sx={{ bgcolor: place.bg }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={3} sx={{ bgcolor: place.bar, color: "#fff" }}>
                          {place.title}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {place.numbers.map((key, idx) => {
                        const amount = timerBetAmounts[key] || 0;
                        const percent = getPercent(amount);

                        return (
                          <TableRow key={key}>
                            <TableCell>
                              <Chip label={idx + 1} size="small" />
                            </TableCell>
                            <TableCell>{amount.toLocaleString()}</TableCell>
                            <TableCell>
                              {percent > 0 && (
                                <Box
                                  sx={{
                                    height: 6,
                                    bgcolor: place.bar,
                                    width: `${percent}%`,
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CarRaceBettingMonitor;