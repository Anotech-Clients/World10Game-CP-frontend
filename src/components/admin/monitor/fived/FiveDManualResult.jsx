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
  SECTION_A: 'Section A',
  SECTION_B: 'Section B',
  SECTION_C: 'Section C',
  SECTION_D: 'Section D',
  SECTION_E: 'Section E',
  SUM: 'Sum'
};

const SIZE_TYPES = {
  BIG: 'Big',
  SMALL: 'Small'
};

const PARITY_TYPES = {
  ODD: 'Odd',
  EVEN: 'Even'
};

const FiveDManualResult = ({ selectedTimer, periodId }) => {
  const theme = useTheme();
  const { axiosInstance } = useAuth();
  const [sectionValues, setSectionValues] = useState({
    sectionA: '',
    sectionB: '',
    sectionC: '',
    sectionD: '',
    sectionE: ''
  });
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
    // Validate all section values are present and within range
    const sections = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE'];
    if (!sections.every(section => 
      sectionValues[section] !== '' && 
      !isNaN(sectionValues[section]) && 
      Number(sectionValues[section]) >= 0 && 
      Number(sectionValues[section]) <= 9 &&
      Number.isInteger(Number(sectionValues[section]))
    )) {
      return null;
    }

    // Convert to numbers
    const sectionNumbers = {
      sectionA: Number(sectionValues.sectionA),
      sectionB: Number(sectionValues.sectionB),
      sectionC: Number(sectionValues.sectionC),
      sectionD: Number(sectionValues.sectionD),
      sectionE: Number(sectionValues.sectionE)
    };
    
    // Calculate sum
    const sumSection = Object.values(sectionNumbers).reduce((sum, val) => sum + val, 0);
    
    // Determine size for each section (0-4: SMALL, 5-9: BIG)
    const sizes = {};
    for (const section of sections) {
      sizes[section] = sectionNumbers[section] >= 5 ? 'BIG' : 'SMALL';
    }
    
    // Determine size for sum (0-22: SMALL, 23-45: BIG)
    const sizeSum = sumSection >= 23 ? 'BIG' : 'SMALL';
    
    // Determine parity for each section
    const parities = {};
    for (const section of sections) {
      parities[section] = sectionNumbers[section] % 2 === 0 ? 'EVEN' : 'ODD';
    }
    
    // Determine parity for sum
    const paritySum = sumSection % 2 === 0 ? 'EVEN' : 'ODD';

    return {
      sectionNumbers,
      sumSection,
      sizes,
      sizeSum,
      parities,
      paritySum
    };
  }, [sectionValues]);

  const handleSectionValueChange = (section, value) => {
    // Only allow valid integers 0-9
    if (value === '' || 
        (Number.isInteger(Number(value)) && 
         Number(value) >= 0 && 
         Number(value) <= 9)
    ) {
      setSectionValues(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTimer || !periodId) {
      setError('Timer and period information not available');
      return;
    }

    if (!resultDetails) {
      setError('Please enter valid values (0-9) for all sections');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        timer: selectedTimer,
        periodId: periodId,
        sectionA: resultDetails.sectionNumbers.sectionA,
        sectionB: resultDetails.sectionNumbers.sectionB,
        sectionC: resultDetails.sectionNumbers.sectionC,
        sectionD: resultDetails.sectionNumbers.sectionD,
        sectionE: resultDetails.sectionNumbers.sectionE
      };

      await axiosInstance.post(`${domain}/api/master-game/fived/manual-result`, payload);
      setSuccess('Result successfully set');
      setSectionValues({
        sectionA: '',
        sectionB: '',
        sectionC: '',
        sectionD: '',
        sectionE: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set manual result');
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
            FiveD Manual Result Configuration
          </Typography>
        </Box>

        {(error || success) && (
          <Alert
            severity={error ? "error" : "success"}
            sx={{ borderRadius: 1, mb: 2 }}
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
                Section Values Input
              </Typography>
              
              <Grid container spacing={2}>
                {['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE'].map((section, index) => (
                  <Grid item xs={12} sm={4} md={2.4} key={section}>
                    <TextField
                      fullWidth
                      label={`Section ${section.toUpperCase()}`}
                      value={sectionValues[section]}
                      onChange={(e) => handleSectionValueChange(section, e.target.value)}
                      type="number"
                      inputProps={{ min: 0, max: 9 }}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Section Values */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Section Values
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(resultDetails.sectionNumbers).map(([section, value]) => (
                        <Chip
                          key={section}
                          label={`${section.charAt(section.length - 1)}: ${value}`}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Sum */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Sum: {resultDetails.sumSection}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Sum: ${SIZE_TYPES[resultDetails.sizeSum]}`}
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        label={`Sum: ${PARITY_TYPES[resultDetails.paritySum]}`}
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Sections Size */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Section Sizes
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(resultDetails.sizes).map(([section, size]) => (
                        <Chip
                          key={section}
                          label={`${section.charAt(section.length - 1)}: ${SIZE_TYPES[size]}`}
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Sections Parity */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Section Parities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(resultDetails.parities).map(([section, parity]) => (
                        <Chip
                          key={section}
                          label={`${section.charAt(section.length - 1)}: ${PARITY_TYPES[parity]}`}
                          sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
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
                  Enter section values (0-9) to see the preview
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FiveDManualResult;