import React, { useState, useMemo, useEffect } from 'react'
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
} from '@mui/material'
import { DirectionsCar } from '@mui/icons-material'
import { useAuth } from '../../../../context/AuthContext'
import { domain } from "../../../../utils/Secret"

// Constants for car race game
const SIZE_MAP = {
  1: "Small", 2: "Small", 3: "Small", 4: "Small", 5: "Small",
  6: "Big", 7: "Big", 8: "Big", 9: "Big", 10: "Big"
}

const PARITY_MAP = {
  1: "Odd", 2: "Even", 3: "Odd", 4: "Even", 5: "Odd",
  6: "Even", 7: "Odd", 8: "Even", 9: "Odd", 10: "Even"
}

const COLOR_STYLES = {
  Small: '#22c55e',
  Big: '#ef4444',
  Odd: '#a855f7',
  Even: '#3b82f6'
}

const CarRaceManualResult = ({ selectedTimer, periodId }) => {
  const theme = useTheme()
  const { axiosInstance } = useAuth()
  const [firstPlace, setFirstPlace] = useState('')
  const [secondPlace, setSecondPlace] = useState('')
  const [thirdPlace, setThirdPlace] = useState('')

  const hasDuplicates = new Set([firstPlace, secondPlace, thirdPlace].filter(Boolean)).size < [firstPlace, secondPlace, thirdPlace].filter(Boolean).length

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-hide success message after 1 second
  useEffect(() => {
    let timer
    if (success) {
      timer = setTimeout(() => {
        setSuccess('')
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [success])

  const validateCarNumber = (number) => {
    return !isNaN(number) && number >= 1 && number <= 10
  }

  const resultDetails = useMemo(() => {
    if (
      !validateCarNumber(firstPlace) ||
      !validateCarNumber(secondPlace) ||
      !validateCarNumber(thirdPlace) ||
      hasDuplicates
    ) {
      return null
    }

    return {
      firstPlace: {
        carNumber: parseInt(firstPlace),
        size: SIZE_MAP[firstPlace],
        parity: PARITY_MAP[firstPlace]
      },
      secondPlace: {
        carNumber: parseInt(secondPlace),
        size: SIZE_MAP[secondPlace],
        parity: PARITY_MAP[secondPlace]
      },
      thirdPlace: {
        carNumber: parseInt(thirdPlace),
        size: SIZE_MAP[thirdPlace],
        parity: PARITY_MAP[thirdPlace]
      }
    }
  }, [firstPlace, secondPlace, thirdPlace, hasDuplicates])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedTimer || !periodId) {
      setError('Timer and period information not available')
      return
    }

    if (!resultDetails) {
      setError('Please enter valid car numbers (1-10) for all positions')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        timerName: selectedTimer,
        periodId: periodId,
        firstPlace: resultDetails.firstPlace.carNumber,
        secondPlace: resultDetails.secondPlace.carNumber,
        thirdPlace: resultDetails.thirdPlace.carNumber,
        manuallySet: true
      }

      await axiosInstance.post(`${domain}/api/master-game/car-race/manual-result`, payload)
      setSuccess('Result successfully set')
      setFirstPlace('')
      setSecondPlace('')
      setThirdPlace('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set manual result')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPositionCard = (title, carNumber, positionDetails) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: alpha(theme.palette.background.default, 0.02),
        borderRadius: 1,
        mb: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
        {title}
      </Typography>

      {positionDetails ? (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`Car ${positionDetails.carNumber}`}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          />
          <Chip
            label={positionDetails.size}
            sx={{
              bgcolor: COLOR_STYLES[positionDetails.size],
              color: '#fff',
              fontWeight: 500
            }}
          />
          <Chip
            label={positionDetails.parity}
            sx={{
              bgcolor: COLOR_STYLES[positionDetails.parity],
              color: '#fff',
              fontWeight: 500
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Enter car number to see details
        </Typography>
      )}
    </Paper>
  )

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
          <DirectionsCar sx={{ mr: 1, color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            🏎️ Car Race Manual Result Configuration
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
            mb: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px'
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            Input Settings
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="First Place (1-10)"
                value={firstPlace}
                onChange={(e) => setFirstPlace(e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 10 }}
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Second Place (1-10)"
                value={secondPlace}
                onChange={(e) => setSecondPlace(e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 10 }}
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Third Place (1-10)"
                value={thirdPlace}
                onChange={(e) => setThirdPlace(e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 10 }}
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
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !resultDetails || hasDuplicates}
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
            <Box>
              {renderPositionCard("First Place", firstPlace, resultDetails.firstPlace)}
              {renderPositionCard("Second Place", secondPlace, resultDetails.secondPlace)}
              {renderPositionCard("Third Place", thirdPlace, resultDetails.thirdPlace)}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 3 }}
            >
              Enter car numbers for all positions to see the preview
            </Typography>
          )}
        </Paper>
      </CardContent>
    </Card>
  )
}

export default CarRaceManualResult