import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    alpha,
    useTheme,
    CircularProgress
} from '@mui/material';
import { CarRental } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { domain } from "../../../../utils/Secret";

const CarRaceBetHistory = ({ selectedTimer, periodId, updateTrigger }) => {
    const theme = useTheme();
    const { axiosInstance } = useAuth();
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHistory = async (page = 1) => {
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.get(
                `${domain}/api/master-game/car-race/history?page=${page}&limit=5&timerType=${selectedTimer}`
            );

            if (response.data.success) {
                setHistory(response.data.data.history);
                setPagination(response.data.data.pagination);
            } else {
                setError('Failed to fetch car race history data');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching car race history data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch history when the component mounts or when selected timer changes
    useEffect(() => {
        if (selectedTimer) {
            fetchHistory(1);
        }
    }, [selectedTimer]);

    // Add another useEffect to respond to period changes via the updateTrigger
    useEffect(() => {
        if (selectedTimer && updateTrigger > 0) {
            fetchHistory(1);
        }
    }, [updateTrigger, periodId]);

    const renderCarPlaceChip = (place) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Chip
                label={`Car ${place.carNumber}`}
                size="small"
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500
                }}
            />
            <Chip
                label={`${place.size} / ${place.parity}`}
                size="small"
                sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    fontWeight: 500
                }}
            />
        </Box>
    );

    return (
        <Card
            elevation={0}
            sx={{
                width: '100%',
                borderRadius: 1,
                bgcolor: '#fff',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CarRental sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Car Race History
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={40} />
                    </Box>
                ) : error ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderRadius: 1,
                            color: theme.palette.error.main
                        }}
                    >
                        {error}
                    </Paper>
                ) : (
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: 1,
                            mb: 2,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Period ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>First Place</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Second Place</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Third Place</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Manual</TableCell>
                                    {/* <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.periodId}</TableCell>
                                            <TableCell>{renderCarPlaceChip(item.firstPlace)}</TableCell>
                                            <TableCell>{renderCarPlaceChip(item.secondPlace)}</TableCell>
                                            <TableCell>{renderCarPlaceChip(item.thirdPlace)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.manuallySet ? 'Yes' : 'No'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: item.manuallySet
                                                            ? alpha(theme.palette.warning.main, 0.1)
                                                            : alpha(theme.palette.grey[500], 0.1),
                                                        color: item.manuallySet
                                                            ? theme.palette.warning.main
                                                            : theme.palette.grey[700],
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            {/* <TableCell>
                                                {new Date(item.createdAt).toLocaleString()}
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            No car race history data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default CarRaceBetHistory;