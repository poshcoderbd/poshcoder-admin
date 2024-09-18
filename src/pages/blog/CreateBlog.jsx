import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/upload';
import { Upload } from '@mui/icons-material';
import 'react-quill/dist/quill.snow.css';
import { Box, Stack, TextField } from '@mui/material';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../context/AuthProvider';


const CreateBlog = ({ handleDialogClose }) => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('')
  const [errmsg, setErrmsg] = useState('')

  const { token } = useAuth()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/blog/create', input, { headers: { Authorization: token } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog']);
      handleDialogClose(true);
      toast.success('Blog Created Successfully!');
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const handlePost = () => {
    mutation.mutate({ title, category, body: value });
  }

  const toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // Indentation options
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean'], // Remove formatting option
    ],
  };
  return (
    <Stack gap={1}>
      <TextField required onChange={e => setTitle(e.target.value)} id="standard-basic" variant="standard" label="Blog Title" size='small' />
      <TextField required onChange={e => setCategory(e.target.value)} id="standard-basic" variant="standard" label="Blog Category" size='small' />
      <div className="editor">
        <ReactQuill modules={toolbarOptions} theme="snow" placeholder="Descriptions*" value={value} onChange={setValue} required={true} />
      </div>
      <CLoadingBtn loading={mutation.isPending} handleClick={handlePost}>
        Post
      </CLoadingBtn>
      <p style={{ color: 'red' }}>{errmsg}</p>
    </Stack>
  )
}

export default CreateBlog