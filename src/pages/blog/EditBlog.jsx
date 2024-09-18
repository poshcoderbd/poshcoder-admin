/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { Button, DialogActions, Stack, TextField } from '@mui/material';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../context/AuthProvider';


const EditBlog = ({ handleEditDialogClose, data }) => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('')
  const [errmsg, setErrmsg] = useState('')

  const { token } = useAuth()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/blog/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog']);
      handleEditDialogClose(true);
      toast.success('Update Success!');
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const handlePost = () => {
    mutation.mutate({ title, category, body });
  }

  useEffect(() => {
    setTitle(data.title)
    setCategory(data.category)
    setBody(data.body)
  }, [data])


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
      <TextField required onChange={e => setTitle(e.target.value)} value={title} id="standard-basic" variant="standard" label="Blog Title" size='small' />
      <TextField required onChange={e => setCategory(e.target.value)} value={category} id="standard-basic" variant="standard" label="Blog Category" size='small' />
      <div className="editor">
        <ReactQuill modules={toolbarOptions} theme="snow" placeholder="Descriptions*" value={body} onChange={setBody} required={true} />
      </div>
      <CLoadingBtn loading={mutation.isPending} handleClick={handlePost}>
        Update
      </CLoadingBtn>
      <p style={{ color: 'red' }}>{errmsg}</p>
      <DialogActions>
        <Button onClick={handleEditDialogClose}>Cancel</Button>
      </DialogActions>
    </Stack>
  )
}

export default EditBlog