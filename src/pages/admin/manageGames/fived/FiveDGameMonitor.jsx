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
            <Box sx={{ 
                minHeight: "100vh", 
                backgroundColor: "#0f172a", 
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            }}>
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