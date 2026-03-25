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
        <Card sx={{
            height: '100%',
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
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <History sx={{ mr: 1, color: '#6366f1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
                        <TableContainer component={Paper} sx={{
                            maxHeight: 400,
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                            borderRadius: '12px',
                            '& .MuiTableCell-root': {
                                color: '#f8fafc',
                                borderColor: 'rgba(148, 163, 184, 0.12)',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            },
                            // Hide scrollbar but keep functionality
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            '-ms-overflow-style': 'none',
                            'scrollbar-width': 'none'
                        }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Period ID</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Dice Values</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Total Sum</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Odd/Even</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Big/Small</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Manual</TableCell>
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