export const filterDialogStyles = {
    dialog: {
        maxWidth: 'md',
        fullWidth: true
    },
    
    dialogTitle: {
        sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 600,
            position: 'relative'
        }
    },
    
    dialogContent: {
        sx: {
            p: 0,
            backgroundColor: 'background.default',
            minHeight: 400,
            maxHeight: 500,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    
    closeButton: {
        sx: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'primary.contrastText'
        }
    },
    
    categoryContainer: {
        sx: {
            flex: 1,
            overflow: 'auto',
            p: 2
        }
    },
    
    categorySection: {
        sx: {
            mb: 3,
            '&:last-child': { mb: 0 }
        }
    },
    
    categoryHeader: {
        sx: {
            p: 1.5,
            backgroundColor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 1,
            mx: -2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'action.selected'
            }
        }
    },
    
    subcategoryHeader: {
        sx: {
            p: 1.5,
            pl: 4,
            backgroundColor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            opacity: 0.9,
            '&:hover': {
                backgroundColor: 'action.selected'
            }
        }
    },
    
    categoryTitle: {
        variant: 'subtitle1',
        sx: {
            fontWeight: 600,
            color: 'text.primary'
        }
    },
    
    categoryCount: {
        sx: {
            color: 'text.secondary',
            fontSize: '0.875rem',
            ml: 'auto'
        }
    },
    
    optionsGrid: {
        sx: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 0.5,
            pl: 4,
            pr: 1,
            pb: 1
        }
    },
    
    optionItem: {
        sx: {
            '& .MuiFormControlLabel-root': {
                margin: 0,
                width: '100%',
                '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            },
            '& .MuiCheckbox-root': {
                padding: '4px 8px'
            }
        }
    },
    
    dialogActions: {
        sx: {
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            p: 2,
            gap: 2,
            justifyContent: 'space-between'
        }
    },
    
    selectedCounter: {
        sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary'
        }
    },
    
    actionButtons: {
        sx: {
            display: 'flex',
            gap: 1
        }
    },
    
    clearButton: {
        variant: 'outlined',
        color: 'secondary'
    },
    
    applyButton: {
        variant: 'contained',
        color: 'primary'
    }
};
