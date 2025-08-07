import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormControl, TextField, Box, Typography, Button, IconButton, Paper, Avatar, InputLabel, Select, MenuItem } from "@mui/material"
import SingleFileDropzone from "./SingleFileDropzone"
import { createFileHandlers, createIconHandlers, formatFileSize } from "./fileUtils"
import { useState, useEffect } from "react"
import { Close, Image } from "@mui/icons-material"
import { useApiGame } from "../../../hooks/useApiGame"
import { formStyles, getFormControlProps, getErrorTextProps } from "./formStyles"
import { API_CONFIG } from "../../../config/api"

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const schema = yup
    .object({
        name: yup.string().required("Name is required"),
        game: yup.number().typeError("Game is required").required("Game is required"),
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
            ),
        icon: yup
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
    });

    const {data: games, error} = useApiGame("game");
    
    const selectedImage = watch("image");
    const selectedIcon = watch("icon");
    const [dropzoneKey, setDropzoneKey] = useState(0);
    const [iconDropzoneKey, setIconDropzoneKey] = useState(0);
    
    const { handleFilesSelected, handleClearFile, handleReplaceFile } = createFileHandlers(
        setValue, 
        'image', 
        setDropzoneKey
    );
    
    const iconHandlers = createIconHandlers(
        setValue,
        'icon',
        setIconDropzoneKey
    );
    
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("gameId", data.game);
        if (data.image) {
            formData.append("image", data.image);
        }
        if (data.icon) {
            formData.append("icon", data.icon);
        }

        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_CHARACTER}`, {
            method: "POST",
            body: formData
        }).then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(result => {
            console.log("Character created:", result);
        })
        .catch(error => {
            console.error("Error creating character:", error.message);
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={formStyles.formContainer}>
            <Typography {...formStyles.formTitle}>
                Add Character
            </Typography>
            
            <Box sx={formStyles.formLayout.sx}>
                <Box sx={formStyles.leftColumn.sx}>
                    <Box sx={formStyles.iconSection.sx}>
                        <Typography {...formStyles.sectionTitle}>
                            Character Icon (Optional)
                        </Typography>
                        <Typography {...formStyles.helperText}>
                            Select a small icon image for the character.
                        </Typography>
                        
                        {!selectedIcon ? (
                            <SingleFileDropzone 
                                key={iconDropzoneKey}
                                isIcon={true}
                                onFilesSelected={iconHandlers.handleFilesSelected} 
                            />
                        ) : (
                            <Box sx={formStyles.iconPreviewContainer.sx}>
                                <Paper {...formStyles.iconPreviewPaper}>
                                    <Box sx={formStyles.iconImageContainer.sx}>
                                        <Avatar 
                                            {...formStyles.iconPreviewImage}
                                            src={URL.createObjectURL(selectedIcon)}
                                            alt={selectedIcon.name}
                                        />
                                        
                                        <IconButton
                                            size="small"
                                            onClick={iconHandlers.handleClearFile}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'error.main',
                                                color: 'white',
                                                width: 24,
                                                height: 24,
                                                '&:hover': {
                                                    backgroundColor: 'error.dark',
                                                    transform: 'scale(1.1)',
                                                },
                                                boxShadow: 2,
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        >
                                            <Close sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                </Paper>
                                
                                <Box sx={formStyles.iconInfoContainer.sx}>
                                    <Typography 
                                        {...formStyles.fileName}
                                        title={selectedIcon.name}
                                    >
                                        {selectedIcon.name}
                                    </Typography>
                                    <Typography {...formStyles.fileSize}>
                                        {formatFileSize(selectedIcon.size)}
                                    </Typography>
                                </Box>
                                
                                <Box sx={formStyles.fileActionsContainer.sx}>
                                    <Button 
                                        {...formStyles.fileActionButton}
                                        onClick={iconHandlers.handleClearFile}
                                        color="error"
                                    >
                                        Remove
                                    </Button>
                                    <Button 
                                        {...formStyles.fileActionButton}
                                        onClick={iconHandlers.handleReplaceFile}
                                        color="primary"
                                    >
                                        Replace
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        
                        {errors.icon && (
                            <Typography {...getErrorTextProps(errors.icon)} />
                        )}
                    </Box>

                    <Box sx={formStyles.fileSection.sx}>
                        <Typography {...formStyles.sectionTitle}>
                            Character Image
                        </Typography>
                        <Typography {...formStyles.helperText}>
                            Select one image file for the character.
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
                </Box>

                <Box sx={formStyles.rightColumn.sx}>
                    <FormControl {...getFormControlProps()}>
                        <TextField
                            {...register("name")} 
                            label="Character Name"
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            autoComplete="off"
                            fullWidth
                        />
                    </FormControl>

                    <FormControl {...getFormControlProps(true)}>
                        <InputLabel id="game-select">Game</InputLabel>
                        <Select
                            {...register("game", { valueAsNumber: true })}
                            labelId="game-select"
                            label="Game"
                            variant="outlined"
                            error={!!errors.game}
                            defaultValue=""
                            autoComplete="off"
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

                    <Button {...formStyles.submitButton}>
                        Add Character
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CharacterForm;