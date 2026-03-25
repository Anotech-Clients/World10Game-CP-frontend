import React, { useState } from "react";
import { Box, Grid, ThemeProvider, createTheme } from "@mui/material";
import TimerMonitor from "../../../../components/admin/TimerMonitor";
import K3BettingMonitor from "../../../../components/admin/monitor/k3/K3BettingMonitor";
import K3ManualResult from "../../../../components/admin/monitor/k3/K3ManualResult";
import K3BetHistory from "../../../../components/admin/monitor/k3/K3BetHistory";
import { wssdomain, k3wssdomain } from "../../../../utils/Secret";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
  palette: {
    mode: 'dark',
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#8b5cf6",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
          backdropFilter: 'blur(24px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

const TIMER_TYPE_MAPPING = {
  "30s": "THIRTY_TIMER",
  "1min": "ONE_MINUTE_TIMER",
  "3min": "THREE_MINUTE_TIMER",
  "5min": "FIVE_MINUTE_TIMER",
  "10min": "TEN_MINUTE_TIMER",
};

const K3_TIMER_OPTIONS = [
//   { value: "30s", label: "30 Seconds" },
  { value: "1min", label: "1 Minute" },
  { value: "3min", label: "3 Minutes" },
  { value: "5min", label: "5 Minutes" },
  { value: "10min", label: "10 Minutes" },
];

const K3GameMonitor = () => {
  const [selectedTimer, setSelectedTimer] = useState(K3_TIMER_OPTIONS[0].value);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);
  // Add a force update flag for K3BetHistory
  const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0);

  const handleTimerSelect = (timer) => {
    setSelectedTimer(timer);
  };

  const handlePeriodUpdate = (periodId) => {
    if (periodId !== currentPeriodId) {
      setCurrentPeriodId(periodId);
      // Increment the counter to trigger a re-fetch in K3BetHistory
      setHistoryUpdateTrigger((prev) => prev + 1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: "100vh", 
        backgroundColor: "#0f172a", 
        p: 3,
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <TimerMonitor
          title="K3 Timer"
          description="Select timer duration to monitor K3 dice game:"
          timerOptions={K3_TIMER_OPTIONS}
          websocketUrl={wssdomain}
          onTimerSelect={handleTimerSelect}
          onPeriodUpdate={handlePeriodUpdate}
        />

        {currentPeriodId && (
          <>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <K3ManualResult
                  selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                  periodId={currentPeriodId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <K3BetHistory
                  selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                  periodId={currentPeriodId}
                  updateTrigger={historyUpdateTrigger}
                />
              </Grid>
            </Grid>

            <K3BettingMonitor
              websocketUrl={k3wssdomain}
              selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
              periodId={currentPeriodId}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default K3GameMonitor;
