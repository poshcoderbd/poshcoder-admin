/* eslint-disable react/prop-types */
import { Person2 } from '@mui/icons-material'
import { Box, Button, DialogActions, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import CDialog from '../../common/dialog/CDialog';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import parse from 'html-react-parser';
import EditBlog from './EditBlog';
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';

const BlogCard = ({ item }) => {
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/blog/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['blog']);
      toast.success(res.data)
      setOpenDeleteDialog(false)
    },
    onError: () => toast.error('Something Went Wrong!')
  })

  const handleDelete = () => {
    mutation.mutate(item._id)
  }

  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true)
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false)
  }
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <Stack gap={1.5} sx={{
      width: '350px',
    }}>
      <CDialog openDialog={openDeleteDialog} handleDialogClose={handleDeleteDialogClose}>
        <Typography variant='h5' color='gray' mb={2}>Confirm Delete?</Typography>
        <DialogActions>
          <CLoadingBtn loading={mutation.isPending} handleClick={handleDelete}>
            Done
          </CLoadingBtn>
          <Button size='small' variant='outlined' onClick={handleDeleteDialogClose}>Cancel</Button>
        </DialogActions>
      </CDialog>
      {/* edit */}
      <CDialog openDialog={openEditDialog}>
        <EditBlog data={item} handleEditDialogClose={handleEditDialogClose} />
      </CDialog>
      <Stack direction='row'>
        <Button size='small' onClick={() => handleDeleteDialogOpen(item)}>Remove</Button>
        <Button size='small' onClick={() => handleEditDialogOpen(item)}>Edit</Button>
      </Stack>
      <Stack justifyContent='space-between' sx={{
        width: '300px',
        borderRadius: '5px',
        bgcolor: '#F8F8F8',
        p: 2
      }}>
        <Typography variant='h5' sx={{ fontSize: '22px' }}>{item.title}</Typography>
        <Typography sx={{ fontSize: '13px' }}>{parse(item.body.substring(0, 200))}</Typography>
        <Stack justifyContent='space-between' direction='row' gap={2}>
          <Typography sx={{
            fontSize: '12px',
            bgcolor: 'lightgray',
            p: '3px 10px',
            borderRadius: '5px'
          }}>{item.category}</Typography>
          <Typography>{formattedDate}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default BlogCard