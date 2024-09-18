/* eslint-disable react/prop-types */
import { DeleteForever, DoneAll, Edit } from '@mui/icons-material'
import { Box, Button, DialogActions, IconButton, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import CDialog from '../../../common/dialog/CDialog';
import GraphicPackageEdit from './GraphicPackageEdit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosReq } from '../../../utils/axiosReq';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../../context/AuthProvider';

const GraphicPackage = ({ data }) => {
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const { token } = useAuth()

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/graphicpackage/delete/${id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['graphicpackage']);
      toast.success(res.data)
      setOpenDeleteDialog(false)
    },
    onError: () => toast.error('Something Went Wrong!')
  })

  const handleDelete = (id) => {
    mutation.mutate(id)
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

  return (
    <Stack sx={{
      textAlign: 'center',
      gap: 2
    }}>
      <Typography variant='h4' sx={{ fontSize: '30px' }}>{data.name}</Typography>
      <Typography variant='h5' sx={{ fontWeight: 300 }}>{data.price}</Typography>
      <Box>
        {
          data?.details?.map((d, i) => (
            <Stack key={i} direction='row' gap={2} mb={1}>
              <DoneAll sx={{ color: 'gray' }} />
              <Typography>{d}</Typography>
            </Stack>
          ))
        }
      </Box>
      <Stack direction={'row'} gap={2}>
        <Button size='small' onClick={handleEditDialogOpen} sx={{ flexGrow: 1 }} variant='outlined' startIcon={<Edit />}>Edit</Button>
        <Button onClick={handleDeleteDialogOpen} size='small' variant='contained'><DeleteForever /></Button>
      </Stack>
      {/* delete dialog */}
      <CDialog openDialog={openDeleteDialog} handleDialogClose={handleDeleteDialogClose}>
        <Typography variant='h5' color='gray' mb={2}>Confirm Delete?</Typography>
        <DialogActions>
          <CLoadingBtn loading={mutation.isPending} handleClick={() => handleDelete(data._id)}>
            ok
          </CLoadingBtn>
          <Button size='small' variant='outlined' onClick={handleDeleteDialogClose}>Cancel</Button>
        </DialogActions>
      </CDialog>
      {/* edit dialog  */}
      <CDialog openDialog={openEditDialog}>
        <GraphicPackageEdit data={data} handleDialogClose={handleEditDialogClose} />
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
        </DialogActions>
      </CDialog>
    </Stack>
  )
}

export default GraphicPackage
