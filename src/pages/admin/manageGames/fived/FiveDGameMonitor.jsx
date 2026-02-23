import React, { useState } from "react";
import { Box, Grid, ThemeProvider, createTheme } from "@mui/material";
import TimerMonitor from "../../../../components/admin/TimerMonitor";
import { wssdomain, fivedwssdomain } from "../../../../utils/Secret";
import FiveDManualResult from "../../../../components/admin/monitor/fived/FiveDManualResult.jsx";
import FiveDBettingMonitor from "../../../../components/admin/monitor/fived/FiveDBettingMonitor.jsx";
import FiveDHistory from "../../../../components/admin/monitor/fived/FiveDHistory.jsx";

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
    "1min": "ONE_MINUTE_TIMER",
    "3min": "THREE_MINUTE_TIMER",
    "5min": "FIVE_MINUTE_TIMER",
    "10min": "TEN_MINUTE_TIMER",
    "30min": "THIRTY_MINUTE_TIMER",
};

const FIVED_TIMER_OPTIONS = [
    { value: "1min", label: "1 Minute" },
    { value: "3min", label: "3 Minutes" },
    { value: "5min", label: "5 Minutes" },
    { value: "10min", label: "10 Minutes" },
    // { value: "30min", label: "30 Minutes" },
];

const FiveDGameMonitor = () => {
    const [selectedTimer, setSelectedTimer] = useState(FIVED_TIMER_OPTIONS[0].value);
    const [currentPeriodId, setCurrentPeriodId] = useState(null);
    // Add a force update flag for FiveDNetHistory
    const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0);

    const handleTimerSelect = (timer) => {
        setSelectedTimer(timer);
        // Prevent stale periodId from previous timer type
        setCurrentPeriodId(null);
    };

    const handlePeriodUpdate = (periodId) => {
        if (periodId !== currentPeriodId) {
            setCurrentPeriodId(periodId);
            // Increment the counter to trigger a re-fetch in FiveDNetHistory
            setHistoryUpdateTrigger(prev => prev + 1);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", p: 3 }}>
                <TimerMonitor
                    title="5D Timer"
                    description="Select timer duration to monitor:"
                    timerOptions={FIVED_TIMER_OPTIONS}
                    websocketUrl={wssdomain}
                    onTimerSelect={handleTimerSelect}
                    onPeriodUpdate={handlePeriodUpdate}
                />

                {currentPeriodId && (
                    <>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <FiveDManualResult
                                    selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                                    periodId={currentPeriodId}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FiveDHistory
                                    selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                                    periodId={currentPeriodId}
                                    updateTrigger={historyUpdateTrigger}
                                />
                            </Grid>
                        </Grid>

                        <FiveDBettingMonitor
                            websocketUrl={fivedwssdomain}
                            selectedTimer={TIMER_TYPE_MAPPING[selectedTimer]}
                            periodId={currentPeriodId}
                        />
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default FiveDGameMonitor;
