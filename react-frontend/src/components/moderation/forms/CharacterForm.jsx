import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormControl, Input, Box, Typography, Button, IconButton, Paper, Avatar, InputLabel, Select, MenuItem } from "@mui/material"
import SingleFileDropzone from "./SingleFileDropzone"
import { createFileHandlers, formatFileSize } from "./fileUtils"
import { useState, useEffect } from "react"
import { Close, Image } from "@mui/icons-material"
import { useApiGame } from "../../../hooks/useApiGame"

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const schema = yup
    .object({
        name: yup.string().required("Name is required"),
        game: yup.string().required("Game is required"),
        image: yup
            .mixed()
            .nullable()
            .test(
                "fileSize",
                "File size is too large (max 5MB)",
                (value) => !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
            )
            .test(
                "fileType",
                "Unsupported file type",
                (value) => 
                    !value ||
                    (value instanceof File && supportedImageTypes.includes(value.type))
            )
    })

function CharacterForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const {data: games, error} = useApiGame("game")
    
    const selectedImage = watch("image")
    const [dropzoneKey, setDropzoneKey] = useState(0) 
    
    const { handleFilesSelected, handleClearFile, handleReplaceFile } = createFileHandlers(
        setValue, 
        'image', 
        setDropzoneKey
    );
    
    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Add Character
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Input 
                    {...register("name")} 
                    placeholder="Character Name"
                    error={!!errors.name}
                />
                {errors.name && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.name.message}
                    </Typography>
                )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="game-select">Game</InputLabel>
                <Select
                    {...register("game")}
                    labelId="game-select"
                    label="Game"
                    error={!!errors.game}
                    defaultValue=""
                >
                    {games?.map((game) => (
                        <MenuItem key={game.id} value={game.id}>
                            {game.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.game && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.game.message}
                    </Typography>
                )}
            </FormControl>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Character Image (Single File Only)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select one image file for the character. If multiple files are dropped, only the first will be used.
                </Typography>
                
                {!selectedImage ? (
                    <SingleFileDropzone 
                        key={dropzoneKey}
                        onFilesSelected={handleFilesSelected} 
                    />
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        width: 200,
                        mx: 'auto'
                    }}>
                        <Paper
                            elevation={1}
                            sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                width: 200,
                                height: 240,
                                mb: 2
                            }}
                        >
                            <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                                <Avatar 
                                    variant="square"
                                    src={URL.createObjectURL(selectedImage)}
                                    alt={selectedImage.name}
                                    sx={{ 
                                        width: '100%', 
                                        height: '100%',
                                        borderRadius: 0,
                                        objectFit: 'cover'
                                    }}
                                />
                                
                                <IconButton
                                    size="small"
                                    onClick={handleClearFile}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                        width: 32,
                                        height: 32,
                                        '&:hover': { 
                                            backgroundColor: 'error.dark',
                                            transform: 'scale(1.1)',
                                        },
                                        boxShadow: 2,
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    <Close sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Box>
                            
                            <Box sx={{ p: 1.5, backgroundColor: 'background.paper', height: 40 }}>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontWeight: 500,
                                        color: 'text.primary',
                                        fontSize: '0.75rem'
                                    }}
                                    title={selectedImage.name}
                                >
                                    {selectedImage.name}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {formatFileSize(selectedImage.size)}
                                </Typography>
                            </Box>
                        </Paper>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleClearFile}
                                color="error"
                            >
                                Remove
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleReplaceFile}
                                color="primary"
                            >
                                Replace
                            </Button>
                        </Box>
                    </Box>
                )}
                
                {errors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.image.message}
                    </Typography>
                )}
            </Box>

            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ mt: 2 }}
            >
                Add Character
            </Button>
        </Box>
    );
}

export default CharacterForm;