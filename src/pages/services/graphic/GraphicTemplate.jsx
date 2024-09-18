import React, { useState } from 'react'
import { Box, Button, DialogActions, Stack, TextField } from '@mui/material'
import { Add, Close, FileUpload } from '@mui/icons-material';
import CDialog from '../../../common/dialog/CDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';
import { uploadImage } from '../../../utils/upload';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import LoadingBar from '../../../common/loadingBar/LoadingBar';
import GraphicTemplateSingle from './GraphicTemplateSingle';
import { useAuth } from '../../../context/AuthProvider';

const GraphicTemplate = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [input, setInput] = useState({})
  const [file, setFile] = useState('');
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false)

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (input) => axiosReq.post('/graphictemplate/create', input, { headers: { Authorization: token } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['graphictemplate']);
      toast.success('Upload Success!')
      setOpenAddDialog(false)
      setFile('')
      setInput({})
    },
    onError: () => toast.error('Something went wrong!')
  })


  const { isLoading, error, data: alltamplate } = useQuery({
    queryKey: ['graphictemplate'],
    queryFn: () => axiosReq.get('/graphictemplate/getall').then(res => res.data)
  });

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      if (!file || !input.name || !input.category) {
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

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setFile('')
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
          <TextField required onChange={handleInputChange} name='name' id="standard-basic" label="Name" variant="outlined" placeholder='e.g. Logo Design' size='small' />
          <TextField required onChange={handleInputChange} name='category' id="standard-basic" label="Category" placeholder='e.g. Branding' variant="outlined" size='small' />
        </Stack>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <CLoadingBtn loading={createMutation.isPending || cloudinaryLoading} handleClick={handleSubmit}>Upload</CLoadingBtn>
        </DialogActions>
      </CDialog>
      {/* tamplate */}
      <Stack mt={7} direction={{ xs: 'column', md: 'row' }} flexWrap='wrap' gap={6}>
        {
          isLoading ? <LoadingBar /> : error ? 'Something went wrong!' : (
            alltamplate.map((item) => (
              <GraphicTemplateSingle key={item._id} item={item} />
            )
            ))
        }
      </Stack>
    </Box>
  )
}

export default GraphicTemplate
