import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormControl, TextField, Box, Typography, Button, IconButton, Paper, Avatar, InputLabel, Select, MenuItem, Slider, Checkbox, FormControlLabel } from "@mui/material"
import SingleFileDropzone from "./SingleFileDropzone"
import { createFileHandlers, createIconHandlers, formatFileSize } from "./fileUtils"
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react"
import { Close, Image } from "@mui/icons-material"
import { useApiGame } from "../../../hooks/useApiGame"
import { formStyles, getFormControlProps, getErrorTextProps } from "./formStyles"
import { API_CONFIG } from "../../../config/api"

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const schema = yup.object({
    name: yup.string().required("Name is required"),
    game: yup.number().typeError("Game is required").required("Game is required"),
    element: yup.number().typeError("Element is required").required("Element is required"),
    weapon: yup.number().typeError("Weapon is required").required("Weapon is required"),
    CharacterStatScaling: yup.array().of(
        yup.object({
            StatTypeId: yup.number().required("Stat type is required"),
            Level: yup.number().required("Level is required"),
            Value: yup.number().typeError("Value must be a number").required("Value is required"),
            IsBreakpoint: yup.boolean().typeError("Breakpoint must be a number").required("Breakpoint is required"),
        })
    ).optional(),
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
                !value || (value instanceof File && supportedImageTypes.includes(value.type))
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
                !value || (value instanceof File && supportedImageTypes.includes(value.type))
        ),
});

const IndependentStatInput = memo(({ statType, currentBreakpoint, initialValue, onValueChange }) => {
    const [localValue, setLocalValue] = useState(initialValue || '');
    
    useEffect(() => {
        setLocalValue(initialValue || '');
    }, [initialValue, currentBreakpoint]);
    
    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onValueChange(statType.id, currentBreakpoint, newValue);
    }, [statType.id, currentBreakpoint, onValueChange]);

    const displayLevel = currentBreakpoint.major ? `${currentBreakpoint.level}+` : currentBreakpoint.level;

    return (
        <Box>
            <Typography {...formStyles.statScalingStatLabel}>{statType.name}</Typography>
            <TextField
                {...formStyles.statScalingInput}
                type="number"
                slotProps={{ 
                    htmlInput: {step: 'any'} 
                }}
                value={localValue}
                onChange={handleChange}
                placeholder={`Value @ L${displayLevel}`}
                variant="outlined"
            />
        </Box>
    );
});

IndependentStatInput.displayName = 'IndependentStatInput';

function CharacterForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            statScalings: []
        }
    });

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
    
    const defaultBreakpoints = useMemo(() => Array.from({length:10}, (_,i)=> i===0 ? 1 : i*10), []);
    const defaultMajorLevels = useMemo(()=> [10,20,30,40,50,60,70,80,90], []);
    const [breakpoints, setBreakpoints] = useState(
        defaultBreakpoints.map(l => ({ level: l, major: defaultMajorLevels.includes(l) }))
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentBreakpoint = breakpoints[currentIndex] || { level: 1, major: false };
    const currentLevel = currentBreakpoint.level;

    const levelMarks = useMemo(() => {
        return breakpoints
            .map((bp, idx) => ({ ...bp, idx }))
            .filter(bp => bp.idx === 0 || bp.idx === breakpoints.length -1 || bp.major)
            .filter((bp, _, arr) => {
                const duplicates = breakpoints.filter(b => b.level === bp.level);
                if (duplicates.length > 1) return bp.major;
                return true;
            })
            .map(bp => ({ value: bp.idx, label: bp.level + '' }));
    }, [breakpoints]);

    useEffect(() => {
        if (statTypes && statTypes.length > 0) {
            const existing = getValues('statScalings');
            if (!existing || existing.length === 0) {
                const init = statTypes.map(st => ({ statTypeId: st.id, values: {} }));
                setValue('statScalings', init, { shouldValidate: false });
            } else {
                const byId = Object.fromEntries(existing.map(e => [e.statTypeId, e]));
                const merged = statTypes.map(st => byId[st.id] || { statTypeId: st.id, values: {} });
                setValue('statScalings', merged, { shouldValidate: false });
            }
        }
    }, [statTypes, getValues, setValue]);

    const statValuesRef = useRef(new Map());
    
    useEffect(() => {
        if (statTypes) {
            const existing = getValues('statScalings') || [];
            const newMap = new Map();
            
            statTypes.forEach(st => {
                const existingStat = existing.find(s => s.statTypeId === st.id);
                newMap.set(st.id, existingStat?.values || {});
            });
            
            statValuesRef.current = newMap;
        }
    }, [statTypes, getValues]);

    const handleSliderChange = (_, idx) => {
        setCurrentIndex(idx);
    };

    const handleStatValueChange = useCallback((statTypeId, breakpoint, newValue) => {
        const currentValues = statValuesRef.current.get(statTypeId) || {};
        const breakpointKey = breakpoint.major ? `${breakpoint.level}+` : `${breakpoint.level}`;
        const updatedValues = { ...currentValues, [breakpointKey]: newValue };
        statValuesRef.current.set(statTypeId, updatedValues);
        
        const timeoutId = setTimeout(() => {
            const updatedStatScalings = Array.from(statValuesRef.current.entries()).map(([statTypeId, values]) => ({
                statTypeId,
                values
            }));
            setValue('statScalings', updatedStatScalings, { shouldValidate: false });
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [setValue]);

    const [breakpointInput, setBreakpointInput] = useState(
        breakpoints.map(b => b.major ? `${b.level}+` : `${b.level}`).join(',')
    );
    const [majorLevelsInput, setMajorLevelsInput] = useState(defaultMajorLevels.join(','));
    const parseBreakpoints = (text) => {
        const tokens = text.split(/[\,\s]+/).map(t=>t.trim()).filter(Boolean);
        const result = [];
        const seenCombo = new Set();
        for (const token of tokens) {
            const isMajor = token.endsWith('+');
            const numStr = isMajor ? token.slice(0,-1) : token;
            const level = Number(numStr);
            if (isNaN(level) || level < 1) continue;
            const key = level + '|' + (isMajor? '1':'0');
            if (seenCombo.has(key)) continue;
            seenCombo.add(key);
            result.push({ level, major: isMajor });
        }

        result.sort((a,b)=> a.level === b.level ? (a.major === b.major ? 0 : a.major ? 1 : -1) : a.level - b.level);
        return result;
    };
    const handleBreakpointsApply = () => {
        const parsed = parseBreakpoints(breakpointInput);
        if (parsed.length === 0) return;
        setBreakpoints(parsed);
        setBreakpointInput(parsed.map(b => b.major ? `${b.level}+` : `${b.level}`).join(','));
        setCurrentIndex(idx => Math.min(idx, parsed.length -1));
    };

    const [autoStart, setAutoStart] = useState(1);
    const [autoEnd, setAutoEnd] = useState(90);
    const [autoStep, setAutoStep] = useState(1);
    const [autoAnchor, setAutoAnchor] = useState('');
    const [duplicateMajors, setDuplicateMajors] = useState(false);
    const handleAutoFullRange = () => {
        const start = Number(autoStart) || 1;
        const end = Number(autoEnd) || 1;
        const step = Number(autoStep) || 1;
        if (end < start || step <= 0) return;

        const majorSet = new Set(
            majorLevelsInput.split(/[\,\s]+/).map(t=>t.trim()).filter(Boolean).map(Number).filter(n=>!isNaN(n) && n>=start && n<=end)
        );

        const seq = [];
        seq.push(start);
        const anchorNum = Number(autoAnchor);
        if (!isNaN(anchorNum) && anchorNum > 0) {
            let firstAligned = Math.ceil((start + 1) / anchorNum) * anchorNum;
            if (firstAligned <= end) {
                seq.push(firstAligned);
            }
            
            let current = seq[seq.length - 1];
            while (true) {
                const next = current + step;
                if (next > end) break;
                seq.push(next);
                current = next;
            }
        } else {
            
            let current = start;
            while (true) {
                const next = current + step;
                if (next > end) break;
                seq.push(next);
                current = next;
            }
        }
        
        const arr = [];
        for (const v of seq) {
            const isMarkedMajor = majorSet.has(v);
            if (duplicateMajors && isMarkedMajor && v !== start && v !== end) {
                arr.push({ level: v, major: false });
                arr.push({ level: v, major: true });
            } else {
                arr.push({ level: v, major: isMarkedMajor && v !== start && v !== end });
            }
        }
        
        arr.sort((a,b)=> a.level === b.level ? (a.major === b.major ? 0 : a.major ? 1 : -1) : a.level - b.level);
        setBreakpoints(arr);
        const serialized = arr.map(b => {
            const duplicates = arr.filter(x => x.level === b.level);
            if (duplicates.length > 1) {
                const majorEntries = duplicates.filter(d => d.major);
                if (duplicateMajors && majorEntries.length > 0) {
                    if (b.major) return `${b.level}+`;
                    return `${b.level}`;
                }
            }
            if (b.major && b.level !== start && b.level !== end) return `${b.level}+`;
            return `${b.level}`;
        }).join(',');
        setBreakpointInput(serialized);
        setCurrentIndex(0);
    };

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

    return (
        <Box 
            component="form" 
            onSubmit={(e) => {
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
                
                schema.validate(transformedData)
                    .then((validData) => {
                        console.log("Validation passed, calling onSubmit");
                        onSubmit(validData);
                    })
                    .catch((validationError) => {
                        console.log("Validation failed:", validationError);
                    });
            }} 
            sx={formStyles.formContainer}
        >
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

                    <FormControl {...getFormControlProps(true)}>
                        <InputLabel id="element-select">Element</InputLabel>
                        <Select
                            {...register("element", { valueAsNumber: true })}
                            labelId="element-select"
                            label="Element"
                            variant="outlined"
                            error={!!errors.element}
                            defaultValue=""
                            autoComplete="off"
                        >
                            {elements?.map((element) => (
                                <MenuItem key={element.id} value={element.id}>
                                    {element.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.element && (
                            <Typography {...getErrorTextProps(errors.element)} />
                        )}
                    </FormControl>

                    <FormControl {...getFormControlProps(true)}>
                        <InputLabel id="weapon-select">Weapon</InputLabel>
                        <Select
                            {...register("weapon", { valueAsNumber: true })}
                            labelId="weapon-select"
                            label="Weapon"
                            variant="outlined"
                            error={!!errors.weapon}
                            defaultValue=""
                            autoComplete="off"
                        >
                            {weapons?.map((weapon) => (
                                <MenuItem key={weapon.id} value={weapon.id}>
                                    {weapon.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.weapon && (
                            <Typography {...getErrorTextProps(errors.weapon)} />
                        )}
                    </FormControl>

                    <Box sx={formStyles.statScalingSection.sx}>
                        <Typography {...formStyles.statScalingHeader}>Stat Scalings</Typography>
                        <Typography {...formStyles.statScalingSubheader}>Configure breakpoints (levels) and enter values per level.</Typography>
                        <Box sx={formStyles.statScalingConfigRow.sx}>
                            <TextField
                                label="Breakpoints"
                                helperText="Use '+' to mark major (e.g. 1,10+,20,20+,30+)"
                                value={breakpointInput}
                                onChange={e => setBreakpointInput(e.target.value)}
                                size="small"
                                sx={{ minWidth: 300 }}
                            />
                            <Button {...formStyles.statScalingButton} onClick={handleBreakpointsApply}>Apply</Button>
                        </Box>
                        <Box sx={formStyles.statScalingAutoRow.sx}>
                            <TextField
                                {...formStyles.statScalingAutoNumberField}
                                type="number"
                                label="Start"
                                value={autoStart}
                                onChange={e=>setAutoStart(e.target.value)}
                                slotProps={{
                                    htmlInput: {min:0}
                                }}
                            />
                            <TextField
                                {...formStyles.statScalingAutoNumberField}
                                type="number"
                                label="End"
                                value={autoEnd}
                                onChange={e=>setAutoEnd(e.target.value)}
                                slotProps={{
                                    htmlInput: {min:0}
                                }}
                            />
                            <TextField
                                {...formStyles.statScalingAutoNumberField}
                                type="number"
                                label="Step"
                                value={autoStep}
                                onChange={e=>setAutoStep(e.target.value)}
                                slotProps={{
                                    htmlInput: {min:0}
                                }}
                            />
                            <TextField
                                {...formStyles.statScalingAutoNumberField}
                                type="number"
                                label="Anchor"
                                value={autoAnchor}
                                onChange={e=>setAutoAnchor(e.target.value)}
                                slotProps={{
                                    htmlInput: {min:0}
                                }}
                            />
                            <TextField
                                label="Major Levels"
                                value={majorLevelsInput}
                                onChange={e=>setMajorLevelsInput(e.target.value)}
                                size="small"
                                helperText="Comma sep majors (e.g. 10,20,30)"
                                sx={{ minWidth: 180 }}
                            />
                            <FormControlLabel 
                                control={<Checkbox size="small" checked={duplicateMajors} onChange={e=>setDuplicateMajors(e.target.checked)} />} 
                                label="Duplicate majors" 
                                sx={{ ml: 1 }}
                            />
                            <Button {...formStyles.statScalingButton} onClick={handleAutoFullRange}>Auto Generate</Button>
                        </Box>
                        <Box sx={formStyles.statScalingSliderBox.sx}>
                            <Typography {...formStyles.statScalingLevelBadge}>
                                Level: {currentBreakpoint.major ? `${currentLevel}+` : currentLevel}
                            </Typography>
                            <Slider
                                value={currentIndex}
                                min={0}
                                max={breakpoints.length - 1}
                                step={1}
                                marks={levelMarks}
                                onChange={handleSliderChange}
                                valueLabelDisplay="off"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                        <Box sx={formStyles.statScalingInputsContainer.sx}>
                            {statTypes?.map(st => {
                                const currentValues = statValuesRef.current.get(st.id) || {};
                                const breakpointKey = currentBreakpoint.major ? `${currentLevel}+` : `${currentLevel}`;
                                const initialValue = currentValues[breakpointKey] ?? '';
                                return (
                                    <IndependentStatInput
                                        key={`${st.id}-${breakpointKey}`} // Force re-mount on breakpoint change
                                        statType={st}
                                        currentBreakpoint={currentBreakpoint}
                                        initialValue={initialValue}
                                        onValueChange={handleStatValueChange}
                                    />
                                );
                            })}
                        </Box>
                        {errors.statScalings && (
                            <Typography {...getErrorTextProps(errors.statScalings)} />
                        )}
                    </Box>

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
    );
}

export default CharacterForm;