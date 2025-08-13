import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { formStyles } from "../formStyles";
import CloseIcon from '@mui/icons-material/Close';
import { useState, useMemo } from "react";
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
            if (character.gameName === filterValue) return true;
            if (character.characterElementName === filterValue) return true;
            if (character.characterWeaponTypeName === filterValue) return true;
            
            return false;
        });
    });
};


const buildCharacterFilterOptions = (characters) => {
    if (!characters || !Array.isArray(characters)) return [];
    
    const filterOptions = [];
    const gameNames = new Set();
    const elementsByGame = new Map();
    const weaponsByGame = new Map();
    
    characters.forEach(character => {
        const { gameName, characterElementName, characterWeaponTypeName } = character;
        
        if (gameName) {
            gameNames.add(gameName);
            
            if (characterElementName) {
                if (!elementsByGame.has(gameName)) {
                    elementsByGame.set(gameName, new Set());
                }
                elementsByGame.get(gameName).add(characterElementName);
            }
            
            if (characterWeaponTypeName) {
                if (!weaponsByGame.has(gameName)) {
                    weaponsByGame.set(gameName, new Set());
                }
                weaponsByGame.get(gameName).add(characterWeaponTypeName);
            }
        }
    });
    
    Array.from(gameNames).sort().forEach(gameName => {
        filterOptions.push({
            value: gameName,
            label: gameName,
            field: 'gameName'
        });
    });
    
    Array.from(elementsByGame.entries()).sort().forEach(([gameName, elements]) => {
        Array.from(elements).sort().forEach(element => {
            filterOptions.push({
                value: element,
                label: element,
                field: 'characterElementName',
                main: gameName
            });
        });
    });
    
    Array.from(weaponsByGame.entries()).sort().forEach(([gameName, weapons]) => {
        Array.from(weapons).sort().forEach(weapon => {
            filterOptions.push({
                value: weapon,
                label: weapon,
                field: 'characterWeaponTypeName',
                main: gameName
            });
        });
    });
    
    return filterOptions;
};

function CharacterSearchDialog() {
    const [open, setOpen] = useState(false)
    const {data: characters, loading: loading, error: error} = useApiCharacter("character_show");

    const characterFilterOptions = useMemo(() => {
        return buildCharacterFilterOptions(characters || []);
    }, [characters]);

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
                        filterOptions={characterFilterOptions}
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