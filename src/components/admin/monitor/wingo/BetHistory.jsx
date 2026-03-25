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
    Grid,
    Paper,
    alpha,
    useTheme,
    Pagination,
    CircularProgress
} from '@mui/material';
import { History } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { domain } from "../../../../utils/Secret";

const COLOR_STYLES = {
    RED: '#ef4444',
    GREEN: '#22c55e',
    VIOLET: '#a855f7'
};

const BetHistory = ({ selectedTimer, periodId, updateTrigger }) => {
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
                `${domain}/api/master-game/wingo/history?timerType=${selectedTimer}&page=${page}&limit=5`
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
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Color</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Size</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>Manual</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.length > 0 ? (
                                        history.map((item) => (
                                            <TableRow key={item.periodId} sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: 'rgba(15, 23, 42, 0.3)' },
                                                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
                                            }}>
                                                <TableCell sx={{ color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>{item.periodId}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.numberOutcome}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                                            color: '#f8fafc',
                                                            fontWeight: 500,
                                                            fontFamily: 'Inter, system-ui, sans-serif'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        {item.colorOutcome.map((color, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={color}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: COLOR_STYLES[color],
                                                                    color: '#fff',
                                                                    fontWeight: 500,
                                                                    minWidth: '45px',
                                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.sizeOutcome}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: item.sizeOutcome === 'BIG'
                                                                ? 'rgba(34, 197, 94, 0.2)'
                                                                : 'rgba(251, 146, 60, 0.2)',
                                                            color: item.sizeOutcome === 'BIG' ? '#22c55e' : '#fb923c',
                                                            fontWeight: 500,
                                                            fontFamily: 'Inter, system-ui, sans-serif'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.manuallySet ? 'Yes' : 'No'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: item.manuallySet
                                                                ? 'rgba(34, 197, 94, 0.2)'
                                                                : 'rgba(239, 68, 68, 0.2)',
                                                            color: item.manuallySet ? '#22c55e' : '#ef4444',
                                                            fontWeight: 500,
                                                            fontFamily: 'Inter, system-ui, sans-serif'
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* <TableCell>{formatDateTime(item.createdAt)}</TableCell> */}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
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

export default BetHistory;