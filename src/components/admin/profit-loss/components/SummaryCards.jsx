import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Casino,
  BarChart,
  AccountBalance
} from '@mui/icons-material';

export const SummaryCards = ({ summary }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(24px)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Casino sx={{ color: '#6366f1', mr: 1 }} />
              <Typography sx={{ color: '#94a3b8' }} variant="body2">
                Total Bets
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#6366f1' }}>
              {summary.totalBets}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`Wins: ${summary.totalWins}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#34d399',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              />
              <Chip
                label={`Losses: ${summary.totalLoss}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  fontWeight: 600,
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(24px)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney sx={{ color: '#6366f1', mr: 1 }} />
              <Typography sx={{ color: '#94a3b8' }} variant="body2">
                Total Invested
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#6366f1' }}>
              ₹  {summary.totalInvested.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Avg Bet: ₹  {summary.averageBetAmount.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(24px)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChart sx={{ color: summary.winRate >= 50 ? '#10b981' : '#f59e0b', mr: 1 }} />
              <Typography sx={{ color: '#94a3b8' }} variant="body2">
                Win Rate
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: summary.winRate >= 50 ? '#10b981' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {summary.winRate.toFixed(2)}%
              {summary.winRate >= 50 ?
                <TrendingUp fontSize="small" /> :
                <TrendingDown fontSize="small" />
              }
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Loss Rate: {summary.lossRate.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(24px)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ color: summary.netProfitLossAdmin >= 0 ? '#10b981' : '#ef4444', mr: 1 }} />
              <Typography sx={{ color: '#94a3b8' }} variant="body2">
                Net P/L (Admin)
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: summary.netProfitLossAdmin >= 0 ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              ₹ {summary.netProfitLossAdmin.toFixed(2)}
              {summary.netProfitLossAdmin >= 0 ?
                <TrendingUp fontSize="small" /> :
                <TrendingDown fontSize="small" />
              }
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={`ROI: ${summary.roiAdmin.toFixed(2)}%`}
                size="small"
                sx={{
                  bgcolor: summary.roiAdmin >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: summary.roiAdmin >= 0 ? '#34d399' : '#f87171',
                  fontWeight: 600,
                  border: summary.roiAdmin >= 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;