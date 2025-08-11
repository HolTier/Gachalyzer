import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { formStyles } from "../formStyles";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import EntrySearcher from "../EntrySearcher";
import { useApiCharacter } from "../../../../hooks/useApiCharacter";

const headers = [
    { key: 'iconUrl', label: 'Icon', type: 'image', width: 60 },
    { key: 'name', label: 'Name' },
    { key: 'gameName', label: 'Game' },
    { key: 'characterElementName', label: 'Element' },
    { key: 'characterWeaponTypeName', label: 'Weapon' },
]

const CharacterSearch = (searchTerms, currentSearchTerm, searchField, characters) => {
    const allTerms = [...searchTerms];
    if (currentSearchTerm && currentSearchTerm.trim()) {
        allTerms.push(currentSearchTerm.trim());
    }
    
    if (allTerms.length === 0) return characters;
    
    return characters.filter(character => {
        // All search terms must match (AND logic)
        return allTerms.every(term => {
            const searchLower = term.toLowerCase();
            
            if (searchField === 'all') {
                // Search across all fields
                return (
                    character.name?.toLowerCase().includes(searchLower) ||
                    character.gameName?.toLowerCase().includes(searchLower) ||
                    character.characterElementName?.toLowerCase().includes(searchLower) ||
                    character.characterWeaponTypeName?.toLowerCase().includes(searchLower)
                );
            } else {
                // Search in specific field
                const value = character[searchField];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            }
        });
    });
};

const CharacterFilter = (filterValues, characters) => {
    if (!filterValues || !filterValues.length) return characters;
    
    return characters.filter(character => {
        return filterValues.some(filterValue => {
            // Check which field this filter value belongs to
            const filterOption = CharacterFilterOptions.find(opt => opt.value === filterValue);
            const field = filterOption?.field || 'gameName';
            
            return character[field] === filterValue;
        });
    });
};

// for testing
const CharacterFilterOptions = [
    // Game filters - main categories
    { value: 'Genshin Impact', label: 'Genshin Impact', field: 'gameName' },
    { value: 'Honkai: Star Rail', label: 'Honkai: Star Rail', field: 'gameName' },
    { value: 'Wuthering Waves', label: 'Wuthering Waves', field: 'gameName' },
    { value: 'Zenless Zone Zero', label: 'Zenless Zone Zero', field: 'gameName' },
    
    // Genshin Impact Elements
    { value: 'Pyro', label: 'Pyro', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Hydro', label: 'Hydro', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Electro', label: 'Electro', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Cryo', label: 'Cryo', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Anemo', label: 'Anemo', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Geo', label: 'Geo', field: 'characterElementName', main: 'Genshin Impact' },
    { value: 'Dendro', label: 'Dendro', field: 'characterElementName', main: 'Genshin Impact' },
    
    // Genshin Impact Weapons
    { value: 'Sword', label: 'Sword', field: 'characterWeaponTypeName', main: 'Genshin Impact' },
    { value: 'Claymore', label: 'Claymore', field: 'characterWeaponTypeName', main: 'Genshin Impact' },
    { value: 'Polearm', label: 'Polearm', field: 'characterWeaponTypeName', main: 'Genshin Impact' },
    { value: 'Bow', label: 'Bow', field: 'characterWeaponTypeName', main: 'Genshin Impact' },
    { value: 'Catalyst', label: 'Catalyst', field: 'characterWeaponTypeName', main: 'Genshin Impact' },
    
    // Honkai: Star Rail Elements (example)
    { value: 'Physical', label: 'Physical', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Fire', label: 'Fire', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Ice', label: 'Ice', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Lightning', label: 'Lightning', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Wind', label: 'Wind', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Quantum', label: 'Quantum', field: 'characterElementName', main: 'Honkai: Star Rail' },
    { value: 'Imaginary', label: 'Imaginary', field: 'characterElementName', main: 'Honkai: Star Rail' },
    
    // Wuthering Waves Elements (example)
    { value: 'Aero', label: 'Aero', field: 'characterElementName', main: 'Wuthering Waves' },
    { value: 'Glacio', label: 'Glacio', field: 'characterElementName', main: 'Wuthering Waves' },
    { value: 'Fusion', label: 'Fusion', field: 'characterElementName', main: 'Wuthering Waves' },
    { value: 'Electro', label: 'Electro', field: 'characterElementName', main: 'Wuthering Waves' },
    { value: 'Havoc', label: 'Havoc', field: 'characterElementName', main: 'Wuthering Waves' },
    { value: 'Spectro', label: 'Spectro', field: 'characterElementName', main: 'Wuthering Waves' }
];

function CharacterSearchDialog() {
    const [open, setOpen] = useState(false)
    const {data: characters, loading: loading, error: error} = useApiCharacter("character_show");

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleEdit = () => {
        console.log("edit")
    }

    const handleRemove = () => {
        console.log("Remove")
    }

    return (
        <>
            <Tooltip title="View, edit, or remove existing characters" placement="top">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleOpen}
                    sx={{ 
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem'
                    }}
                >
                    Manage
                </Button>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                {...formStyles.dialog}
            >
                <DialogTitle {...formStyles.dialogTitle}>
                    Character Search
                </DialogTitle>
                
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    {...formStyles.dialogCloseButton}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent {...formStyles.dialogContent}>
                    <EntrySearcher
                        data={characters || []}
                        headers={headers}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                        customSearch={CharacterSearch}
                        customFilter={CharacterFilter}
                        filterOptions={CharacterFilterOptions}
                        title="Character Manager"
                        searchPlaceholder="Search characters..."
                        showPagination={true}
                        defaultRowsPerPage={25}
                        tableContainerStyle={formStyles.scrollableTableContainer}
                        containerStyle={formStyles.dialogEntrySearcherContainer}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CharacterSearchDialog;