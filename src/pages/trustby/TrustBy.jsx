import React, { useState } from 'react'
import { Box, Button, DialogActions, Stack, TextField, Typography } from '@mui/material'
import { Add, Close, FileUpload } from '@mui/icons-material';
import CDialog from '../../common/dialog/CDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { deleteImage, uploadImage } from '../../utils/upload';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import { useAuth } from '../../context/AuthProvider';

const TrustBy = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [file, setFile] = useState('');
  const [deleteItemData, setDeleteItemData] = useState({})
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false)

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (input) => axiosReq.post('/trustby/create', input, { headers: { Authorization: token } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['trustby']);
      toast.success('Upload Success!')
      setOpenAddDialog(false)
      setFile('')
    },
    onError: () => toast.error('Something went wrong!')
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/trustby/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['trustby']);
      toast.success(res.data)
      setOpenDeleteDialog(false)
    },
    onError: (res) => {
      toast.error('Something went wrong!');
    }
  })

  const { isLoading, error, data: allImg } = useQuery({
    queryKey: ['trustby'],
    queryFn: () => axiosReq.get('/trustby/getAll').then(res => res.data)
  });

  const handleDelete = async () => {
    if (deleteItemData.imgId && deleteItemData._id) {
      setCloudinaryLoading(true)
      const res = await deleteImage(deleteItemData.imgId)
      setCloudinaryLoading(false)
      deleteMutation.mutate(deleteItemData._id)
      res && toast.success("Deleted from Cloudinary success!")
    }
  }

  const handleSubmit = async () => {
    try {
      if (file) {
        setCloudinaryLoading(true)
        const { public_id, secure_url } = await uploadImage(file);
        setCloudinaryLoading(false)
        if (public_id) {
          createMutation.mutate({ imgId: public_id, imgUrl: secure_url })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setFile('')
  };
  const handleDeleteDialogOpen = (item) => {
    setOpenDeleteDialog(true);
    setDeleteItemData(item)
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  return (
    <Box>
      <Button sx={{ mt: 3 }} onClick={handleAddDialogOpen} startIcon={<Add />} variant='contained'>Add</Button>
      <CDialog openDialog={openAddDialog}>
        <Stack gap={2} py={2}>
          <Stack direction='row' gap={2} alignItems='center'>
            <label style={{
              border: '1px solid lightgray',
              padding: '5px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'inline-flex',
              width: 'fit-content'
            }} htmlFor="upload-file"><FileUpload />Image</label>
            <Stack direction='row' gap={1}>{file && file.name}{file && <Close sx={{ cursor: 'pointer' }} onClick={() => setFile('')} />}</Stack>
          </Stack>
          <input required onChange={e => setFile(e.target.files[0])} type="file" name="" id="upload-file" accept='jpg,png' hidden />
        </Stack>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <CLoadingBtn loading={createMutation.isPending || cloudinaryLoading} handleClick={handleSubmit}>Upload</CLoadingBtn>
        </DialogActions>
      </CDialog>
      {/* tamplate */}
      <Stack mt={7} direction={{ xs: 'column', md: 'row' }} flexWrap='wrap' gap={6}>
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
        {
          isLoading ? <LoadingBar /> : error ? 'Something went wrong!' : (
            allImg.map((item) => (
              <Box key={item._id} sx={{
                width: '250px',
              }}>
                <Button onClick={() => handleDeleteDialogOpen(item)}>Remove</Button>
                <Box sx={{
                  width: '100%',
                  height: '200px'
                }}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={item.imgUrl} alt="" />
                </Box>
              </Box>
            )
            ))
        }
      </Stack>
    </Box>
  )
}

export default TrustBy
