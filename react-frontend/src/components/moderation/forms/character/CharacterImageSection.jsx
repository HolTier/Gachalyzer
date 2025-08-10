import { Box, Typography, Paper, Avatar, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import SingleFileDropzone from "../SingleFileDropzone";
import { formatFileSize } from "../fileUtils";
import { formStyles, getErrorTextProps } from "../formStyles";

function CharacterImageSection({ 
    selectedIcon,
    selectedImage,
    iconDropzoneKey,
    dropzoneKey,
    iconHandlers,
    handleFilesSelected,
    handleClearFile,
    handleReplaceFile
}) {
    const { formState: { errors } } = useFormContext();
    return (
        <Box>
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
    )
}

export default CharacterImageSection;