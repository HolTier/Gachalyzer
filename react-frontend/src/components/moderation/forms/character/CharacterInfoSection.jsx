import { Box, FormControl, TextField, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { formStyles, getFormControlProps, getErrorTextProps } from "../formStyles";

function CharacterInfoSection({ 
    games,
    elements,
    weapons 
}) {
    const { register, formState: { errors }, watch } = useFormContext();
    const selectedGameId = watch("game");
    
    const filteredElements = selectedGameId 
        ? elements?.filter(element => element.gameId === selectedGameId) 
        : [];
    
    const filteredWeapons = selectedGameId 
        ? weapons?.filter(weapon => weapon.gameId === selectedGameId) 
        : [];
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

            <FormControl {...getFormControlProps(true, !selectedGameId)}>
                <InputLabel id="element-select">Element</InputLabel>
                <Select
                    {...register("element", { valueAsNumber: true })}
                    labelId="element-select"
                    label="Element"
                    variant="outlined"
                    error={!!errors.element}
                    defaultValue=""
                    autoComplete="off"
                    disabled={!selectedGameId}
                >
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
                <InputLabel id="weapon-select">Weapon</InputLabel>
                <Select
                    {...register("weapon", { valueAsNumber: true })}
                    labelId="weapon-select"
                    label="Weapon"
                    variant="outlined"
                    error={!!errors.weapon}
                    defaultValue=""
                    autoComplete="off"
                    disabled={!selectedGameId}
                >
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