import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  Grid,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { Casino } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { domain } from "../../../../utils/Secret";

const NUMBER_WORDS = {
  "0": "ZERO", "1": "ONE", "2": "TWO", "3": "THREE", "4": "FOUR",
  "5": "FIVE", "6": "SIX", "7": "SEVEN", "8": "EIGHT", "9": "NINE"
};

const NUMBER_COLOR_MAP = {
  ZERO: ["VIOLET", "RED"],
  ONE: ["GREEN"],
  TWO: ["RED"],
  THREE: ["GREEN"],
  FOUR: ["RED"],
  FIVE: ["VIOLET", "GREEN"],
  SIX: ["RED"],
  SEVEN: ["GREEN"],
  EIGHT: ["RED"],
  NINE: ["GREEN"]
};

const SIZE_MAP = {
  ZERO: "SMALL", ONE: "SMALL", TWO: "SMALL", THREE: "SMALL", FOUR: "SMALL",
  FIVE: "BIG", SIX: "BIG", SEVEN: "BIG", EIGHT: "BIG", NINE: "BIG"
};

const COLOR_STYLES = {
  RED: '#ef4444',
  GREEN: '#22c55e',
  VIOLET: '#a855f7'
};

const ManualResult = ({ selectedTimer, periodId }) => {
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-hide success message after 1 second
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess('');
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const resultDetails = useMemo(() => {
    if (!number || isNaN(number) || number < 0 || number > 9) return null;
    
    const numberWord = NUMBER_WORDS[number];
    return {
      numberOutcome: numberWord,
      colorOutcome: NUMBER_COLOR_MAP[numberWord],
      sizeOutcome: SIZE_MAP[numberWord]
    };
  }, [number]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTimer || !periodId) {
      setError('Timer and period information not available');
      return;
    }

    if (!resultDetails) {
      setError('Please enter a valid number (0-9)');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        timer: selectedTimer,
        periodId: periodId,
        colorOutcome: resultDetails.colorOutcome,
        numberOutcome: resultDetails.numberOutcome,
        sizeOutcome: resultDetails.sizeOutcome,
        manuallySet: true
      };

      await axiosInstance.post(`${domain}/api/master-game/wingo/manual-result`, payload);
      setSuccess('Result successfully set');
      setNumber('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set manual result');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
            <Casino sx={{ mr: 1, color: '#6366f1' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Manual Result Configuration
            </Typography>
          </Box>

          {(error || success) && (
            <Alert
              severity={error ? "error" : "success"}
              sx={{ mb: 3, borderRadius: 1 }}
            >
              {error || success}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: '12px'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Input Settings
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Number Input (0-9)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              type="number"
              inputProps={{ min: 0, max: 9 }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  color: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.6)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1'
                  }
                },
                '& .MuiInputBase-input': {
                  color: '#f8fafc',
                  fontFamily: 'Inter, system-ui, sans-serif'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#94a3b8',
                  opacity: 1
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || !resultDetails}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #a855f7 100%)'
                },
                '&:disabled': {
                  background: 'rgba(148, 163, 184, 0.3)',
                  color: 'rgba(248, 250, 252, 0.5)'
                }
              }}
            >
              Set Result
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: '12px'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Result Preview
            </Typography>

            {resultDetails ? (
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between' , gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Number Outcome
                  </Typography>
                  <Chip
                    label={resultDetails.numberOutcome}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Color Outcome
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {resultDetails.colorOutcome.map((color) => (
                      <Chip
                        key={color}
                        label={color}
                        sx={{
                          bgcolor: COLOR_STYLES[color],
                          color: '#fff',
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Size Outcome
                  </Typography>
                  <Chip
                    label={resultDetails.sizeOutcome}
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 500
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', py: 3, color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Enter a number to see the preview
              </Typography>
            )}
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManualResult;