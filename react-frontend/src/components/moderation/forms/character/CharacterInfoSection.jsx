import React from "react";
import { Box, FormControl, TextField, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { formStyles, getFormControlProps, getErrorTextProps } from "../formStyles";
import CharacterSearchDialog from "./CharacterSearchDialog";

function CharacterInfoSection({ 
    games,
    elements,
    weapons,
    setCharacter,
    setUpdate
}) {
    const { register, formState: { errors }, watch, setValue } = useFormContext();
    const selectedGameId = watch("game");
    const selectedElementId = watch("element");
    const selectedWeaponId = watch("weapon");
    
    const filteredElements = selectedGameId 
        ? elements?.filter(element => element.gameId === selectedGameId) 
        : [];
    
    const filteredWeapons = selectedGameId 
        ? weapons?.filter(weapon => weapon.gameId === selectedGameId) 
        : [];

    React.useEffect(() => {
        if (selectedGameId && filteredElements.length > 0) {
            const isElementValid = filteredElements.some(e => e.id === selectedElementId);
            if (selectedElementId && !isElementValid) {
                setValue("element", "", { shouldValidate: false });
            }
        } else if (!selectedGameId && selectedElementId) {
            setValue("element", "", { shouldValidate: false });
        }
    }, [selectedGameId, filteredElements, selectedElementId, setValue]);

    React.useEffect(() => {
        if (selectedGameId && filteredWeapons.length > 0) {
            const isWeaponValid = filteredWeapons.some(w => w.id === selectedWeaponId);
            if (selectedWeaponId && !isWeaponValid) {
                setValue("weapon", "", { shouldValidate: false });
            }
        } else if (!selectedGameId && selectedWeaponId) {
            setValue("weapon", "", { shouldValidate: false });
        }
    }, [selectedGameId, filteredWeapons, selectedWeaponId, setValue]);
    return (
        <Box>
            <FormControl {...getFormControlProps()}>
                <TextField
                    {...register("name")} 
                    label="Character Name"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoComplete="off"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Or manage existing characters:
                </Typography>
                <CharacterSearchDialog
                    setCharacter={setCharacter}
                    setUpdate={setUpdate}
                />
            </Box>

            <FormControl {...getFormControlProps(true)}>
                <InputLabel id="game-select" shrink>Game</InputLabel>
                <Select
                    {...register("game", { valueAsNumber: true })}
                    labelId="game-select"
                    label="Game"
                    variant="outlined"
                    error={!!errors.game}
                    value={watch("game") || ""}
                    autoComplete="off"
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Select a game</em>
                    </MenuItem>
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

            <FormControl {...getFormControlProps(true, !selectedGameId)}>
                <InputLabel id="element-select" shrink>Element</InputLabel>
                <Select
                    {...register("element", { valueAsNumber: true })}
                    labelId="element-select"
                    label="Element"
                    variant="outlined"
                    error={!!errors.element}
                    value={watch("element") || ""}
                    autoComplete="off"
                    disabled={!selectedGameId}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Select an element</em>
                    </MenuItem>
                    {filteredElements?.map((element) => (
                        <MenuItem key={element.id} value={element.id}>
                            {element.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.element && (
                    <Typography {...getErrorTextProps(errors.element)} />
                )}
            </FormControl>

            <FormControl {...getFormControlProps(true, !selectedGameId)}>
                <InputLabel id="weapon-select" shrink>Weapon</InputLabel>
                <Select
                    {...register("weapon", { valueAsNumber: true })}
                    labelId="weapon-select"
                    label="Weapon"
                    variant="outlined"
                    error={!!errors.weapon}
                    value={watch("weapon") || ""}
                    autoComplete="off"
                    disabled={!selectedGameId}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Select a weapon</em>
                    </MenuItem>
                    {filteredWeapons?.map((weapon) => (
                        <MenuItem key={weapon.id} value={weapon.id}>
                            {weapon.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.weapon && (
                    <Typography {...getErrorTextProps(errors.weapon)} />
                )}
            </FormControl>
        </Box>
    )
}

export default CharacterInfoSection;