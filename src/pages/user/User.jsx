import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosReq } from '../../utils/axiosReq';
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Loader from '../../common/Loader';
import ErrorMsg from '../../common/ErrorMsg';
import DataTable from '../../common/dataTable/DataTable';
import useIsMobile from '../../hook/useIsMobile';
import { Call, DeleteOutline, EditOutlined, EmailOutlined, Error, Search } from '@mui/icons-material';
import CDialog from '../../common/dialog/CDialog';
import CButton from '../../common/CButton';
import UpdateUser from './UpdateUser';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';

const User = () => {
  const [userUpdateData, setUserUpdateData] = useState({})
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false)
  const [searchText, setSearchText] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const { token } = useAuth()

  const isMobile = useIsMobile()

  const queryClient = useQueryClient();

  const { isLoading, error, data: users } = useQuery({
    queryKey: ['users', statusFilter, searchText],
    queryFn: () => {
      let queryString = '';

      if (statusFilter && statusFilter !== 'all') {
        queryString += `?status=${statusFilter}`;
      }

      if (searchText) {
        queryString += queryString ? `&search=${searchText}` : `?search=${searchText}`;
      }

      return axiosReq.get(`/auth/users${queryString}`, { headers: { Authorization: token } }).then((res) => res.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/auth/users/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['auth']);
      toast.success(res.data.message)
      setDeleteDialogOpen(false)
    },
    onError: (res) => {
      toast.error('Something went wrong!');
    }
  })


  const handleDelete = async () => {
    if (deleteUserId) {
      deleteMutation.mutate(deleteUserId)
    }
  }

  function handleEdit(row) {
    setUpdateDialogOpen(true)
    setUserUpdateData(row)
  }

  function handleDeleteDialog(row) {
    setDeleteDialogOpen(true)
    setDeleteUserId(row._id)
  }

  const columns = [
    {
      field: 'Info', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Info</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={1}>
            <Avatar src='' />
            <Stack>
              <Link to={`/admin/users/details/${row._id}`}>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}>@{row.username}
                </Typography>
              </Link>
              <Typography sx={{ display: 'inline-flex', fontSize: '14px', gap: .5 }}> <EmailOutlined sx={{ fontSize: '18px', color: 'gray' }} /> {row.email}</Typography>
            </Stack>
          </Stack>
        )
      }
    },
    {
      field: 'Phone', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Phone</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ display: 'inline-flex', fontSize: '14px', gap: .5 }}> <Call sx={{ fontSize: '18px', color: 'gray' }} /> {params.row.phone}</Typography>
        </Stack>
      )
    },
    {
      field: 'Date', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Join Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography > {format(params.row.createdAt, 'dd-MM-yyyy')}
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'Order', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order</Typography>
      ),
      renderCell: (params) => {
        const placedOrder = params.row.orders.filter(item => item.status === 'placed')
        const deliveredOrder = params.row.orders.filter(item => item.status === 'delivered')
        const cancelledOrder = params.row.orders.filter(item => item.status === 'cancelled')
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            {/* <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'purple' }} >Placed: {placedOrder?.length} </Typography> */}
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'green' }} >Delivered: {deliveredOrder?.length} </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'red' }} >Cancelled: {cancelledOrder?.length} </Typography>
          </Stack>
        )
      }
    },

    {
      field: 'status', headerName: 'Status', width: 220,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: 5 }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} alignItems='center' direction='row' gap={.5}>
            <Box sx={{
              ml: 5,
              display: 'inline-flex',
              padding: '3px 12px',
              bgcolor: row.isVerified ? 'green' : 'darkgray',
              color: '#fff',
              borderRadius: '4px',
            }}>
              <Typography sx={{ textAlign: 'center' }} variant='body2'>{row.isVerified ? ' Verified' : 'Unverified'}</Typography>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'action', headerName: '',
      width: isMobile ? 200 : undefined,
      flex: isMobile ? undefined : 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Action</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack direction='row'>
            <IconButton
              disabled={params.row.status === 'cancelled' || params.row.status === 'delivered'}
              sx={{
                bgcolor: 'light.main',
                borderRadius: '5px',
                width: { xs: '30px', md: '40px' },
                height: { xs: '30px', md: '40px' },
              }} onClick={() => handleEdit(params.row)}>
              <EditOutlined fontSize='small' />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'light.main',
                borderRadius: '5px',
                width: { xs: '30px', md: '40px' },
                height: { xs: '30px', md: '40px' },
              }} onClick={() => handleDeleteDialog(params.row)}>
              <DeleteOutline fontSize='small' />
            </IconButton>
          </Stack>
        )
      },
    },
  ]

  return (
    <Box maxWidth='xl'>
      <Stack sx={{ mb: 2 }} direction='row' alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>All Users</Typography>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          bgcolor: 'light.main',
          borderRadius: '4px',
          color: 'primary.main',
          px: 1
        }}>({users?.length})</Typography>
      </Stack>
      <Stack direction='row' gap={2}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '300px',
          bgcolor: '#fff',
          width: '100%',
          height: 'fit-content',
          border: '1px solid lightgray',
          borderRadius: '4px',
          pl: 2
        }}>
          <Input onChange={(e) => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Username / Email' />
          <IconButton><Search /></IconButton>
        </Box>
      </Stack>
      {/* update Order */}
      <CDialog maxWidth='md' onClose={() => setUpdateDialogOpen(false)} openDialog={updateDialogOpen}>
        <UpdateUser data={userUpdateData} closeDialog={() => setUpdateDialogOpen(false)} />
      </CDialog>
      {/* delete Order */}
      <CDialog onClose={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <Error sx={{ color: 'red', fontSize: 50 }} />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Confirm Delete ?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete ? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <CButton onClick={() => setDeleteDialogOpen(false)} style={{ width: '100%' }} variant='outlined'>Cancel</CButton>
            <CButton isLoading={deleteMutation.isPending} onClick={handleDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={3}>
        {
          error ? <ErrorMsg /> :
            <DataTable
              loading={isLoading}
              getRowId={(row) => row._id}
              rowHeight={80}
              columns={columns}
              rows={users || []}
            />
        }
      </Box>
    </Box>
  )
}

export default User