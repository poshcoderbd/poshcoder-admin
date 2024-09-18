/* eslint-disable react/prop-types */
import { Clear } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../../context/AuthProvider';

const AppPackageCreate = ({ handleDialogClose }) => {
    const [packageName, SetPackageName] = useState('')
    const [packagePrice, SetPackagePrice] = useState('')
    const [inputValue, setInputValue] = useState('');
    const [detailsList, setDetailsList] = useState([]);

    const { token } = useAuth()

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (input) => axiosReq.post('/apppackage/create', input, { headers: { Authorization: token } }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['apppackage']);
            toast.success('App Package Created!')
            SetPackageName('')
            SetPackagePrice('')
            setDetailsList([])
            handleDialogClose()
        },
        onError: (err) => toast.error('Something Went Wrong!')
    })

    const handleSubmit = () => {
        if (!packagePrice || !packageName) {
            toast.error('All filed required')
            return
        }
        mutation.mutate({
            name: packageName,
            price: packagePrice,
            details: detailsList
        })
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setDetailsList([...detailsList, inputValue.trim()]);
            setInputValue('');
        }
    };
    const handleDelete = (index) => {
        const updatedWords = detailsList.filter((_, i) => i !== index);
        setDetailsList(updatedWords);
    };
    return (
        <Box>
            <Typography variant='h5' color='gray' mb={3}>Create App Package</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                // maxWidth: { sm: '100%', md: '30%' },
                gap: 1,
                // py: 2, px: 3,
                // border: '1px solid lightgray',
                // borderRadius: '5px',
                // bgcolor: '#fff'
            }}>
                <TextField onChange={(e) => SetPackageName(e.target.value)} id="standard-basic" label="Package Name" placeholder='e.g. E-commerce Website' variant="outlined" size='small' />
                <TextField onChange={(e) => SetPackagePrice(e.target.value)} id="standard-basic" label="Price" variant="outlined" placeholder='e.g. Start at Tk 20,000' size='small' />
                <Box mt={3} mb={2}>
                    <Typography mb={1}>Package Details</Typography>
                    <Stack gap={1}>
                        {detailsList.map((word, index) => (
                            <Stack direction='row' alignItems='center' gap={1} sx={{
                                border: '1px solid lightgray',
                                borderRadius: '5px',
                                pl: 2,
                                width: 'fit-content',
                                userSelect: 'none'
                            }} key={index}>
                                {word}
                                <button style={{
                                    padding: '0 10px',
                                    border: 'none',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer'
                                }} onClick={() => handleDelete(index)}><Clear fontSize='small' /> </button>
                            </Stack>
                        ))}
                        <TextField size='small' id="standard-basic" label="Type a word and press Enter" onChange={handleInputChange} value={inputValue} onKeyPress={handleKeyPress} variant="standard" />
                    </Stack>
                </Box>
            </Box>
            <CLoadingBtn handleClick={handleSubmit} loading={mutation.isPending}>Submit</CLoadingBtn>
        </Box >
    )
}

export default AppPackageCreate
