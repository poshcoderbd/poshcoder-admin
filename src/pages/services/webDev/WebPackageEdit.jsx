import { Clear } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';
import CLoadingBtn from '../../../common/loadingButton/CLoadingBtn';
import { useAuth } from '../../../context/AuthProvider';

const WebPackageEdit = ({ data, handleDialogClose }) => {
    const [inputValue, setInputValue] = useState('');
    const [packageDetails, setPackageDetails] = useState([]);
    const [packageName, setPackageName] = useState('')
    const [packagePrice, setPackagePrice] = useState('')

    const { token } = useAuth()

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (input) => axiosReq.put(`/webpackage/update/${data._id}`, input, { headers: { Authorization: token } }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['webpackage']);
            toast.success('Update Success!')
            handleDialogClose()
        },
        onError: (err) => toast.error('Something Went Wrong!')
    })

    const handleUpdate = () => {
        mutation.mutate({
            name: packageName,
            price: packagePrice,
            details: packageDetails
        })
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setPackageDetails([...packageDetails, inputValue.trim()]);
            setInputValue('');
        }
    };
    const handleDelete = (index) => {
        const updatedWords = packageDetails.filter((_, i) => i !== index);
        setPackageDetails(updatedWords);
    };
    useEffect(() => {
        setPackageDetails(data.details);
        setPackageName(data.name);
        setPackagePrice(data.price)
    }, [data])

    return (
        <Box>
            <Typography variant='h5' color='gray' mb={3}>Edit Web Package</Typography>
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
                <TextField onChange={e => setPackageName(e.target.value)} placeholder='e.g. E-commerce Website' value={packageName} id="standard-basic" label="Package Name" variant="outlined" size='small' />
                <TextField onChange={e => setPackagePrice(e.target.value)} placeholder='e.g. Start at Tk 20,000' value={packagePrice} id="standard-basic" label="Price" variant="outlined" size='small' />
                <Box mt={3} mb={2}>
                    <Typography mb={1}>Package Details</Typography>
                    <Stack gap={1}>
                        {packageDetails.map((word, index) => (
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
            <CLoadingBtn loading={mutation.isPending} handleClick={handleUpdate}>
                Update
            </CLoadingBtn>
        </Box >
    )
}

export default WebPackageEdit
