import { Box, Typography, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { CloudUpload, Collections } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { useImageMode } from "../../../../hooks/useImageMode";
import { useImageState } from "../../../../hooks/useImageState";
import { useImageHandlers } from "../../../../hooks/useImageHandlers";
import { IconSelector } from "../IconSelector";
import { ImageSelector } from "../ImageSelector";
import ImagePicker from "../ImagePicker";
import { formStyles, getErrorTextProps } from "../formStyles";

function CharacterImageSection({ 
    selectedIcon,
    selectedImage,
    iconDropzoneKey,
    dropzoneKey,
    iconHandlers,
    handleFilesSelected,
    handleClearFile,
    handleReplaceFile,
    initialIconMode = 'upload',
    initialImageMode = 'upload'
}) {
    const { formState: { errors }, setValue } = useFormContext();
    
    const iconMode = useImageMode(initialIconMode);
    const iconState = useImageState(selectedIcon, iconMode.mode, setValue, 'icon');
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const iconHandlersHook = useImageHandlers(
        iconMode.mode, 
        setValue, 
        'icon', 
        iconState.setUploadedImage, 
        iconState.setServerImage, 
        setIconPickerOpen
    );

    // Image management
    const imageMode = useImageMode(initialImageMode);
    const imageState = useImageState(selectedImage, imageMode.mode, setValue, 'image');
    const [imagePickerOpen, setImagePickerOpen] = useState(false);
    const imageHandlersHook = useImageHandlers(
        imageMode.mode, 
        setValue, 
        'image', 
        imageState.setUploadedImage, 
        imageState.setServerImage, 
        setImagePickerOpen
    );
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
                        value={iconMode.mode}
                        exclusive
                        onChange={iconMode.handleModeChange}
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
                
                <IconSelector
                    mode={iconMode.mode}
                    currentIcon={iconState.currentImage}
                    dropzoneKey={iconDropzoneKey}
                    handlers={iconHandlersHook}
                    onPickerOpen={() => setIconPickerOpen(true)}
                />
                
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
                        value={imageMode.mode}
                        exclusive
                        onChange={imageMode.handleModeChange}
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
                
                <ImageSelector
                    mode={imageMode.mode}
                    currentImage={imageState.currentImage}
                    dropzoneKey={dropzoneKey}
                    handlers={imageHandlersHook}
                    onPickerOpen={() => setImagePickerOpen(true)}
                />
                
                {errors.image && (
                    <Typography {...getErrorTextProps(errors.image)} />
                )}
            </Box>

            {/* Image Picker Dialogs */}
            <ImagePicker
                open={iconPickerOpen}
                onClose={() => setIconPickerOpen(false)}
                onSelect={iconHandlersHook.handleImageFromServer}
                title="Select Character Icon"
                searchPlaceholder="Search character icons..."
                imageHeight={120}
            />

            <ImagePicker
                open={imagePickerOpen}
                onClose={() => setImagePickerOpen(false)}
                onSelect={imageHandlersHook.handleImageFromServer}
                title="Select Character Image"
                searchPlaceholder="Search character images..."
                imageHeight={150}
            />
        </Box>
    )
}

export default CharacterImageSection;