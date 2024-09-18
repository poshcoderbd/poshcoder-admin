import React from 'react'
import useIsMobile from '../../hook/useIsMobile';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import { axiosReq } from '../../utils/axiosReq';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Call, EmailOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import ErrorMsg from '../../common/ErrorMsg';
import DataTable from '../../common/dataTable/DataTable';

const RecentCustomer = () => {
  const isMobile = useIsMobile()


  const { isLoading, error, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => axiosReq.get(`/auth/users`).then((res) => res.data)
  });

  const columns = [
    {
      field: 'Info', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Info</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={2}>
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
      field: 'Date', width: 150,
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
      field: 'status', headerName: 'Status',
      width: isMobile ? 200 : undefined,
      flex: isMobile ? undefined : 1,
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

  ]

  return (
    <Box mt={3}>
      {
        error ? <ErrorMsg /> :
          <DataTable
            hideFooter
            loading={isLoading}
            getRowId={(row) => row._id}
            rowHeight={80}
            columns={columns}
            rows={users?.slice(0, 8) || []}
          />
      }
    </Box>
  )
}

export default RecentCustomer