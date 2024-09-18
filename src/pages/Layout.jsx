import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../utils/axiosReq';
import toast from 'react-hot-toast';
import { Logout } from '@mui/icons-material';
import CDrawer from './CDrawer';
import { useAuth } from '../context/AuthProvider';

const drawerWidth = 260;

function Layout(props) {

  const { setToken } = useAuth()
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);


  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => axiosReq.post('/admin/logout'),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['logout']);
      window.location.href = 'admin/login'
      toast.success(res.data)
    },
    onError: (err) => toast.error(err.response.data)
  })

  const handleLogout = () => {
    setToken(null)
    // mutation.mutate()
  }

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Box>
      <Typography sx={{ textAlign: 'center', fontSize: '25px', fontWeight: 600, mt: 6 }}>PoshCoder</Typography>
      <Typography sx={{ textAlign: 'center', fontSize: '14px' }}>poshcoderbd@gmail.com</Typography>
      <CDrawer handleDrawerClose={handleDrawerClose} />
    </Box>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box />
          <ListItem sx={{ width: 'fit-content', }} >
            <IconButton sx={{ color: '#fff' }} onClick={handleLogout}>
              <Logout />
              <Typography sx={{ ml: 1 }}>Logout</Typography>
            </IconButton>
          </ListItem>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 1, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Box maxWidth='xl' sx={{ p: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
