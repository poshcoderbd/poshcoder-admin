import { AutoAwesomeMotion, MenuBook, PeopleAlt, ShoppingCart, Workspaces } from '@mui/icons-material'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import RecentOrder from './RecentOrder'
import RecentCustomer from './RecentCustomer'
import { Link } from 'react-router-dom'
import { axiosReq } from '../../utils/axiosReq'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthProvider'

const cardStyles = (bgColor, iconColor) => ({
  p: 3,
  bgcolor: bgColor,
  color: `${bgColor}.contrastText`,
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  minWidth: '250px',
  flex: 1,
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: '#fff',
  },
});

const typographyStyles = {
  title: {
    color: '#fff',
    variant: 'h6',
    fontWeight: 'bold',
  },
  number: {
    color: '#fff',
    variant: 'h4',
    fontWeight: 'bold',
  },
};

const Dashboard = () => {

  const { token } = useAuth()

  const { data: users } = useQuery({
    enabled: !!token,
    queryKey: ['users'],
    queryFn: () => axiosReq.get(`/auth/users`, { headers: { Authorization: token } }).then((res) => res.data)
  });
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => axiosReq.get(`/order/orders`, { headers: { Authorization: token } }).then((res) => res.data)
  });
  const { data: allTeams } = useQuery({
    queryKey: ['team'],
    queryFn: () => axiosReq.get('/team/allTeams').then(res => res.data)
  });
  const { data: allBlog } = useQuery({
    queryKey: ['blog'],
    queryFn: () => axiosReq.get('/blog/getAll').then(res => res.data)
  });

  const placedOrder = orders?.filter(item => item.status === 'placed')
  const confirmedOrder = orders?.filter(item => item.status === 'confirmed')
  const processingOrder = orders?.filter(item => item.status === 'processing')
  const deliveredOrder = orders?.filter(item => item.status === 'delivered')
  const cancelledOrder = orders?.filter(item => item.status === 'cancelled')

  return (
    <Box maxWidth='xl'>
      <Stack alignItems='flex-start' direction={{ xs: 'column', md: 'row' }} gap={4}>

        <Stack
          sx={{
            border: '1px solid lightgray',
            maxWidth: '500px',
            p: 3,
            borderRadius: '12px',
            width: '100%',
            bgcolor: '#f9f9f9',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          spacing={2}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
            }}
          >
            Order Summary
          </Typography>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'gray' }}>
              Total Orders:
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'gray' }}>
              {orders?.length}
            </Typography>
          </Stack>
          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1976d2' }}>
              Placed Orders:
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1976d2' }}>
              {placedOrder?.length}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#9c27b0' }}>
              Confirmed Orders:
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#9c27b0' }}>
              {confirmedOrder?.length}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#ff9800' }}>
              Processing Orders:
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#ff9800' }}>
              {processingOrder?.length}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#4caf50' }}>
              Delivered Orders:
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#4caf50' }}>
              {deliveredOrder?.length}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#f44336' }}>
              Cancelled Orders:
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#f44336' }}>
              {cancelledOrder?.length}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={4}>
          {/* Users Card */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={cardStyles('primary.light', 'primary.dark')}
          >
            <PeopleAlt />
            <Box>
              <Typography sx={typographyStyles.title}>Users</Typography>
              <Typography sx={typographyStyles.number}>{users?.length}</Typography>
            </Box>
          </Stack>

          {/* Teams Card */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={cardStyles('success.light', 'success.dark')}
          >
            <Workspaces />
            <Box>
              <Typography sx={typographyStyles.title}>Teams</Typography>
              <Typography sx={typographyStyles.number}>{allTeams?.length}</Typography>
            </Box>
          </Stack>

          {/* Blogs Card */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={cardStyles('warning.light', 'warning.dark')}
          >
            <MenuBook />
            <Box>
              <Typography sx={typographyStyles.title}>Blogs</Typography>
              <Typography sx={typographyStyles.number}>{allBlog?.length}</Typography>
            </Box>
          </Stack>
        </Stack>

      </Stack>


      <Stack mt={8} gap={6}>
        <Box sx={{
          flex: 5
        }}>
          <Stack direction={'row'} justifyContent={'space-between'} mb={3}>
            <Typography variant='h5' color={'gray'}>Recent Order</Typography>
            <Link to='/admin/orders'>
              <Button size='small' variant='contained'>View All</Button>
            </Link>
          </Stack>
          <RecentOrder />
        </Box>
        <Box sx={{
          flex: 1
        }}>
          <Stack direction={'row'} justifyContent={'space-between'} mb={3}>
            <Typography variant='h5' color={'gray'}>Recent Customers</Typography>
            <Link to='/admin/users'>
              <Button size='small' variant='contained'>View All</Button>
            </Link>
          </Stack>
          <RecentCustomer />
        </Box>
      </Stack>
    </Box>
  )
}

export default Dashboard
