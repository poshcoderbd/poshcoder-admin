/* eslint-disable react/prop-types */
import { Box, Button, DialogActions, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import CDialog from '../../common/dialog/CDialog';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import { deleteImage } from '../../utils/upload';
import TeamEdit from './TeamEdit';
import { useAuth } from '../../context/AuthProvider';

const TeamSingle = ({ item }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false)

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/team/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['team']);
      toast.success(res.data)
      setOpenDeleteDialog(false)
    },
    onError: (res) => {
      toast.error('Something went wrong!');
    }
  })


  const handleDelete = async () => {
    if (item.imgId && item._id) {
      setCloudinaryLoading(true)
      await deleteImage(item.imgId)
      setCloudinaryLoading(false)
      deleteMutation.mutate(item._id)
    }
  }


  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  }
  return (
    <Box key={item._id} sx={{
      width: '250px',
    }}>
      {/* delete dialog */}
      <CDialog openDialog={openDeleteDialog} handleDialogClose={handleDeleteDialogClose}>
        <Typography variant='h5' color='gray' mb={2}>Confirm Delete?</Typography>
        <DialogActions>
          <CLoadingBtn loading={deleteMutation.isPending || cloudinaryLoading} handleClick={handleDelete}>
            Done
          </CLoadingBtn>
          <Button size='small' variant='outlined' onClick={handleDeleteDialogClose}>Cancel</Button>
        </DialogActions>
      </CDialog>
      {/* edit */}
      <CDialog openDialog={openEditDialog}>
        <TeamEdit handleEditDialogClose={handleEditDialogClose} item={item} />
      </CDialog>
      <Stack direction='row' >
        <Button size='small' onClick={() => handleDeleteDialogOpen(item)}>Remove</Button>
        <Button size='small' onClick={() => handleEditDialogOpen(item)}>Edit</Button>
      </Stack>
      <Box sx={{
        width: '100%',
        height: '300px'
      }}>
        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={item.imgUrl} alt="" />
      </Box>
      <Typography variant='h6'>{item.name}</Typography>
      <Typography variant='body2'>{item.title}</Typography>
    </Box>
  )
}

export default TeamSingle