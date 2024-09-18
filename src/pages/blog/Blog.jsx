import React from 'react'
import { Box, Button, DialogActions, Divider, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import BlogCard from './BlogCard'
import CDialog from '../../common/dialog/CDialog'
import CreateBlog from './CreateBlog'
import { useQuery } from '@tanstack/react-query'
import { axiosReq } from '../../utils/axiosReq'
import LoadingBar from '../../common/loadingBar/LoadingBar'

const Blog = () => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const { isLoading, error, data: allBlog } = useQuery({
    queryKey: ['blog'],
    queryFn: () => axiosReq.get('/blog/getAll').then(res => res.data)
  });

  const handleDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleDialogClose = () => {
    setCreateDialogOpen(false);
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 4 }
    }}>
      <Typography variant='h5' mb={1} color='primary'>Blogs</Typography>
      <Divider sx={{ mb: 3 }} />
      <Button startIcon={<Add />} variant='contained' onClick={handleDialogOpen}>Create</Button>
      <CDialog openDialog={createDialogOpen}>
        <CreateBlog handleDialogClose={handleDialogClose}/>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </CDialog>
      <Stack direction={{xs: 'column', md: 'row'}} gap={2} flexWrap='wrap' sx={{ mt: 6 }}>
        {
          isLoading ? <LoadingBar/> : error ? 'Something went wrong!' : 
          allBlog.map((item)=> (
            <BlogCard key={item._id} item={item} />
          ))
        }
      </Stack>
    </Box>
  )
}

export default Blog