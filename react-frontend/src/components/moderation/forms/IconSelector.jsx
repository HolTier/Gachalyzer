import { Box, Typography, Paper, Avatar, IconButton, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Close, CloudUpload, Collections } from "@mui/icons-material";
import { formatFileSize } from './fileUtils';
import { formStyles } from './formStyles';
import SingleFileDropzone from "./SingleFileDropzone";

export const IconSelector = ({ 
    mode, 
    currentIcon, 
    dropzoneKey, 
    handlers, 
    onPickerOpen 
}) => {
    if (mode === 'upload') {
        return !currentIcon ? (
            <SingleFileDropzone 
                key={dropzoneKey}
                isIcon={true}
                onFilesSelected={handlers.handleFilesSelected} 
            />
        ) : (
            <Box sx={formStyles.iconPreviewContainer.sx}>
                <Paper {...formStyles.iconPreviewPaper}>
                    <Box sx={formStyles.iconImageContainer.sx}>
                        <Avatar 
                            {...formStyles.iconPreviewImage}
                            src={currentIcon.isServerImage ? currentIcon.url : URL.createObjectURL(currentIcon)}
                            alt={currentIcon.name}
                        />
                        
                        <IconButton
                            size="small"
                            onClick={handlers.handleClearFile}
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
                        title={currentIcon.name}
                    >
                        {currentIcon.name}
                    </Typography>
                    {!currentIcon.isServerImage && (
                        <Typography {...formStyles.fileSize}>
                            {formatFileSize(currentIcon.size)}
                        </Typography>
                    )}
                    {currentIcon.isServerImage && (
                        <Typography variant="caption" color="primary">
                            From Server
                        </Typography>
                    )}
                </Box>
                
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
                {!currentIcon ? (
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Collections />}
                        onClick={onPickerOpen}
                        sx={{ 
                            width: 120, 
                            height: 120,
                            borderRadius: '50%',
                            borderStyle: 'dashed',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        <Typography variant="caption">
                            Choose from Server
                        </Typography>
                    </Button>
                ) : (
                    <Box sx={formStyles.iconPreviewContainer.sx}>
                        <Paper {...formStyles.iconPreviewPaper}>
                            <Box sx={formStyles.iconImageContainer.sx}>
                                <Avatar 
                                    {...formStyles.iconPreviewImage}
                                    src={currentIcon.url}
                                    alt={currentIcon.name}
                                />
                                
                                <IconButton
                                    size="small"
                                    onClick={handlers.handleClearFile}
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
                                title={currentIcon.name}
                            >
                                {currentIcon.name}
                            </Typography>
                            <Typography variant="caption" color="primary">
                                From Server
                            </Typography>
                        </Box>
                        
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
