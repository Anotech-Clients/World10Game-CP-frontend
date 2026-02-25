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
  LinearProgress,
  useTheme,
} from "@mui/material";
import { Users, TrendingUp } from "lucide-react";

/* -------------------- Constants -------------------- */

const numberOptions = [
  "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
  "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN",
  "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN"
];

const specialOptions = [
  { value: "ODD", color: "#22c55e" },
  { value: "EVEN", color: "#a855f7" },
  { value: "BIG", color: "#3b82f6" },
  { value: "SMALL", color: "#f97316" }
];

const combinationOptions = [
  { value: "TWO_SAME", label: "Two Same", color: "#ef4444" },
  { value: "THREE_SAME", label: "Three Same", color: "#ec4899" },
  { value: "ALL_DIFFERENT", label: "All Different", color: "#14b8a6" },
  { value: "CONSECUTIVE", label: "Consecutive", color: "#f59e0b" }
];

/* -------------------- Small UI Helper -------------------- */

const ProgressBar = ({ value, color = "primary.main" }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        flexGrow: 1,
        height: 6,
        mr: 1,
        bgcolor: "grey.100",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${value}%`,
          bgcolor: color,
          transition: "width .3s ease",
        }}
      />
    </Box>
    <Typography variant="caption">{value.toFixed(1)}%</Typography>
  </Box>
);

/* -------------------- Component -------------------- */

const K3BettingMonitor = ({ websocketUrl, selectedTimer, periodId }) => {
  const theme = useTheme();
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const pingRef = useRef(null);

  const [monitorData, setMonitorData] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------- WebSocket -------------------- */

  useEffect(() => {
    let attempts = 0;
    let mounted = true;

    const connect = () => {
      if (!mounted) return;

      if (wsRef.current) wsRef.current.close();

      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      const ws = new WebSocket(`${websocketUrl}?token=${token}`);
      wsRef.current = ws;
      setStatus("connecting");

      ws.onopen = () => {
        if (!mounted) return;
        attempts = 0;
        setStatus("connected");
        setLoading(false);
        setError(null);

        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);
      };

      ws.onmessage = ({ data }) => {
        try {
          const msg = JSON.parse(data);
          if (msg.type === "k3MonitorUpdate") {
            setMonitorData(msg.data);
          }
        } catch { }
      };

      ws.onerror = () => setStatus("error");

      ws.onclose = (e) => {
        if (!mounted) return;
        clearInterval(pingRef.current);
        setStatus("disconnected");

        if ([4001, 4002, 4003].includes(e.code)) {
          setError("Authorization error. Please login again.");
          return;
        }

        attempts++;
        const delay = Math.min(1000 * Math.pow(1.5, attempts), 30000);
        setError(`Reconnecting in ${Math.round(delay / 1000)}s...`);

        reconnectRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      mounted = false;
      clearTimeout(reconnectRef.current);
      clearInterval(pingRef.current);
      wsRef.current?.close();
    };
  }, [websocketUrl]);

  /* -------------------- Derived Data -------------------- */

  const currentPeriod = useMemo(() => {
    return monitorData?.activePeriods?.find((p) => {
      console.log("selectedTimer:", selectedTimer);
      console.log("periodId:", periodId);
      console.log("checking:", p.timerType, p.periodId);

      return (
        p.timerType === selectedTimer &&
        p.periodId === periodId
      );
    });
  }, [monitorData, selectedTimer, periodId]);

  const maxBetAmount = useMemo(() => {
    const values = Object.values(currentPeriod?.betAmounts || {});
    return values.length ? Math.max(...values) : 0;
  }, [currentPeriod]);

  const getPercent = (amount, total = maxBetAmount) =>
    total ? (amount / total) * 100 : 0;

  /* -------------------- States -------------------- */

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <LinearProgress />
        <Typography align="center" sx={{ p: 2 }}>
          Loading K3 data… ({status})
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!currentPeriod) {
    console.error("currentPeriod", currentPeriod)
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No data for selected period.
      </Alert>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <Card sx={{ mt: 2, borderRadius: 2 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Users size={18} />
            <Typography ml={1} fontWeight={600}>
              Active Users: {monitorData?.activeUsers || 0}
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUp size={14} />}
            label={`Total Bet: ${currentPeriod.totalBetAmount?.toLocaleString() || 0}`}
            color="primary"
          />
        </Box>

        <Chip
          size="small"
          label={`Status: ${status} | Period: ${periodId}`}
          color={status === "connected" ? "success" : "warning"}
          sx={{ mb: 2 }}
        />

        {/* Numbers Table */}
        <Paper sx={{ mb: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3} sx={{ bgcolor: "primary.main", color: "#fff" }}>
                    Numbers (3–18)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {numberOptions.map((n) => {
                  const amt = currentPeriod.betAmounts?.[n] || 0;
                  const pct = getPercent(amt);
                  return (
                    <TableRow key={n}>
                      <TableCell><Chip label={n} size="small" /></TableCell>
                      <TableCell>{amt.toLocaleString()}</TableCell>
                      <TableCell><ProgressBar value={pct} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Special + Combo */}
        {[specialOptions, combinationOptions].map((group, idx) => (
          <Grid container spacing={2} key={idx} mb={2}>
            {group.map(({ value, label = value, color }) => {
              const amt = currentPeriod.betAmounts?.[value] || 0;
              const pct = getPercent(amt, currentPeriod.totalBetAmount);
              return (
                <Grid item xs={12} sm={6} md={3} key={value}>
                  <Paper sx={{ p: 2, borderTop: `3px solid ${color}` }}>
                    <Typography fontWeight={600}>{label}</Typography>
                    <Typography variant="h6">{amt.toLocaleString()}</Typography>
                    <ProgressBar value={pct} color={color} />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
};

export default K3BettingMonitor;