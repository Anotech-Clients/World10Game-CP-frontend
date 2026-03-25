import React from 'react';
import { 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography,
    Box,
    Chip
} from '@mui/material';

export const GameStatsList = ({ gameStats }) => {
    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                mt: 3,
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="h6">
                    Game-wise Statistics
                </Typography>
            </Box>
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Game</TableCell>
                        <TableCell align="right">Total Bets</TableCell>
                        <TableCell align="right">Total Invested</TableCell>
                        <TableCell align="right">Total Won</TableCell>
                        <TableCell align="right">Win Rate</TableCell>
                        <TableCell align="right">Net P/L</TableCell>
                        <TableCell align="right">ROI</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gameStats.map((game) => (
                        <TableRow 
                            key={game.gameName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>
                                <Chip 
                                    label={game.gameName} 
                                    size="small"
                                    sx={{ 
                                        bgcolor: '#f1f5f9',
                                        fontWeight: 500
                                    }} 
                                />
                            </TableCell>
                            <TableCell align="right">{game.totalBets}</TableCell>
                            <TableCell align="right">pkr  {game.totalInvested.toFixed(2)}</TableCell>
                            <TableCell align="right">pkr  {game.totalWon.toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <Chip
                                    label={`${game.winRate.toFixed(2)}%`}
                                    size="small"
                                    sx={{
                                        bgcolor: game.winRate >= 50 ? '#dcfce7' : '#fee2e2',
                                        color: game.winRate >= 50 ? '#166534' : '#991b1b',
                                        fontWeight: 500
                                    }}
                                />
                            </TableCell>
                            <TableCell 
                                align="right"
                                sx={{
                                    color: game.netProfitLossAdmin >= 0 ? '#10b981' : '#ef4444',
                                    fontWeight: 500
                                }}
                            >
                                pkr {game.netProfitLossAdmin.toFixed(2)}
                            </TableCell>
                            <TableCell 
                                align="right"
                                sx={{
                                    color: game.roiAdmin >= 0 ? '#10b981' : '#ef4444',
                                    fontWeight: 500
                                }}
                            >
                                {game.roiAdmin.toFixed(2)}%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
