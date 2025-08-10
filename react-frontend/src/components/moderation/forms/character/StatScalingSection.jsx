import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Slider, FormControl, Collapse, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { formStyles, getErrorTextProps, getFormControlProps } from "../formStyles";
import IndependentStatInput from "./IndependentStatInput";

function StatScalingSection({ 
    statTypes,
    statValuesRef
}) {
    const { setValue, getValues, formState: { errors } } = useFormContext();
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
    
    const [breakpointInput, setBreakpointInput] = useState(
        breakpoints.map(b => b.major ? `${b.level}+` : `${b.level}`).join(',')
    );
    const [majorLevelsInput, setMajorLevelsInput] = useState(defaultMajorLevels.join(','));
    const [autoStart, setAutoStart] = useState(1);
    const [autoEnd, setAutoEnd] = useState(90);
    const [autoStep, setAutoStep] = useState(1);
    const [autoAnchor, setAutoAnchor] = useState('');
    const [duplicateMajors, setDuplicateMajors] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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

    const handleAutoFullRange = () => {
        const start = Number(autoStart) || 1;
        const end = Number(autoEnd) || 1;
        const step = Number(autoStep) || 1;
        if (end < start || step <= 0) return;

        const majorSet = new Set(
            majorLevelsInput.split(/[\,\s]+/)
                .map(t=>t.trim())
                .filter(Boolean)
                .map(Number)
                .filter(n=>!isNaN(n) && n>=start && n<=end)
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
        
        // Creating breakpoints with major flag 
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
        
        arr.sort((a,b) => 
            a.level === b.level ? (a.major === b.major ? 0 : a.major ? 1 : -1) 
                : a.level - b.level
        );

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

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <Box>
            <Box sx={formStyles.statScalingSection.sx}>
                <Box 
                    onClick={toggleExpanded}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                        borderRadius: 1,
                        p: 1,
                        mx: -1,
                        transition: 'background-color 0.2s ease-in-out'
                    }}
                >
                    <Box>
                        <Typography {...formStyles.statScalingHeader}>Stat Scalings</Typography>
                        <Typography {...formStyles.statScalingSubheader}>Configure breakpoints (levels) and enter values per level.</Typography>
                    </Box>
                    <IconButton 
                        size="small"
                        sx={{ 
                            transition: 'transform 0.2s ease-in-out',
                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}
                    >
                        <ExpandMore />
                    </IconButton>
                </Box>

                <Collapse in={isExpanded} timeout={300}>
                    <Box sx={{ pt: 2 }}>
                        <Box sx={formStyles.statScalingConfigRow.sx}>
                            <FormControl>
                                <TextField
                                    label="Major Levels"
                                    value={majorLevelsInput}
                                    onChange={e=>setMajorLevelsInput(e.target.value)}
                                    size="small"
                                    helperText="Comma sep majors (e.g. 10,20,30)"
                                    sx={{ minWidth: 300 }}
                                />
                            </FormControl>
                        </Box>

                        <Box sx={formStyles.statScalingAutoRow.sx}>
                            <FormControl>
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
                            </FormControl>
                            <FormControl>
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
                            </FormControl>
                            <FormControl>
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
                            </FormControl>
                            <FormControl>
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
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Breakpoints"
                                    helperText="Use '+' to mark major (e.g. 1,10+,20,20+,30+)"
                                    value={breakpointInput}
                                    onChange={e => setBreakpointInput(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: 200 }}
                                />
                            </FormControl>
                            <FormControlLabel 
                                control={<Checkbox size="small" checked={duplicateMajors} onChange={e=>setDuplicateMajors(e.target.checked)} />} 
                                label="Duplicate majors" 
                                sx={{ ml: 1, alignSelf: 'flex-end', mb: 2 }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 1 }}>
                            <Button 
                                variant="outlined"
                                size="small"
                                onClick={handleBreakpointsApply}
                                sx={{ height: 40 }}
                            >
                                Apply
                            </Button>
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
                                        key={`${st.id}-${breakpointKey}`}
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
                </Collapse>
            </Box>
        </Box>
    )
}

export default StatScalingSection;