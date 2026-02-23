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
    Pagination,
    CircularProgress
} from '@mui/material';
import { History } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { domain } from "../../../../utils/Secret";

const K3BetHistory = ({ selectedTimer, periodId, updateTrigger }) => {
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
                `${domain}/api/master-game/k3/history?timerType=${selectedTimer}&page=${page}&limit=5`
            );

            if (response.data.success) {
                setHistory(response.data.data.history);
                setPagination(response.data.data.pagination);
            } else {
                setError('Failed to fetch history data');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching history data');
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

    const handlePageChange = (event, value) => {
        fetchHistory(value);
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    };

    return (
        <Card
            elevation={0}
            sx={{
                width: '100%',
                borderRadius: 1,
                bgcolor: '#fff',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                // mt: 3
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <History sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Game History
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
                    <>
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                borderRadius: 1,
                                mb: 2,
                                overflow: 'auto', // Ensure the container can scroll
                                '&::-webkit-scrollbar': {
                                    display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, etc.)
                                },
                                scrollbarWidth: 'none', // Hide the scrollbar for Firefox
                                msOverflowStyle: 'none', // Hide the scrollbar for IE and Edge
                            }}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Period ID</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Dice Values</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Total Sum</TableCell>
                                        {/* <TableCell sx={{ fontWeight: 600 }}>Result Types</TableCell> */}
                                        <TableCell sx={{ fontWeight: 600 }}>Odd/Even</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Big/Small</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Manual</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.length > 0 ? (
                                        history.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.periodId}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {item.diceValues.map((value, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={value}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: theme.palette.primary.main,
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.totalSum}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                                            color: theme.palette.info.main,
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {item.resultTypes.map((type, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={type}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    color: theme.palette.success.main,
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </TableCell> */}
                                                <TableCell>
                                                    <Chip
                                                        label={item.isOdd ? 'Odd' : 'Even'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: item.isOdd
                                                                ? alpha(theme.palette.warning.main, 0.1)
                                                                : alpha(theme.palette.secondary.main, 0.1),
                                                            color: item.isOdd
                                                                ? theme.palette.warning.main
                                                                : theme.palette.secondary.main,
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.isBig ? 'Big' : 'Small'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: item.isBig
                                                                ? alpha(theme.palette.success.main, 0.1)
                                                                : alpha(theme.palette.grey[500], 0.1),
                                                            color: item.isBig
                                                                ? theme.palette.success.main
                                                                : theme.palette.grey[700],
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
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
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                No history data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* {pagination.totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                />
                            </Box>
                        )} */}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default K3BetHistory;