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