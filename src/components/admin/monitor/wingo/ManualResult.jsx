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
            <Casino sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
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
              // mb: 3,
              bgcolor: alpha(theme.palette.background.default, 0.02),
              borderRadius: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
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
                  borderRadius: 1,
                  bgcolor: '#fff'
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
                py: 1,
                borderRadius: 1,
                textTransform: 'none',
                bgcolor: theme.palette.primary.main
              }}
            >
              Set Result
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.background.default, 0.02),
              borderRadius: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
              Result Preview
            </Typography>

            {resultDetails ? (
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between' , gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                color="text.secondary"
                sx={{ textAlign: 'center', py: 3 }}
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