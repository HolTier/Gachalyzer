import { Box, Typography, TextField, FormControl } from "@mui/material";
import { useState, useEffect, useCallback, memo } from "react";
import { useFormContext } from "react-hook-form";
import { formStyles, getFormControlProps } from "../formStyles";

const IndependentStatInput = memo(({ statType, currentBreakpoint, initialValue, onValueChange }) => {
    const { formState: { errors } } = useFormContext();
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
        <FormControl {...getFormControlProps()}>
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
                fullWidth
            />
        </FormControl>
    );
});

IndependentStatInput.displayName = 'IndependentStatInput';

export default IndependentStatInput;
