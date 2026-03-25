// PosterUpdate.jsx
import { Box, Button, CircularProgress, Fade, FormControl, Grid, InputLabel, MenuItem, Paper, Select, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
import { CloudUploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: '1rem auto',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
        margin: '2rem auto',
    },
}))

const posterTypes = [
    { value: 'realtimerebate', label: 'Real Time Rebate' },
    { value: 'winstreak', label: 'Winning Streak' },
    { value: 'luckydays', label: 'Lucky 10 Days' },
    // { value: 'refrealBonus', label: 'Referral Bonus' },
    { value: 'superjackpot', label: 'Super Jackpot' },
    { value: 'usdt', label: 'USDT' },
    { value: 'youtube', label: 'YouTube' }
]

const PosterUpdate = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [images, setImages] = useState({})
    const [imagePreviews, setImagePreviews] = useState({})
    const [selectedPosterType, setSelectedPosterType] = useState('usdt')
    const [loading, setLoading] = useState(false)
    const [successMessages, setSuccessMessages] = useState({})
    const [errors, setErrors] = useState({})

    const { axiosInstance } = useAuth()

    const handlePosterTypeChange = (e) => {
        setSelectedPosterType(e.target.value)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Update the images state
            setImages(prev => ({
                ...prev,
                [selectedPosterType]: file
            }))

            // Create and set the preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => ({
                    ...prev,
                    [selectedPosterType]: reader.result
                }))
            }
            reader.readAsDataURL(file)

            // Clear any existing error for this poster type
            if (errors[selectedPosterType]) {
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[selectedPosterType]
                    return newErrors
                })
            }
        }
    }

    const handlePosterSubmit = async (e) => {
        e.preventDefault()
        
        if (!images[selectedPosterType]) {
            setErrors(prev => ({
                ...prev,
                [selectedPosterType]: "Please select an image to upload"
            }))
            return
        }

        setLoading(true)

        // Get original file extension
        const image = images[selectedPosterType]
        // const extension = image.name.split('.').pop()
        // const newFileName = `${selectedPosterType}.${extension}`
        const newFileName = `${selectedPosterType}.jpg`

        // Create a new File object with the correct name and same content/type
        const renamedImage = new File([image], newFileName, {
            type: image.type,
            lastModified: image.lastModified,
        })

        const formData = new FormData()
        formData.append('file', renamedImage)

        try {
            const response = await axiosInstance.post('/api/banner-poster?type=POSTER', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // console.log(`${selectedPosterType} poster updated successfully:`, response.data)
            
            // Set success message
            setSuccessMessages(prev => ({
                ...prev,
                [selectedPosterType]: `${selectedPosterType} poster updated successfully!`
            }))
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessages(prev => {
                    const newMessages = { ...prev }
                    delete newMessages[selectedPosterType]
                    return newMessages
                })
            }, 3000)
            
        } catch (error) {
            console.error(`Error updating ${selectedPosterType} poster:`, error?.response?.data || error.message)
            setErrors(prev => ({
                ...prev,
                [selectedPosterType]: `Error updating ${selectedPosterType} poster: ${error?.response?.data?.message || error.message}`
            }))
        } finally {
            setLoading(false)
        }
    }

    return (
        <StyledPaper>
            <Typography
                variant="h5"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    color: '#1E293B',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    mb: 2
                }}>
                Update Posters
            </Typography>
            
            <Box
                component="form"
                onSubmit={handlePosterSubmit}
                sx={{
                    '& .MuiTextField-root': {
                        mb: 3,
                        transition: 'transform 0.2s',
                        '&:focus-within': {
                            transform: 'scale(1.01)',
                        }
                    }
                }}
            >
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="poster-type-label">Poster Type</InputLabel>
                    <Select
                        labelId="poster-type-label"
                        id="poster-type-select"
                        value={selectedPosterType}
                        label="Poster Type"
                        onChange={handlePosterTypeChange}
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(7, 18, 81, 0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(7, 18, 81, 0.3)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#071251',
                            }
                        }}
                    >
                        {posterTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} >
                        <Box
                            sx={{
                                mb: 3,
                                p: 4,
                                border: '2px dashed',
                                borderColor: errors[selectedPosterType] ? 'error.main' : 'divider',
                                borderRadius: 3,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: 'all 0.3s ease',
                                backgroundColor: 'rgba(7,18,81,0.02)',
                                '&:hover': {
                                    borderColor: errors[selectedPosterType] ? 'error.main' : "#071251",
                                    backgroundColor: 'rgba(7,18,81,0.04)',
                                    transform: 'scale(1.01)',
                                },
                                position: 'relative'
                            }}
                            onClick={() => document.getElementById("poster-upload").click()}
                        >
                            {loading && (
                                <Box 
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        zIndex: 2,
                                        borderRadius: 3,
                                    }}
                                >
                                    <CircularProgress
                                        size={40}
                                        thickness={4}
                                        sx={{
                                            color: "#071251",
                                            '& .MuiCircularProgress-circle': {
                                                strokeLinecap: 'round',
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                            
                            <input
                                id="poster-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                            <CloudUploadIcon
                                sx={{
                                    fontSize: 48,
                                    color: errors[selectedPosterType] ? "error.main" : "#071251",
                                    mb: 2,
                                    opacity: 0.8,
                                }}
                            />
                            <Typography
                                sx={{
                                    color: errors[selectedPosterType] ? "error.main" : "text.secondary",
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            >
                                Click to upload {posterTypes.find(p => p.value === selectedPosterType)?.label} poster
                            </Typography>
                            
                            {imagePreviews[selectedPosterType] && (
                                <Fade in={true} timeout={500}>
                                    <Box
                                        component="img"
                                        src={imagePreviews[selectedPosterType]}
                                        alt="Poster Preview"
                                        sx={{
                                            mt: 2,
                                            maxWidth: "200px",
                                            borderRadius: 2,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </Fade>
                            )}
                            
                            {errors[selectedPosterType] && (
                                <Typography 
                                    color="error" 
                                    sx={{ 
                                        mt: 2,
                                        fontSize: '0.75rem',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {errors[selectedPosterType]}
                                </Typography>
                            )}
                            
                            {successMessages[selectedPosterType] && (
                                <Typography 
                                    sx={{ 
                                        mt: 2,
                                        color: 'success.main',
                                        fontSize: '0.75rem',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {successMessages[selectedPosterType]}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={!images[selectedPosterType] || loading}
                    sx={{
                        bgcolor: "#071251",
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        py: 1.8,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            bgcolor: "#0a1a6a",
                            boxShadow: '0 4px 12px rgba(7,18,81,0.2)',
                            '&:before': {
                                transform: 'translateX(100%)',
                            }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.6s',
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'rgba(7,18,81,0.3)',
                        }
                    }}
                >
                    Update {posterTypes.find(p => p.value === selectedPosterType)?.label} Poster
                </Button>
            </Box>
        </StyledPaper>
    )
}

export default PosterUpdate