import { useForm, FormProvider, set } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Typography, Button, Dialog, DialogContent } from "@mui/material"
import { createFileHandlers, createIconHandlers } from "../fileUtils"
import { useState, useRef, useEffect } from "react"
import { useApiGame } from "../../../../hooks/useApiGame"
import { useCharacterFormPopulation } from "../../../../hooks/useCharacterFormPopulation"
import { formStyles } from "../formStyles"
import { API_CONFIG } from "../../../../config/api"
import { characterFormSchema } from "./characterFormSchema"
import CharacterInfoSection from "./CharacterInfoSection"
import CharacterImageSection from "./CharacterImageSection"
import StatScalingSection from "./StatScalingSection"
import SnackbarConfirmation from "../../../common/SnackbarConfirmation"
import EntrySearcher from "../EntrySearcher"

function CharacterForm() {
    const methods = useForm({
        resolver: yupResolver(characterFormSchema),
        defaultValues: {
            name: "",
            game: "",
            element: "",
            weapon: "",
            image: null,
            icon: null,
            statScalings: []
        }
    });

    const {
        handleSubmit,
        setValue,
        watch,
        getValues,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = methods;

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: ''
    });

    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const {data: games, error: gamesError} = useApiGame("game");
    const {data: weapons, error: weaponsError} = useApiGame("weapons");
    const {data: elements, error: elementsError} = useApiGame("elements");
    const {data: statTypes, error: statTypesError} = useApiGame("statTypes");

    const selectedImage = watch("image");
    const selectedIcon = watch("icon");
    const [dropzoneKey, setDropzoneKey] = useState(0);
    const [iconDropzoneKey, setIconDropzoneKey] = useState(0);
    const [initialIconMode, setInitialIconMode] = useState('upload');
    const [initialImageMode, setInitialImageMode] = useState('upload');
    const [initialBreakpoints, setInitialBreakpoints] = useState(null);

    
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

    const { statValuesRef } = useCharacterFormPopulation({
        selectedCharacter,
        isUpdate,
        setValue,
        reset,
        getValues,
        statTypes,
        setDropzoneKey,
        setIconDropzoneKey,
        setInitialIconMode,
        setInitialImageMode,
        setInitialBreakpoints
    });

    const onSubmit = (data) => {
        console.log("onSubmit called with DTO data:", data);
        
        const hasFileUploads = (data.image && !data.image.isServerImage) || (data.icon && !data.icon.isServerImage);
        
        let requestBody;
        let headers = {};
        
        if (hasFileUploads) {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("gameId", data.game);
            formData.append("characterElementId", data.element);
            formData.append("characterWeaponTypeId", data.weapon);
            
            if (isUpdate && selectedCharacter) {
                formData.append("id", selectedCharacter.id.toString());
            }
            
            if (data.CharacterStatScaling && data.CharacterStatScaling.length > 0) {
                data.CharacterStatScaling.forEach((cs, index) => {
                    formData.append(`CharacterStatScaling[${index}].StatTypeId`, cs.StatTypeId.toString());
                    formData.append(`CharacterStatScaling[${index}].Level`, cs.Level.toString());
                    formData.append(`CharacterStatScaling[${index}].Value`, cs.Value.toString());
                    formData.append(`CharacterStatScaling[${index}].IsBreakpoint`, cs.IsBreakpoint.toString());
                });
            }

            if (data.image) {
                if (data.image.isServerImage) {
                    formData.append("imageId", data.image.serverId.toString());
                } else {
                    formData.append("image", data.image);
                }
            }
            
            if (data.icon) {
                if (data.icon.isServerImage) {
                    formData.append("iconId", data.icon.serverId.toString());
                } else {
                    formData.append("icon", data.icon);
                }
            }
            
            requestBody = formData;
        } else {
            const jsonData = {
                name: data.name,
                gameId: parseInt(data.game),
                characterElementId: parseInt(data.element),
                characterWeaponTypeId: parseInt(data.weapon),
                characterStatScaling: data.CharacterStatScaling || []
            };
            
            if (isUpdate && selectedCharacter) {
                jsonData.id = selectedCharacter.id;
            }
            
            if (data.image && data.image.isServerImage) {
                jsonData.imageId = data.image.serverId;
            }
            
            if (data.icon && data.icon.isServerImage) {
                jsonData.iconId = data.icon.serverId;
            }
            
            requestBody = JSON.stringify(jsonData);
            headers['Content-Type'] = 'application/json';
        }

        const endpoint = isUpdate 
            ? `${API_CONFIG.ENDPOINTS.UPDATE_CHARACTER}${selectedCharacter.id}` 
            : API_CONFIG.ENDPOINTS.ADD_CHARACTER;
        const method = isUpdate ? "PUT" : "POST";
        const successMessage = isUpdate ? "Character updated successfully!" : "Character created successfully!";

        console.log("Sending request to:", `${API_CONFIG.BASE_URL}${endpoint}`);
        console.log("Request type:", hasFileUploads ? "FormData" : "JSON");
        
        if (hasFileUploads) {
            console.log("FormData contents:");
            for (let [key, value] of requestBody.entries()) {
                console.log(`${key}:`, value);
            }
        } else {
            console.log("JSON payload:", requestBody);
        }
        
        fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: requestBody
        }).then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(result => {
            console.log("Character operation completed:", result);
            setSnackbar({
                open: true, 
                severity: 'success', 
                message: successMessage
            });
            
            if (!isUpdate) {
                reset({
                    name: "",
                    game: "",
                    element: "",
                    weapon: "",
                    image: null,
                    icon: null,
                    statScalings: []
                });
                setInitialIconMode('upload');
                setInitialImageMode('upload');
                setInitialBreakpoints(null);
                statValuesRef.current.clear();
                setDropzoneKey(prev => prev + 1);
                setIconDropzoneKey(prev => prev + 1);
            }
        })
        .catch(error => {
            console.error("Error with character operation:", error.message);
            setSnackbar({
                open: true,
                severity: 'error',
                message: error.message
            });
        });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form onSubmit triggered");
        
        const formValues = getValues();
        console.log("Raw form values:", formValues);
        
        const transformedData = {
            name: formValues.name,
            game: formValues.game,
            element: formValues.element,
            weapon: formValues.weapon,
            image: formValues.image,
            icon: formValues.icon,
            CharacterStatScaling: []
        };
        
        statValuesRef.current.forEach((values, statTypeId) => {
            Object.entries(values || {}).forEach(([breakpointKey, value]) => {
                if (value !== '' && !isNaN(Number(value))) {
                    const isMajor = breakpointKey.endsWith('+');
                    const level = isMajor ? parseInt(breakpointKey.slice(0, -1)) : parseInt(breakpointKey);
                    
                    transformedData.CharacterStatScaling.push({
                        StatTypeId: statTypeId,
                        Level: level,
                        Value: Number(value),
                        IsBreakpoint: isMajor
                    });
                }
            });
        });
        
        console.log("Transformed data for validation:", transformedData);
        
        characterFormSchema.validate(transformedData)
            .then((validData) => {
                console.log("Validation passed, calling onSubmit");
                onSubmit(validData);
            })
            .catch((validationError) => {
                console.log("Validation failed:", validationError);
            });
    };

    const handleClearForm = () => {
        reset({
            name: "",
            game: "",
            element: "",
            weapon: "",
            image: null,
            icon: null,
            statScalings: []
        });
        setSelectedCharacter(null);
        setIsUpdate(false);
        setInitialIconMode('upload');
        setInitialImageMode('upload');
        setInitialBreakpoints(null);
        statValuesRef.current.clear();
        setDropzoneKey(prev => prev + 1);
        setIconDropzoneKey(prev => prev + 1);
    };

    return (
        <FormProvider {...methods}>
            <Box 
                component="form" 
                onSubmit={handleFormSubmit}
                sx={formStyles.formContainer}
            >
                <Typography {...formStyles.formTitle}>
                    {isUpdate ? `Edit Character: ${selectedCharacter?.name || ''}` : 'Character Management'}
                </Typography>
                
                <Box sx={formStyles.formLayout.sx}>
                    <Box sx={formStyles.leftColumn.sx}>
                        <CharacterImageSection 
                            selectedIcon={selectedIcon}
                            selectedImage={selectedImage}
                            iconDropzoneKey={iconDropzoneKey}
                            dropzoneKey={dropzoneKey}
                            iconHandlers={iconHandlers}
                            handleFilesSelected={handleFilesSelected}
                            handleClearFile={handleClearFile}
                            handleReplaceFile={handleReplaceFile}
                            initialIconMode={initialIconMode}
                            initialImageMode={initialImageMode}
                        />
                    </Box>

                    <Box sx={formStyles.rightColumn.sx}>
                        <CharacterInfoSection 
                            games={games}
                            elements={elements}
                            weapons={weapons}
                            setCharacter={setSelectedCharacter}
                            setUpdate={setIsUpdate}
                        />
                        
                        <StatScalingSection 
                            statTypes={statTypes}
                            statValuesRef={statValuesRef}
                            initialBreakpoints={initialBreakpoints}
                            onBreakpointsChange={setInitialBreakpoints}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button 
                                type="submit" 
                                {...formStyles.submitButton}
                                sx={{ flex: 1 }}
                                onClick={(e) => {
                                    console.log("Submit button clicked");
                                }}
                            >
                                {isUpdate ? "Update Character" : "Add Character"}
                            </Button>
                            
                            {isUpdate && (
                                <Button 
                                    type="button"
                                    variant="outlined"
                                    onClick={handleClearForm}
                                    sx={{ 
                                        px: 3,
                                        py: 1,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Clear Form
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <SnackbarConfirmation
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </FormProvider>
    );
}

export default CharacterForm;