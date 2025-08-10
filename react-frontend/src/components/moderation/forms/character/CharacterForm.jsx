import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Typography, Button } from "@mui/material"
import { createFileHandlers, createIconHandlers } from "../fileUtils"
import { useState, useRef } from "react"
import { useApiGame } from "../../../../hooks/useApiGame"
import { formStyles } from "../formStyles"
import { API_CONFIG } from "../../../../config/api"
import { characterFormSchema } from "./characterFormSchema"
import CharacterInfoSection from "./CharacterInfoSection"
import CharacterImageSection from "./CharacterImageSection"
import StatScalingSection from "./StatScalingSection"

function CharacterForm() {
    const methods = useForm({
        resolver: yupResolver(characterFormSchema),
        defaultValues: {
            statScalings: []
        }
    });

    const {
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors, isValid, isSubmitting },
    } = methods;

    const {data: games, error: gamesError} = useApiGame("game");
    const {data: weapons, error: weaponsError} = useApiGame("weapons");
    const {data: elements, error: elementsError} = useApiGame("elements");
    const {data: statTypes, error: statTypesError} = useApiGame("statTypes");

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

    const statValuesRef = useRef(new Map());

    const onSubmit = (data) => {
        console.log("onSubmit called with DTO data:", data);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("gameId", data.game);
        formData.append("characterElementId", data.element);
        formData.append("characterWeaponTypeId", data.weapon);
        
        if (data.CharacterStatScaling && data.CharacterStatScaling.length > 0) {
            data.CharacterStatScaling.forEach((cs, index) => {
                formData.append(`CharacterStatScaling[${index}].StatTypeId`, cs.StatTypeId.toString());
                formData.append(`CharacterStatScaling[${index}].Level`, cs.Level.toString());
                formData.append(`CharacterStatScaling[${index}].Value`, cs.Value.toString());
                formData.append(`CharacterStatScaling[${index}].IsBreakpoint`, cs.IsBreakpoint.toString());
            });
        }

        if (data.image) {
            formData.append("image", data.image);
        }
        if (data.icon) {
            formData.append("icon", data.icon);
        }

        console.log("Sending request to:", `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_CHARACTER}`);
        
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_CHARACTER}`, {
            method: "POST",
            body: formData
        }).then(response => {
            console.log("Response received:", response);
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
        
        // Get stat values from the ref and transform them
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

    return (
        <FormProvider {...methods}>
            <Box 
                component="form" 
                onSubmit={handleFormSubmit}
                sx={formStyles.formContainer}
            >
                <Typography {...formStyles.formTitle}>
                    Add Character
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
                        />
                    </Box>

                    <Box sx={formStyles.rightColumn.sx}>
                        <CharacterInfoSection 
                            games={games}
                            elements={elements}
                            weapons={weapons}
                        />
                        
                        <StatScalingSection 
                            statTypes={statTypes}
                            statValuesRef={statValuesRef}
                        />

                        <Button 
                            type="submit" 
                            {...formStyles.submitButton}
                            onClick={(e) => {
                                console.log("Submit button clicked");
                            }}
                        >
                            Add Character
                        </Button>
                    </Box>
                </Box>
            </Box>
        </FormProvider>
    );
}

export default CharacterForm;