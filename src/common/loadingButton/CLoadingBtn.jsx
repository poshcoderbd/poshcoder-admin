import LoadingButton from '@mui/lab/LoadingButton'
import React from 'react'

const CLoadingBtn = ({handleClick,loading,children}) => {
  return (
    <LoadingButton
    size='small'
      onClick={handleClick}
      loading={loading}
      variant="contained"
    >
      {children}
    </LoadingButton>
  )
}

export default CLoadingBtn
