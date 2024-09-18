import { ArrowBack } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <Box sx={{
                // width: {sm:'100px', md: '100%'}
            }}>
                <img style={{width: '100%'}} src="/404.gif" alt="" />
            </Box>
            <Typography variant='h4' color='gray' marginTop={5}>Page Not Found!</Typography>
            <Link to='admin/dashboard'>
                <Button startIcon={<ArrowBack />}>Go Back</Button>
            </Link>
        </Box>
    )
}

export default NotFound
