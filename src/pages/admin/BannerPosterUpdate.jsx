// BannerPosterManagement.jsx (Main component to import both)
import React from 'react'
import { Box } from '@mui/material'
import BannerUpdate from '../../components/admin/banner-poster/BannerUpdate'
import PosterUpdate from '../../components/admin/banner-poster/PosterUpdate'


const BannerPosterUpdate = () => {
    return (
        <Box sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: '#F8FAFC',
            minHeight: '100vh'
        }}>
            <BannerUpdate />
            <PosterUpdate />
        </Box>
    )
}

export default BannerPosterUpdate