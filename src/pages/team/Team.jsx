import React, { useState } from 'react'
import { Box, Button, DialogActions, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material';
import CDialog from '../../common/dialog/CDialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import toast from 'react-hot-toast';
import { deleteImage } from '../../utils/upload';
import CLoadingBtn from '../../common/loadingButton/CLoadingBtn';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import TeamCreate from './TeamCreate';
import TeamEdit from './TeamEdit';
import TeamSingle from './TeamSingle';

const Team = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const { isLoading, error, data: allteam } = useQuery({
    queryKey: ['team'],
    queryFn: () => axiosReq.get('/team/allTeams').then(res => res.data)
  });

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };
  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  return (
    <Box>
      <Button sx={{ mt: 3 }} onClick={handleAddDialogOpen} startIcon={<Add />} variant='contained'>Add</Button>
      <CDialog openDialog={openAddDialog}>
        <TeamCreate handleAddDialogClose={handleAddDialogClose} />
      </CDialog>
      {/* tamplate */}
      <Stack mt={7} direction={{ xs: 'column', md: 'row' }} flexWrap='wrap' gap={6}>
        {
          isLoading ? <LoadingBar /> : error ? 'Something went wrong!' : (
            allteam.map((item) => (
              <TeamSingle key={item._id} item={item} />
            )
            ))
        }
      </Stack>
    </Box>
  )
}

export default Team
