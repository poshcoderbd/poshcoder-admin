import React from 'react'
import { Box, Stack, useTheme } from '@mui/material';

const PackageCard = ({ children }) => {
    const theme = useTheme();
   
    return (
        <Box sx={{
            width: '300px',
            height: 'fit-content',
            borderRadius: '5px',
            p: 4,
            boxShadow: theme.shadow,
        }}>
            {children}
        </Box>
    )
}

export default PackageCard