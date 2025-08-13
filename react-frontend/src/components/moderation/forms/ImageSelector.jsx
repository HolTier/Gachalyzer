import { Box, Typography, Paper, Avatar, IconButton, Button } from "@mui/material";
import { Close, Collections } from "@mui/icons-material";
import { formatFileSize } from './fileUtils';
import { formStyles } from './formStyles';
import SingleFileDropzone from "./SingleFileDropzone";

export const ImageSelector = ({ 
    mode, 
    currentImage, 
    dropzoneKey, 
    handlers, 
    onPickerOpen 
}) => {
    if (mode === 'upload') {
        return !currentImage ? (
            <SingleFileDropzone 
                key={dropzoneKey}
                onFilesSelected={handlers.handleFilesSelected} 
            />
        ) : (
            <Box sx={formStyles.filePreviewContainer.sx}>
                <Paper {...formStyles.filePreviewPaper}>
                    <Box sx={formStyles.fileImageContainer.sx}>
                        <Avatar 
                            {...formStyles.filePreviewImage}
                            src={currentImage.isServerImage ? currentImage.url : URL.createObjectURL(currentImage)}
                            alt={currentImage.name}
                        />
                        
                        <IconButton
                            {...formStyles.removeFileButton}
                            onClick={handlers.handleClearFile}
                        >
                            <Close sx={formStyles.closeIcon.sx} />
                        </IconButton>
                    </Box>
                    
                    <Box sx={formStyles.fileInfoContainer.sx}>
                        <Typography 
                            {...formStyles.fileName}
                            title={currentImage.name}
                        >
                            {currentImage.name}
                        </Typography>
                        {!currentImage.isServerImage && (
                            <Typography {...formStyles.fileSize}>
                                {formatFileSize(currentImage.size)}
                            </Typography>
                        )}
                        {currentImage.isServerImage && (
                            <Typography variant="caption" color="primary">
                                From Server
                            </Typography>
                        )}
                    </Box>
                </Paper>
                
                <Box sx={formStyles.fileActionsContainer.sx}>
                    <Button 
                        {...formStyles.fileActionButton}
                        onClick={handlers.handleClearFile}
                        color="error"
                    >
                        Remove
                    </Button>
                    {mode === 'upload' && (
                        <Button 
                            {...formStyles.fileActionButton}
                            onClick={handlers.handleReplaceFile}
                            color="primary"
                        >
                            Replace
                        </Button>
                    )}
                </Box>
            </Box>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {!currentImage ? (
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Collections />}
                        onClick={onPickerOpen}
                        sx={{ 
                            width: 200, 
                            height: 240,
                            borderStyle: 'dashed',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <Typography variant="body2">
                            Choose from Server
                        </Typography>
                    </Button>
                ) : (
                    <Box sx={formStyles.filePreviewContainer.sx}>
                        <Paper {...formStyles.filePreviewPaper}>
                            <Box sx={formStyles.fileImageContainer.sx}>
                                <Avatar 
                                    {...formStyles.filePreviewImage}
                                    src={currentImage.url}
                                    alt={currentImage.name}
                                />
                                
                                <IconButton
                                    {...formStyles.removeFileButton}
                                    onClick={handlers.handleClearFile}
                                >
                                    <Close sx={formStyles.closeIcon.sx} />
                                </IconButton>
                            </Box>
                            
                            <Box sx={formStyles.fileInfoContainer.sx}>
                                <Typography 
                                    {...formStyles.fileName}
                                    title={currentImage.name}
                                >
                                    {currentImage.name}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    From Server
                                </Typography>
                            </Box>
                        </Paper>
                        
                        <Box sx={formStyles.fileActionsContainer.sx}>
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={handlers.handleClearFile}
                                color="error"
                            >
                                Remove
                            </Button>
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={onPickerOpen}
                                color="primary"
                            >
                                Choose Different
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    }
};
