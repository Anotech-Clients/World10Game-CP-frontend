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

const RESULT_TYPES = {
  TOTAL_SUM: 'Total Sum',
  EVEN: 'Even',
  ODD: 'Odd',
  BIG: 'Big',
  SMALL: 'Small',
  TWO_SAME: 'Two Same',
  THREE_SAME: 'Three Same',
  ALL_DIFFERENT: 'All Different',
  CONSECUTIVE: 'Consecutive'
};

const K3ManualResult = ({ selectedTimer, periodId }) => {
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  const [diceValues, setDiceValues] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const resultDetails = useMemo(() => {
    // Validate all dice values are present and within range
    if (!diceValues.every(value => 
      value !== '' && 
      !isNaN(value) && 
      Number(value) >= 1 && 
      Number(value) <= 6 &&
      Number.isInteger(Number(value))
    )) {
      return null;
    }

    // Convert to numbers and calculate
    const diceNumbers = diceValues.map(Number);
    const sortedDice = [...diceNumbers].sort((a, b) => a - b);
    const totalSum = diceNumbers.reduce((sum, value) => sum + value, 0);
    
    // Calculate exact game outcomes
    const isEven = totalSum % 2 === 0;
    const isBig = totalSum > 10;
    
    // Count occurrences of each value
    const valueCount = {};
    diceNumbers.forEach(num => {
      valueCount[num] = (valueCount[num] || 0) + 1;
    });
    
    // Check for same numbers
    const hasTwoSame = Object.values(valueCount).some(count => count === 2);
    const hasThreeSame = Object.values(valueCount).some(count => count === 3);
    
    // Check for consecutive numbers (must be in order 1-2-3, 2-3-4, 3-4-5, or 4-5-6)
    const isConsecutive = (() => {
      const sorted = [...diceNumbers].sort((a, b) => a - b);
      return (
        sorted[0] + 1 === sorted[1] &&
        sorted[1] + 1 === sorted[2]
      );
    })();

    // Build result types array
    const resultTypes = [];
    
    // Add base results
    resultTypes.push(isEven ? 'EVEN' : 'ODD');
    resultTypes.push(isBig ? 'BIG' : 'SMALL');
    
    // Add combination results
    if (hasThreeSame) {
      resultTypes.push('THREE_SAME');
    } else if (hasTwoSame) {
      resultTypes.push('TWO_SAME');
    }
    
    if (isConsecutive) {
      resultTypes.push('CONSECUTIVE');
    }
    
    if (Object.keys(valueCount).length === 3) {
      resultTypes.push('ALL_DIFFERENT');
    }

    return {
      diceValues: diceNumbers,
      totalSum,
      isEven,
      isBig,
      hasTwoSame,
      hasThreeSame,
      isConsecutive,
      resultTypes,
      sortedValues: sortedDice
    };
  }, [diceValues]);

  const handleDiceValueChange = (index, value) => {
    // Only allow valid integers 1-6
    if (value === '' || 
        (Number.isInteger(Number(value)) && 
         Number(value) >= 1 && 
         Number(value) <= 6)
    ) {
      const newDiceValues = [...diceValues];
      newDiceValues[index] = value;
      setDiceValues(newDiceValues);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTimer || !periodId) {
      setError('Timer and period information not available');
      return;
    }

    if (!resultDetails) {
      setError('Please enter valid dice values (1-6)');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        timer: selectedTimer,
        periodId: periodId,
        diceValues: resultDetails.diceValues,
        manuallySet: true
      };

      await axiosInstance.post(`${domain}/api/master-game/k3/manual-result`, payload);
      setSuccess('Result successfully set');
      setDiceValues(['', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set manual result');
    } finally {
      setIsSubmitting(false);
    }
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
          <Casino sx={{ mr: 1, color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            K3 Manual Result Configuration
          </Typography>
        </Box>

        {(error || success) && (
            <Alert
              severity={error ? "error" : "success"}
              sx={{ borderRadius: 1 }}
            >
              {error || success}
            </Alert>
          )}

          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Dice Values Input
                </Typography>
                
                <Grid container spacing={2}>
                  {diceValues.map((value, index) => (
                    <Grid item xs={4} key={index}>
                      <TextField
                        fullWidth
                        label={`Dice ${index + 1}`}
                        value={value}
                        onChange={(e) => handleDiceValueChange(index, e.target.value)}
                        type="number"
                        inputProps={{ min: 1, max: 6 }}
                        sx={{
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
                          '& .MuiInputLabel-root': {
                            color: '#94a3b8',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            '&.Mui-focused': {
                              color: '#6366f1'
                            }
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !resultDetails}
                  fullWidth
                  sx={{
                    py: 1.5,
                    mt: 2,
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
            </Grid>

            <Grid item xs={12}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2.5, justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Dice Values
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {resultDetails.diceValues.map((value, index) => (
                          <Chip
                            key={index}
                            label={value}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Sum: {resultDetails.totalSum}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={resultDetails.isBig ? 'Big' : 'Small'}
                          sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            fontWeight: 500
                          }}
                        />
                        <Chip
                          label={resultDetails.isEven ? 'Even' : 'Odd'}
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Combinations
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {resultDetails.resultTypes
                          .filter(type => ['TWO_SAME', 'THREE_SAME', 'CONSECUTIVE', 'ALL_DIFFERENT'].includes(type))
                          .map((type) => (
                            <Chip
                              key={type}
                              label={RESULT_TYPES[type]}
                              sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                fontWeight: 500
                              }}
                            />
                          ))}
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 3 }}
                  >
                    Enter dice values (1-6) to see the preview
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
};

export default K3ManualResult;