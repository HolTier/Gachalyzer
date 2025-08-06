import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormControl, Input, Box, Typography, Button, IconButton, Paper, Avatar, InputLabel, Select, MenuItem } from "@mui/material"
import SingleFileDropzone from "./SingleFileDropzone"
import { createFileHandlers, formatFileSize } from "./fileUtils"
import { useState, useEffect } from "react"
import { Close, Image } from "@mui/icons-material"
import { useApiGame } from "../../../hooks/useApiGame"
import { formStyles, getFormControlProps, getErrorTextProps } from "../../../themes/formThemes"

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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={formStyles.formContainer}>
            <Typography {...formStyles.formTitle}>
                Add Character
            </Typography>
            
            <FormControl {...getFormControlProps()}>
                <Input 
                    {...register("name")} 
                    placeholder="Character Name"
                    error={!!errors.name}
                />
                {errors.name && (
                    <Typography {...getErrorTextProps(errors.name)} />
                )}
            </FormControl>

            <FormControl {...getFormControlProps(true)}>
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
                    <Typography {...getErrorTextProps(errors.game)} />
                )}
            </FormControl>

            <Box sx={formStyles.fileSection.sx}>
                <Typography {...formStyles.sectionTitle}>
                    Character Image (Single File Only)
                </Typography>
                <Typography {...formStyles.helperText}>
                    Select one image file for the character. If multiple files are dropped, only the first will be used.
                </Typography>
                
                {!selectedImage ? (
                    <SingleFileDropzone 
                        key={dropzoneKey}
                        onFilesSelected={handleFilesSelected} 
                    />
                ) : (
                    <Box sx={formStyles.filePreviewContainer.sx}>
                        <Paper {...formStyles.filePreviewPaper}>
                            <Box sx={formStyles.fileImageContainer.sx}>
                                <Avatar 
                                    {...formStyles.filePreviewImage}
                                    src={URL.createObjectURL(selectedImage)}
                                    alt={selectedImage.name}
                                />
                                
                                <IconButton
                                    {...formStyles.removeFileButton}
                                    onClick={handleClearFile}
                                >
                                    <Close sx={formStyles.closeIcon.sx} />
                                </IconButton>
                            </Box>
                            
                            <Box sx={formStyles.fileInfoContainer.sx}>
                                <Typography 
                                    {...formStyles.fileName}
                                    title={selectedImage.name}
                                >
                                    {selectedImage.name}
                                </Typography>
                                <Typography {...formStyles.fileSize}>
                                    {formatFileSize(selectedImage.size)}
                                </Typography>
                            </Box>
                        </Paper>
                        
                        <Box sx={formStyles.fileActionsContainer.sx}>
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={handleClearFile}
                                color="error"
                            >
                                Remove
                            </Button>
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={handleReplaceFile}
                                color="primary"
                            >
                                Replace
                            </Button>
                        </Box>
                    </Box>
                )}
                
                {errors.image && (
                    <Typography {...getErrorTextProps(errors.image)} />
                )}
            </Box>

            <Button {...formStyles.submitButton}>
                Add Character
            </Button>
        </Box>
    );
}

export default CharacterForm;