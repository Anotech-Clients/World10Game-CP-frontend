import React, { useState } from "react";
import { Box, Grid, ThemeProvider, createTheme } from "@mui/material";
import TimerMonitor from "../../../../components/admin/TimerMonitor";
import CarRaceBettingMonitor from "../../../../components/admin/monitor/carrace/CarRaceBettingMonitor";
import CarRaceManualResult from "../../../../components/admin/monitor/carrace/CarRaceManualResult";
import CarRaceBetHistory from "../../../../components/admin/monitor/carrace/CarRaceBetHistory";
import { wssdomain, carRaceWssDomain } from "../../../../utils/Secret";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
  palette: {
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
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

const CAR_RACE_TIMER_OPTIONS = [
  { value: "30s", label: "30 Seconds" },
  { value: "1min", label: "1 Minute" },
  { value: "3min", label: "3 Minutes" },
  { value: "5min", label: "5 Minutes" },
  // { value: "10min", label: "10 Minutes" },
];

const CarRaceMonitor = () => {
  const [selectedTimer, setSelectedTimer] = useState(
    CAR_RACE_TIMER_OPTIONS[0].value
  );
  const [currentPeriodId, setCurrentPeriodId] = useState(null);
  // Add a force update flag for CarRaceBetHistory
  const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0);

  const handleTimerSelect = (timer) => {
    setSelectedTimer(timer);
    // Prevent stale periodId from previous timer type
    setCurrentPeriodId(null);
  };

  const handlePeriodUpdate = (periodId) => {
    if (periodId !== currentPeriodId) {
      setCurrentPeriodId(periodId);
      // Increment the counter to trigger a re-fetch in CarRaceBetHistory
      setHistoryUpdateTrigger((prev) => prev + 1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", p: 3 }}>
        <TimerMonitor
          title="🏎️ Car Race Timer"
          description="Select timer duration to monitor Car Race game:"
          timerOptions={CAR_RACE_TIMER_OPTIONS}
          websocketUrl={wssdomain}
          onTimerSelect={handleTimerSelect}
          onPeriodUpdate={handlePeriodUpdate}
        />

        {currentPeriodId && (
          <>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <CarRaceManualResult
                  selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                  periodId={currentPeriodId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CarRaceBetHistory
                  selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                  periodId={currentPeriodId}
                  updateTrigger={historyUpdateTrigger}
                />
              </Grid>
            </Grid>

            <CarRaceBettingMonitor
              websocketUrl={carRaceWssDomain}
              selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
              periodId={currentPeriodId}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CarRaceMonitor;
