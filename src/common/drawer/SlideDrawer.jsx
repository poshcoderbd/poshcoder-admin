/* eslint-disable react/prop-types */
import { Button, SwipeableDrawer } from '@mui/material';
import React from 'react'

const SlideDrawer = ({ children, toggleDrawer, openSlideDrawer }) => {

  return (
    <SwipeableDrawer
      anchor='right'
      open={openSlideDrawer}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      {children}
    </SwipeableDrawer>
  )
}

export default SlideDrawer