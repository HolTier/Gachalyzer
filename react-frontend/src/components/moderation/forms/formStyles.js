export const formStyles = {
  formContainer: {
    maxWidth: 900,
    mx: "auto",
    p: 3
  },

  formLayout: {
    sx: {
      display: 'flex',
      gap: 4,
      alignItems: 'flex-start'
    }
  },

  leftColumn: {
    sx: {
      flex: '0 0 300px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  },

  rightColumn: {
    sx: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  },

  formTitle: {
    variant: "h5",
    gutterBottom: true
  },

  formControl: {
    fullWidth: true,
    sx: { mb: 2 }
  },

  formControlSpaced: {
    fullWidth: true,
    sx: { mb: 3 }
  },

  formControlDisabled: {
    fullWidth: true,
    sx: { 
      mb: 2,
      '& .MuiInputLabel-root': {
        color: 'text.disabled'
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'action.disabledBackground',
        '& fieldset': {
          borderColor: 'action.disabled'
        },
        '&:hover fieldset': {
          borderColor: 'action.disabled'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'action.disabled'
        }
      },
      '& .MuiSelect-root': {
        backgroundColor: 'action.disabledBackground',
        color: 'text.disabled'
      }
    }
  },

  formControlSpacedDisabled: {
    fullWidth: true,
    sx: { 
      mb: 3,
      '& .MuiInputLabel-root': {
        color: 'text.disabled'
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'action.disabledBackground',
        '& fieldset': {
          borderColor: 'action.disabled'
        },
        '&:hover fieldset': {
          borderColor: 'action.disabled'
        },
        '&.Mui-focused fieldset': {
          borderColor: 'action.disabled'
        }
      },
      '& .MuiSelect-root': {
        backgroundColor: 'action.disabledBackground',
        color: 'text.disabled'
      }
    }
  },

  errorText: {
    variant: "caption",
    color: "error",
    sx: { mt: 0.5 }
  },

  sectionTitle: {
    variant: "subtitle1",
    sx: { mb: 1, fontWeight: 600 }
  },

  helperText: {
    variant: "body2",
    color: "text.secondary",
    sx: { mb: 2 }
  },

  submitButton: {
    type: "submit",
    variant: "contained",
    fullWidth: true,
    size: "large",
    sx: { mt: 2 }
  },

  fileSection: {
    sx: { mb: 3 }
  },

  iconSection: {
    sx: { mb: 3 }
  },

  filePreviewContainer: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 200,
      mx: 'auto'
    }
  },

  iconPreviewContainer: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 120,
      mx: 'auto'
    }
  },

  filePreviewPaper: {
    elevation: 1,
    sx: {
      position: 'relative',
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      width: 200,
      height: 240,
      mb: 2
    }
  },

  iconPreviewPaper: {
    elevation: 1,
    sx: {
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      width: 120,
      height: 120,
      mb: 2
    }
  },

  fileImageContainer: {
    sx: { position: 'relative', width: '100%', height: 200 }
  },

  iconImageContainer: {
    sx: { position: 'relative', width: '100%', height: '100%' }
  },

  filePreviewImage: {
    variant: "square",
    sx: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
      objectFit: 'cover'
    }
  },

  iconPreviewImage: {
    variant: "circular",
    sx: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },

  removeFileButton: {
    size: "small",
    sx: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'error.main',
      color: 'error.contrastText',
      width: 32,
      height: 32,
      '&:hover': {
        backgroundColor: 'error.dark',
        transform: 'scale(1.1)',
      },
      boxShadow: 2,
      transition: 'all 0.2s ease-in-out',
    }
  },

  fileInfoContainer: {
    sx: { p: 1.5, backgroundColor: 'background.paper', height: 40 }
  },

  iconInfoContainer: {
    sx: { 
      p: 1, 
      backgroundColor: 'background.paper', 
      textAlign: 'center',
      mt: 1,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider'
    }
  },

  fileName: {
    variant: "caption",
    sx: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 500,
      color: 'text.primary',
      fontSize: '0.75rem'
    }
  },

  fileSize: {
    variant: "caption",
    sx: {
      color: 'text.secondary',
      fontSize: '0.7rem',
    }
  },

  fileActionsContainer: {
    sx: { display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }
  },

  fileActionButton: {
    variant: "outlined",
    size: "small"
  },

  closeIcon: {
    sx: { fontSize: 18 }
  },

  statScalingSection: {
    sx: {
      p: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      mt: 2
    }
  },
  statScalingHeader: {
    variant: 'subtitle1',
    sx: { fontWeight: 600 }
  },
  statScalingSubheader: {
    variant: 'body2',
    color: 'text.secondary'
  },
  statScalingSliderBox: {
    sx: { px: 1 }
  },
  statScalingInputsContainer: {
    sx: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
      gap: 2
    }
  },
  statScalingConfigRow: {
    sx: {
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    }
  },
  statScalingInput: {
    fullWidth: true,
    size: 'small'
  },
  statScalingAutoRow: {
    sx: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1.5,
      alignItems: 'flex-end'
    }
  },
  statScalingAutoNumberField: {
    size: 'small',
    sx: { width: 80 }
  },
  statScalingButton: {
    variant: 'outlined',
    size: 'small',
    sx: { alignSelf: 'flex-end', height: 40 }
  },
  statScalingStatLabel: {
    variant: 'caption',
    sx: { display: 'block', mb: 0.5, fontWeight: 500 }
  },
  statScalingLevelBadge: {
    variant: 'overline',
    sx: { fontSize: '0.65rem', color: 'text.secondary' }
  },

  searchContainer: {
    sx: {
      display: 'flex',
      gap: 2,
      mb: 3,
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    }
  },

  searchField: {
    sx: { flex: 1, minWidth: 200 }
  },

  filterField: {
    sx: { minWidth: 150 }
  },

  resultsHeader: {
    sx: {
      mb: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },

  resultsCounter: {
    variant: "body2",
    color: "text.secondary"
  },

  activeFilters: {
    sx: {
      display: 'flex',
      gap: 1
    }
  },

  tableContainer: {
    elevation: 1
  },

  tableContainerFixed: {
    elevation: 1,
    sx: {
      maxHeight: 400,
      overflow: 'auto'
    }
  },

  tableHeader: {
    sx: {
      fontWeight: 600,
      backgroundColor: 'action.hover'
    }
  },

  tableHeaderFixed: {
    sx: {
      fontWeight: 600,
      backgroundColor: 'primary.dark',
      color: 'primary.contrastText',
      borderBottom: '2px solid',
      borderBottomColor: 'divider',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }
  },

  tableActionsHeader: {
    sx: {
      fontWeight: 600,
      backgroundColor: 'action.hover',
      width: 120,
      textAlign: 'center'
    }
  },

  tableActionsCell: {
    sx: { textAlign: 'center' }
  },

  tableActions: {
    sx: {
      display: 'flex',
      gap: 0.5,
      justifyContent: 'center'
    }
  },

  emptyTableCell: {
    sx: {
      textAlign: 'center',
      py: 4
    }
  },

  emptyTableText: {
    color: "text.secondary"
  },

  paginationContainer: {
    sx: { mt: 2 }
  },

  dialog: {
    maxWidth: 'lg',
    fullWidth: true
  },

  dialogTitle: {
    sx: {
      fontWeight: 600,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }
  },

  dialogContent: {
    sx: {
      p: 3,
      height: 600,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  },

  dialogCloseButton: {
    sx: {
      position: "absolute",
      right: 8,
      top: 8,
      color: 'text.secondary'
    }
  },

  scrollableTableContainer: {
    elevation: 1,
    sx: {
      flex: 1,
      overflow: 'auto',
      minHeight: 300
    }
  },

  dialogEntrySearcherContainer: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      overflow: 'hidden'
    }
  }
};

/**
 * Helper function to get form control props with consistent spacing
 * @param {boolean} spaced - Whether to use extra spacing (for selects, etc.)
 * @param {boolean} disabled - Whether the field is disabled/blocked
 */
export const getFormControlProps = (spaced = false, disabled = false) => {
  if (disabled && spaced) return formStyles.formControlSpacedDisabled;
  if (disabled) return formStyles.formControlDisabled;
  if (spaced) return formStyles.formControlSpaced;
  return formStyles.formControl;
};

/**
 * Helper function to get error text props
 * @param {Object} error - The error object from react-hook-form
 */
export const getErrorTextProps = (error) => {
  if (!error) return null;
  return {
    ...formStyles.errorText,
    children: error.message
  };
};