import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from '../../utils/axiosReq';
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Paper, Stack, Divider, IconButton, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthProvider';
import Loader from '../../common/Loader';
import ErrorMsg from '../../common/ErrorMsg';

const UserDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const { token } = useAuth()

  // Fetch user details
  const { isLoading: userLoading, error: userError, data: userData } = useQuery({
    queryKey: ['userDetails', id],
    queryFn: () => axiosReq.get(`/auth/user/${id}`, { headers: { Authorization: token } }).then(res => res.data)
  });

  return (
    <Box maxWidth='xl'>
      <IconButton sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      {/* User Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Details
          </Typography>
          {
            (!userData && !userLoading) &&
            <Chip color='warning' variant='outlined' label='User_Deleted' />
          }
          <Typography variant="body1"><strong>Username:</strong> {userData?.username}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {userData?.email}</Typography>
          <Typography variant="body1"><strong>Verified:</strong> {userData?.isVerified ? 'Yes' : 'No'}</Typography>
          <Typography variant="body2" color="textSecondary"><strong>Joined:</strong> {new Date(userData?.createdAt).toLocaleDateString()}</Typography>
        </CardContent>
      </Card>

      {/* User Orders */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {userData?.userOrders?.length === 0 ?
            <Typography variant='body2' sx={{ p: 4, color: 'gray' }}>No Order Found.</Typography> :
            userLoading ? <Loader /> :
              userError ? <ErrorMsg /> :
                userData?.userOrders?.map((order) => (
                  <Grid item xs={12} md={6} key={order._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{order.orderName}</Typography>
                        <Stack direction='row' my={1} gap={1}>
                          <Typography>Status: </Typography>
                          <Box sx={{
                            display: 'inline-flex',
                            padding: '2px 12px',
                            bgcolor: order.status === 'cancelled'
                              ? 'red'
                              : order.status === 'confirmed'
                                ? '#386FA8'
                                : order.status === 'delivered'
                                  ? 'green'
                                  : order.status === 'processing'
                                    ? '#419BD2'
                                    : 'purple',
                            color: '#fff',
                            borderRadius: '4px',
                          }}>
                            <Typography sx={{ fontWeight: 600, textAlign: 'center' }} variant='body2'>{order.status}</Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body2"><strong>Name:</strong> {order.name}</Typography>
                        <Typography variant="body2"><strong>Phone:</strong> {order.phone}</Typography>
                        <Typography variant="body2"><strong>Description:</strong> {order.desc}</Typography>
                        {order.note && (
                          <Typography variant="body2" color="textSecondary"><strong>AdminNote:</strong> {order.note}</Typography>
                        )}
                        <Typography variant="caption" color="textSecondary"><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserDetails;
