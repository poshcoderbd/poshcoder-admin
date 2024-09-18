/* eslint-disable react/prop-types */
import React from 'react'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, DialogActions, Stack, TextField, Typography } from '@mui/material'

import { deleteImage, uploadImage } from '../../../utils/upload';
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';
import CDialog from '../../../common/dialog/CDialog';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import GraphicTemplateEdit from './GraphicTemplateEdit';
import { useAuth } from '../../../context/AuthProvider';


const GraphicTemplateSingle = ({ item }) => {
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false)
  const [deleteItemData, setDeleteItemData] = useState({})
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/graphictemplate/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['graphictemplate']);
      toast.success(res.data)
      setOpenDeleteDialog(false)
    },
    onError: (res) => {
      toast.error('Something went wrong!');
    }
  })
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleDeleteDialogOpen = (item) => {
    setOpenDeleteDialog(true);
    setDeleteItemData(item)
  };
  const handleDelete = async () => {
    if (deleteItemData.imgId && deleteItemData._id) {
      setCloudinaryLoading(true)
      await deleteImage(deleteItemData.imgId)
      setCloudinaryLoading(false)
      deleteMutation.mutate(deleteItemData._id)
    }
  };

  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

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
      {/* Edit Dialog */}
      <CDialog openDialog={openEditDialog}>
        <GraphicTemplateEdit item={item} handleEditDialogClose={handleEditDialogClose} />
      </CDialog>
      <Stack direction='row' gap={1}>
        <Button onClick={() => handleDeleteDialogOpen(item)}>Remove</Button>
        <Button onClick={handleEditDialogOpen}>Edit</Button>
      </Stack>
      <Box sx={{
        width: '100%',
        height: '350px'
      }}>
        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={item.imgUrl} alt="" />
      </Box>
      <Typography variant='h5' mt={1}>{item.name}</Typography>
      <Typography variant='body2'>{item.category}</Typography>
      <Typography>{item?.link}</Typography>
    </Box>
  )
}

export default GraphicTemplateSingle