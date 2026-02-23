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

const FiveDHistory = ({ selectedTimer, periodId, updateTrigger }) => {
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
                `${domain}/api/master-game/fived/history?page=${page}&limit=5&timerType=${selectedTimer}`
            );

            if (response.data.success) {
                setHistory(response.data.data.results);
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

    // Helper function to get color based on size
    const getSizeColor = (size) => {
        if (size === 'BIG') {
            return {
                bg: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main
            };
        } else {
            return {
                bg: alpha(theme.palette.grey[500], 0.1),
                color: theme.palette.grey[700]
            };
        }
    };

    // Helper function to get color based on parity
    const getParityColor = (parity) => {
        if (parity === 'ODD') {
            return {
                bg: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main
            };
        } else {
            return {
                bg: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main
            };
        }
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
                                        <TableCell sx={{ fontWeight: 600 }}>Section Values</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Sum</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Sum Size</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Sum Parity</TableCell>
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
                                                        <Chip
                                                            label={`A: ${item.sectionA}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`B: ${item.sectionB}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`C: ${item.sectionC}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`D: ${item.sectionD}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`E: ${item.sectionE}`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: theme.palette.primary.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.sumSection}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                                            color: theme.palette.info.main,
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.sizeSum}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getSizeColor(item.sizeSum).bg,
                                                            color: getSizeColor(item.sizeSum).color,
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.paritySum}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getParityColor(item.paritySum).bg,
                                                            color: getParityColor(item.paritySum).color,
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

export default FiveDHistory;