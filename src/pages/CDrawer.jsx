import React from 'react'
import { AutoAwesomeMotion, ExpandLess, ExpandMore, FiberManualRecord, LocalPolice, Logout, PeopleAlt, ShoppingCart, SpaceDashboard, StickyNote2, Workspaces } from '@mui/icons-material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../utils/axiosReq';
import toast from 'react-hot-toast';
import { Badge, Collapse, Stack } from '@mui/material';


const CDrawer = ({ handleDrawerClose }) => {
  const [expandedNavlinkIndex, setExpandedNavlinkIndex] = React.useState(null)

  const handleExpandedNavlink = (index) => {
    if (expandedNavlinkIndex === index) {
      setExpandedNavlinkIndex(null)
    } else {
      setExpandedNavlinkIndex(index)
    }
  }
  const { data: orders } = useQuery({
    queryKey: ['orders', 'placed'],
    queryFn: () => axiosReq.get(`/order/orders?status=placed`).then((res) => res.data)
  });

  const navItem = [
    { name: 'Dashboard', icon: <SpaceDashboard />, path: '/admin/dashboard' },
    { name: 'Users', icon: <PeopleAlt />, path: '/admin/users' },
    { name: 'Orders', icon: <ShoppingCart />, path: '/admin/orders', newOrder: orders?.length },
    {
      name: 'Servicess',
      icon: < AutoAwesomeMotion />,
      more: [
        { name: 'Website Development', path: '/admin/service/web' },
        { name: 'App Development', path: '/admin/service/app' },
        { name: 'Graphic Design', path: '/admin/service/graphic' },
        // { name: 'Digital Marketing', path: '/admin/service/marketing' },
        // { name: 'Content Creation', path: '/admin/service/content' }
      ]
    },
    { name: 'Teams', icon: <Workspaces />, path: '/admin/team' },
    { name: 'Blogs', icon: <StickyNote2 />, path: '/admin/blog' },
    { name: 'Trust By', icon: <LocalPolice />, path: '/admin/trustby' },
  ]
  return (
    <List sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: .5 }}>
      {navItem.map((item, index) => (
        <ListItem disablePadding key={index} sx={{ display: 'block' }}>
          {item.more ?
            (
              <>
                <NavLink className='link' to={item.path}>
                  <ListItemButton sx={{
                    px: 1, mx: 2, borderRadius: '5px', mb: .5,
                    color: 'gray',
                  }} onClick={() => handleExpandedNavlink(index)}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {expandedNavlinkIndex === index ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                </NavLink>
                <Collapse in={expandedNavlinkIndex === index} timeout="auto" unmountOnExit>
                  <List component="div">
                    {
                      item?.more?.map((i, id) => (
                        <NavLink onClick={handleDrawerClose} className='link' key={id} to={i.path}>
                          {
                            ({ isActive }) => (
                              <ListItemButton sx={{
                                ml: 5, mr: 2, mb: .5, borderRadius: '5px',
                                bgcolor: isActive ? 'primary.main' : '',
                                color: isActive ? '#fff' : 'gray',
                                ":hover": {
                                  bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                                }
                              }}>
                                <FiberManualRecord sx={{ fontSize: '15px', mr: .5 }} />
                                <Typography sx={{
                                  fontSize: '14px',
                                  textWrap: 'nowrap'
                                }}>
                                  {i.name}
                                </Typography>
                              </ListItemButton>
                            )
                          }
                        </NavLink>
                      ))
                    }
                  </List>
                </Collapse>
              </>
            ) : (
              <NavLink className='link' to={item.path}>
                {
                  ({ isActive }) => (
                    <ListItemButton onClick={handleDrawerClose} disableGutters sx={{
                      px: 1, mx: 2,
                      borderRadius: '5px',
                      bgcolor: isActive ? 'primary.main' : '',
                      color: isActive ? '#fff' : 'gray',
                      ":hover": {
                        bgcolor: isActive ? 'primary.main' : '#F5F5F5',
                      }
                    }}>
                      <ListItemIcon sx={{
                        minWidth: 0, mr: 1.5, color: 'inherit'
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                      <Badge sx={{ mr: 2, }} badgeContent={item.newOrder} color='warning' />
                    </ListItemButton>
                  )
                }
              </NavLink>
            )}
        </ListItem>
      ))}
    </List>
  )
}

export default CDrawer