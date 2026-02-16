import React from 'react'
import { Stack, CircularProgress, Typography } from '@mui/material';


const Loader = ({ message = 'Loading...' }) => {
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      sx={{ py: 4, gap: 2 }}
    >
        <CircularProgress
          size={50}
          sx={{ color: '#FF2625' }}
        />
        <Typography variant='body1' color='textSecondary'>
          {message}
        </Typography>
    </Stack>
  )
}

export default Loader