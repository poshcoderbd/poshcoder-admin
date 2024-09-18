import React, { useEffect, useState } from 'react'
import { Box, Button, DialogActions, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import PackageCard from '../../../common/packageCard/PackageCard';
import { Add } from '@mui/icons-material';
import CDialog from '../../../common/dialog/CDialog';
import WebPackageCreate from './WebPackageCreate';
import WebTemplate from './WebTemplate';
import WebPackage from './WebPackage';
import { useQuery } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import LoadingBar from '../../../common/loadingBar/LoadingBar';

export const webPackageData = [
  {
    id: 1,
    name: 'Company Website',
    price: 'Start at Tk 20,000',
    info: [
      'Responsive Design',
      'Basic Information Pages',
      'Contact Form',
      'Fast Loading',
      'Social media integration',
      'Easy to Update',
      'Affordable to improve',
      'Security Features'
    ]
  },
  {
    id: 2,
    name: 'E-commerce Website',
    price: 'Start at Tk 17,000',
    info: [
      'Responsive Design',
      'Modern & Clean Interface',
      'Customer Relationship',
      'Shipping Options',
      'Service/Product Page(s)',
      'Store Management',
      'Easy to Update',
      'Security Features'
    ]
  },
  {
    id: 3,
    name: 'Newspaper Website',
    price: 'Start at Tk 15,000',
    info: [
      'Responsive Design',
      'Modern & Clean Interface',
      'Breaking News',
      'Multi-column Layout',
      'Functional Sidebar',
      'Frequent Content Updates',
      'Social Media Integration',
      'Security Features'
    ]
  },
  {
    id: 4,
    name: 'Blogging Website',
    price: 'Start at Tk 15,000',
    info: [
      'Responsive Design',
      'Basic Information Pages',
      'Contact Form',
      'Blog Post Archive',
      'Comment System',
      'Beginner Friendly',
      'Social Media Integration',
      'Security Features'
    ]
  },
  {
    id: 5,
    name: 'Educational Website',
    price: 'Start at Tk 20,000',
    info: [
      'Responsive Design',
      'Basic Information Pages',
      'Contact Form',
      'Powerful CMS',
      'Powerful Calendar',
      'Powerful Database',
      'Dynamic Notice Board',
      'Security Features'
    ]
  },
  {
    id: 6,
    name: 'Portfolio Website',
    price: 'Start at Tk 12,000',
    info: [
      'Responsive Design',
      'Basic Information Pages',
      'Contact Form',
      'Service Page(s)',
      'Social media integration',
      'Project Gallery',
      'Blog Setup',
      'Security Features'
    ]
  },
];

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



const WebDev = () => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);

  const { isLoading, error, data: allWebpackage } = useQuery({
    queryKey: ['webpackage'],
    queryFn: () => axiosReq.get('/webpackage/getall').then(res => res.data)
  });

  const theme = useTheme()

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
      <Typography variant='h5' mb={6} color={theme.palette.primary.main}>Website Development</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabValueChange} aria-label="basic tabs example">
            <Tab label="Service Package" {...a11yProps(0)} />
            <Tab label="Web Template" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Button sx={{ mt: 3 }} onClick={handleDialogOpen} startIcon={<Add />} variant='contained'>Create</Button>
          <CDialog openDialog={createDialogOpen}>
            <WebPackageCreate handleDialogClose={handleDialogClose} />
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
            </DialogActions>
          </CDialog>
          <Stack direction={'row'} flexWrap={'wrap'} justifyContent={'center'} gap={{ xs: 5, md: 5 }} mt={7}>
            {
              isLoading ? <LoadingBar/> : error? 'Something went wrong!' : (
                allWebpackage?.map((data, i) => (
                  <PackageCard key={i}>
                    <WebPackage data={data} />
                  </PackageCard>
                ))
              )
            }
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <WebTemplate />
        </CustomTabPanel>
      </Box>

    </Box>
  )
}

export default WebDev
