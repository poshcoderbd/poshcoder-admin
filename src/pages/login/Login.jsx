import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';

export default function Login() {
  const { setToken } = useAuth()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/admin/login', input),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['login']);
      setToken(res.data.jwt)
      toast.success(res.data.message)
    },
    onError: (err) => toast.error(err.response.data)
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    mutation.mutate({
      email: data.get('email'),
      password: data.get('password'),
    })
  };

  return (
    <Stack sx={{
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      px: 6
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px'
      }}
      >
        <Typography component="h1" variant="h5" color='gray'>
          Posh-Coder-Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <LoadingButton
            type='submit'
            loading={mutation.isPending}
            variant="contained"
            sx={{ width: '100%', mt: 1 }}
          >
            Login
          </LoadingButton>
        </Box>
      </Box>
    </Stack>
  );
}