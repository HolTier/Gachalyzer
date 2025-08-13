import { Box, Typography, Paper, Avatar, IconButton, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Close, CloudUpload, Collections } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import SingleFileDropzone from "../SingleFileDropzone";
import ImagePicker from "../ImagePicker";
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
    const { formState: { errors }, setValue } = useFormContext();
    const [iconMode, setIconMode] = useState('upload'); // 'upload' or 'server'
    const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'server'
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [imagePickerOpen, setImagePickerOpen] = useState(false);

    const handleIconModeChange = (event, newMode) => {
        if (newMode !== null) {
            setIconMode(newMode);
            // Clear current selection when switching modes
            if (selectedIcon) {
                iconHandlers.handleClearFile();
            }
        }
    };

    const handleImageModeChange = (event, newMode) => {
        if (newMode !== null) {
            setImageMode(newMode);
            // Clear current selection when switching modes
            if (selectedImage) {
                handleClearFile();
            }
        }
    };

    const handleIconFromServer = (serverImage) => {
        // Convert server image to a File-like object for form compatibility
        const imageFile = {
            name: serverImage.name,
            url: serverImage.url,
            isServerImage: true,
            serverId: serverImage.id
        };
        setValue('icon', imageFile);
        setIconPickerOpen(false);
    };

    const handleImageFromServer = (serverImage) => {
        // Convert server image to a File-like object for form compatibility
        const imageFile = {
            name: serverImage.name,
            url: serverImage.url,
            isServerImage: true,
            serverId: serverImage.id
        };
        setValue('image', imageFile);
        setImagePickerOpen(false);
    };

    const renderIconSelector = () => {
        if (iconMode === 'upload') {
            return !selectedIcon ? (
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
                                src={selectedIcon.isServerImage ? selectedIcon.url : URL.createObjectURL(selectedIcon)}
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
                        {!selectedIcon.isServerImage && (
                            <Typography {...formStyles.fileSize}>
                                {formatFileSize(selectedIcon.size)}
                            </Typography>
                        )}
                        {selectedIcon.isServerImage && (
                            <Typography variant="caption" color="primary">
                                From Server
                            </Typography>
                        )}
                    </Box>
                    
                    <Box sx={formStyles.fileActionsContainer.sx}>
                        <Button 
                            {...formStyles.fileActionButton}
                            onClick={iconHandlers.handleClearFile}
                            color="error"
                        >
                            Remove
                        </Button>
                        {iconMode === 'upload' && (
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={iconHandlers.handleReplaceFile}
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
                    {!selectedIcon ? (
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Collections />}
                            onClick={() => setIconPickerOpen(true)}
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
                                        src={selectedIcon.url}
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
                                <Typography variant="caption" color="primary">
                                    From Server
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
                                    onClick={() => setIconPickerOpen(true)}
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

    const renderImageSelector = () => {
        if (imageMode === 'upload') {
            return !selectedImage ? (
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
                                src={selectedImage.isServerImage ? selectedImage.url : URL.createObjectURL(selectedImage)}
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
                            {!selectedImage.isServerImage && (
                                <Typography {...formStyles.fileSize}>
                                    {formatFileSize(selectedImage.size)}
                                </Typography>
                            )}
                            {selectedImage.isServerImage && (
                                <Typography variant="caption" color="primary">
                                    From Server
                                </Typography>
                            )}
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
                        {imageMode === 'upload' && (
                            <Button 
                                {...formStyles.fileActionButton}
                                onClick={handleReplaceFile}
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
                    {!selectedImage ? (
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Collections />}
                            onClick={() => setImagePickerOpen(true)}
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
                                        src={selectedImage.url}
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
                                    <Typography variant="caption" color="primary">
                                        From Server
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
                                    onClick={() => setImagePickerOpen(true)}
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
    return (
        <Box>
            <Box sx={formStyles.iconSection.sx}>
                <Typography {...formStyles.sectionTitle}>
                    Character Icon (Optional)
                </Typography>
                <Typography {...formStyles.helperText}>
                    Select a small icon image for the character.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                    <ToggleButtonGroup
                        value={iconMode}
                        exclusive
                        onChange={handleIconModeChange}
                        aria-label="icon selection mode"
                        size="small"
                        fullWidth
                    >
                        <ToggleButton value="upload" aria-label="upload icon">
                            <CloudUpload sx={{ mr: 1 }} />
                            Upload New
                        </ToggleButton>
                        <ToggleButton value="server" aria-label="server icon">
                            <Collections sx={{ mr: 1 }} />
                            From Server
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
                {renderIconSelector()}
                
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
                
                <Box sx={{ mb: 2 }}>
                    <ToggleButtonGroup
                        value={imageMode}
                        exclusive
                        onChange={handleImageModeChange}
                        aria-label="image selection mode"
                        size="small"
                        fullWidth
                    >
                        <ToggleButton value="upload" aria-label="upload image">
                            <CloudUpload sx={{ mr: 1 }} />
                            Upload New
                        </ToggleButton>
                        <ToggleButton value="server" aria-label="server image">
                            <Collections sx={{ mr: 1 }} />
                            From Server
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
                {renderImageSelector()}
                
                {errors.image && (
                    <Typography {...getErrorTextProps(errors.image)} />
                )}
            </Box>

            {/* Image Picker Dialogs */}
            <ImagePicker
                open={iconPickerOpen}
                onClose={() => setIconPickerOpen(false)}
                onSelect={handleIconFromServer}
                title="Select Character Icon"
                searchPlaceholder="Search character icons..."
                apiEndpoint="/api/images/icons"
                imageHeight={120}
            />

            <ImagePicker
                open={imagePickerOpen}
                onClose={() => setImagePickerOpen(false)}
                onSelect={handleImageFromServer}
                title="Select Character Image"
                searchPlaceholder="Search character images..."
                apiEndpoint="/api/images/characters"
                imageHeight={150}
            />
        </Box>
    )
}

export default CharacterImageSection;