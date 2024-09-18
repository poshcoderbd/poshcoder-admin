/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Box, Button, DialogActions, Stack, TextField, Typography } from '@mui/material'
import { Close, FileUpload } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/upload';
import { useAuth } from '../../context/AuthProvider';

const TeamCreate = ({ handleAddDialogClose }) => {
  const [input, setInput] = useState({})
  const [file, setFile] = useState('');
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false)

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (input) => axiosReq.post('/team/add', input, { headers: { Authorization: token } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      toast.success('Upload Success!')
      handleAddDialogClose()
      setFile('')
      setInput({})
    },
    onError: (err) => {
      console.log(err)
      toast.error('Something went wrong!')
    }
  })

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }



  const handleSubmit = async () => {
    try {
      if (!file || !input.name || !input.title) {
        return;
      }
      setCloudinaryLoading(true)
      const { public_id, secure_url } = await uploadImage(file);
      setCloudinaryLoading(false)
      if (public_id) {
        createMutation.mutate({ imgId: public_id, imgUrl: secure_url, ...input })
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box>
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
        <TextField required onChange={handleInputChange} name='name' id="standard-basic" label="Team Name" size='small' />
        <TextField required onChange={handleInputChange} name='title' id="standard-basic" label="Title" variant="outlined" size='small' />
      </Stack>
      <DialogActions>
        <Button onClick={handleAddDialogClose}>Cancel</Button>
        <CLoadingBtn loading={createMutation.isPending || cloudinaryLoading} handleClick={handleSubmit}>Upload</CLoadingBtn>
      </DialogActions>
    </Box>
  )
}

export default TeamCreate