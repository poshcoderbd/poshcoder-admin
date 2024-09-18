import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosReq } from '../../utils/axiosReq';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorMsg from '../../common/ErrorMsg';
import DataTable from '../../common/dataTable/DataTable';
import useIsMobile from '../../hook/useIsMobile';
import { Call, EmailOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import SlideDrawer from '../../common/drawer/SlideDrawer';
import OrderDetails from '../order/OrderDetails';

const RecentOrder = () => {
  const [orderDetailsData, setOrderDetailsData] = useState({})
  const [openSlideDrawer, setOpenSlideDrawer] = useState(false);

  const toggleDrawer = (event, data) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOrderDetailsData(data)
    setOpenSlideDrawer(!openSlideDrawer);
  };

  const isMobile = useIsMobile()

  const { isLoading, error, data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => axiosReq.get(`/order/orders`).then((res) => res.data)
  });

  const columns = [
    {
      field: 'id', headerName: '', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography
            onClick={(event) => toggleDrawer(event, params.row)}
            sx={{ fontSize: { xs: '14px', md: '16px' }, color: '#6D369B', cursor: 'pointer' }}>
            #{params.row._id}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'User', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>User</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={2}>
            <Avatar src='' />
            <Stack>
              <Link to={`/admin/users/details/${row.userId}`}>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}> {row.user?.username}
                </Typography>
              </Link>
              <Typography sx={{ display: 'inline-flex', fontSize: '14px', gap: .5 }}> <EmailOutlined sx={{ fontSize: '18px', color: 'gray' }} /> {row.user?.email}</Typography>
              <Typography sx={{ display: 'inline-flex', fontSize: '14px', gap: .5 }}> <Call sx={{ fontSize: '18px', color: 'gray' }} /> {row.phone}</Typography>
            </Stack>
          </Stack>
        )
      }
    },
    {
      field: 'Date', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}> <b>{format(params.row.createdAt, 'dd-MM-yyyy')}</b>
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'Service', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Service</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            {params.row.orderName}
          </Typography>
        </Stack>
      )
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
              padding: '5px 12px',
              bgcolor: row.status === 'cancelled'
                ? 'red'
                : row.status === 'confirmed'
                  ? '#386FA8'
                  : row.status === 'delivered'
                    ? 'green'
                    : row.status === 'processing'
                      ? '#419BD2'
                      : 'purple',
              color: '#fff',
              borderRadius: '4px',
            }}>
              <Typography sx={{ fontWeight: 600, textAlign: 'center' }} variant='body2'>{row.status}</Typography>
            </Box>
            {row.status === 'placed' &&
              <Typography sx={{ color: 'green' }} variant='body2'>new</Typography>
            }
          </Stack>
        )
      }
    },

  ]

  return (
    <Box mt={3}>
      {/* order details page */}
      <SlideDrawer openSlideDrawer={openSlideDrawer} toggleDrawer={toggleDrawer}>
        <OrderDetails data={orderDetailsData} toggleDrawer={toggleDrawer} />
      </SlideDrawer>
      {
        error ? <ErrorMsg /> :
          <DataTable
            hideFooter
            loading={isLoading}
            getRowId={(row) => row._id}
            rowHeight={80}
            columns={columns}
            rows={orders?.slice(0, 8) || []}
          />
      }
    </Box>
  )
}

export default RecentOrder