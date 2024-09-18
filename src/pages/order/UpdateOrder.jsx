/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import CButton from '../../common/CButton';
import { Close } from '@mui/icons-material';
import { useAuth } from '../../context/AuthProvider';

const UpdateOrder = ({ data, closeDialog }) => {
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')

  const { token } = useAuth()

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/order/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['order']);
      closeDialog(true);
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.data)
    }
  });

  const handleUpdate = () => {
    if (status === 'placed') {
      return toast.error('Status Empty')
    }
    mutation.mutate({
      status,
      note
    });
  }

  useEffect(() => {
    setNote(data?.note ?? '')
    setStatus(data?.status)
  }, [data])


  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Update Order</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>
      <Typography mb={2}><b>Order ID: </b>{data?._id}</Typography>
      <Stack gap={2}>
        <Box sx={{ minWidth: { xs: 150, md: 200 } }}>
          <FormControl size='small' fullWidth>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={status}
              label="Order Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value={'confirmed'}>Confirmed</MenuItem>
              <MenuItem value={'processing'}>Processing</MenuItem>
              <MenuItem value={'delivered'}>Delivered</MenuItem>
              <MenuItem value={'cancelled'}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TextField value={note} onChange={e => setNote(e.target.value)} label='Note ' multiline rows={6} />
        <CButton isLoading={mutation.isPending} onClick={handleUpdate} variant='contained' fullwidth>Update Order</CButton>
      </Stack>
    </Box>
  )
}

export default UpdateOrder