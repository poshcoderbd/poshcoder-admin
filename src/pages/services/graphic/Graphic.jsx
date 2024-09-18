import React, { useEffect, useState } from 'react'
import { Box, Button, DialogActions, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PackageCard from '../../../common/packageCard/PackageCard';
import { Add } from '@mui/icons-material';
import CDialog from '../../../common/dialog/CDialog';
import GraphicPackageCreate from './GraphicPackageCreate';
import GraphicTemplate from './GraphicTemplate';
import GraphicPackage from './GraphicPackage';
import { useQuery } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import LoadingBar from '../../../common/loadingBar/LoadingBar';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const Graphic = () => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);

  const { isLoading, error, data: allAppPackage } = useQuery({
    queryKey: ['graphic'],
    queryFn: () => axiosReq.get('/graphicpackage/getall').then(res => res.data)
  });

  const handleDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleDialogClose = () => {
    setCreateDialogOpen(false);
  };


  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box sx={{
      p: { xs: 2, md: 4 }
    }}>
      <Typography variant='h5' mb={6} color='primary'>Graphic Design</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabValueChange} aria-label="basic tabs example">
            <Tab label="Service Package" {...a11yProps(0)} />
            <Tab label="Graphic Template" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Button sx={{ mt: 3 }} onClick={handleDialogOpen} startIcon={<Add />} variant='contained'>Create</Button>
          <CDialog openDialog={createDialogOpen}>
            <GraphicPackageCreate handleDialogClose={handleDialogClose} />
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
            </DialogActions>
          </CDialog>
          <Stack direction={'row'} flexWrap={'wrap'} justifyContent={'center'} gap={{ xs: 5, md: 5 }} mt={7}>
            {
              isLoading ? <LoadingBar/> : error? 'Something went wrong!' : (
                allAppPackage?.map((data, i) => (
                  <PackageCard key={i}>
                    <GraphicPackage data={data} />
                  </PackageCard>
                ))
              )
            }
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <GraphicTemplate />
        </CustomTabPanel>
      </Box>

    </Box>
  )
}

export default Graphic
