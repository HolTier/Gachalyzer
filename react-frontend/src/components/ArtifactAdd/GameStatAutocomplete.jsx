import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";

function GameStatAutocomplete({apiGameData, value, onChangeValue}) {
    const selectedOption = apiGameData?.find(opt => opt.name === value) || null;

    useEffect(() => {
        console.log("V " +value);
    })

    return (
        <Autocomplete 
            value={selectedOption}
            onChange={(event, newValue) => onChangeValue(newValue ? newValue.name : "")}
            disablePortal
            options={apiGameData || []}
            getOptionLabel={(option) => option?.name || ""}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={value || "Select Stat"}
                    placeholder={value || ""}
                />
                )}
            isOptionEqualToValue={(option, value) => option?.name === value}
        />
    );
}

export default GameStatAutocomplete;