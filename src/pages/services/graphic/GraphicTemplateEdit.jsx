/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { Box, Button, DialogActions, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Close, FileUpload } from '@mui/icons-material';
import { axiosReq } from '../../../utils/axiosReq';
import { deleteImage, uploadImage } from '../../../utils/upload';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../../context/AuthProvider';


const GraphicTemplateEdit = ({ handleEditDialogClose, item }) => {
  const [input, setInput] = useState({ name: '', category: '' })
  const [file, setFile] = useState(null);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [updatedImg, setUpdatedImg] = useState({
    public_id: '',
    secure_url: ''
  })

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: (i) => axiosReq.put(`/graphictemplate/edit/${item._id}`, i, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['graphictemplate']);
      toast.success('Updated!')
      handleEditDialogClose()
    },
    onError: (err) => {
      console.log(err)
      toast.error('Something went wrong!')
    }
  })
  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleImgRemove = async () => {
    const res = await deleteImage(updatedImg.public_id)
    res && toast.success("Image Removed!")
    setUpdatedImg({
      public_id: '',
      secure_url: ''
    })
    setFile(null)
  }

  const handleUpdate = async () => {
    if (updatedImg.secure_url !== '') {
      setCloudinaryLoading(true)
      await deleteImage(item.imgId)
      setCloudinaryLoading(false)
      editMutation.mutate({ imgId: updatedImg.public_id, imgUrl: updatedImg.secure_url, ...input })
    } else {
      editMutation.mutate({ ...input })
    }
  }

  const handleCancelbtnClick = async () => {
    handleEditDialogClose()
    if (updatedImg.secure_url !== '') {
      await deleteImage(updatedImg.public_id)
      setUpdatedImg({
        public_id: '',
        secure_url: ''
      })
      setFile(null)
    }
  }
  useEffect(() => {
    const upload = async () => {
      if (file) {
        setCloudinaryLoading(true)
        const { public_id, secure_url } = await uploadImage(file);
        secure_url && toast.success("Image Uploaded!")
        setUpdatedImg({
          public_id,
          secure_url
        })
        setCloudinaryLoading(false)
      }
    }
    upload()
  }, [file])

  useEffect(() => {
    setInput({ name: item.name, category: item.category });
  }, [item])

  return (
    <Box>
      <Stack gap={2} py={2}>
        <Stack direction='row' gap={2} alignItems='center'>
          <img style={{ width: '100px', height: '100px', objectFit: 'cover' }} src={updatedImg.secure_url ? updatedImg.secure_url : item.imgUrl} alt="" />
          <label style={{
            border: '1px solid lightgray',
            padding: '5px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'inline-flex',
            width: 'fit-content'
          }} htmlFor="upload-file"><FileUpload />Image</label>
          <Stack direction='row' gap={1}>{file && file.name}{file && <Close sx={{ cursor: 'pointer' }} onClick={handleImgRemove} />}</Stack>
        </Stack>
        <input required onChange={e => setFile(e.target.files[0])} type="file" name="" id="upload-file" accept='jpg,png' hidden />
        <TextField required onChange={handleInputChange} value={input.name} name='name' id="standard-basic" label="Name" size='small' />
        <TextField required onChange={handleInputChange} value={input.category} name='category' id="standard-basic" label="Category" variant="outlined" size='small' />
      </Stack>
      <DialogActions>
        <Button onClick={handleCancelbtnClick}>Cancel</Button>
        <CLoadingBtn loading={editMutation.isPending || cloudinaryLoading} handleClick={handleUpdate}>Update</CLoadingBtn>
      </DialogActions>
    </Box>
  )
}

export default GraphicTemplateEdit