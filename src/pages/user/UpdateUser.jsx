/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import CButton from '../../common/CButton';
import { Close } from '@mui/icons-material';
import { useAuth } from '../../context/AuthProvider';

const UpdateUser = ({ data, closeDialog }) => {
  const [status, setStatus] = useState('')

  const { token } = useAuth()

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/auth/users/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['auth']);
      closeDialog(true);
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.data)
    }
  });

  const handleUpdate = () => {
    mutation.mutate({
      verified: status === 'verified' ? true : false
    });
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Update User</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>
      <Stack gap={2}>
        <Box sx={{ minWidth: { xs: 150, md: 200 } }}>
          <FormControl size='small' fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value={'verified'}>Verify</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <CButton isLoading={mutation.isPending} onClick={handleUpdate} variant='contained' fullwidth>Update</CButton>
      </Stack>
    </Box>
  )
}

export default UpdateUser