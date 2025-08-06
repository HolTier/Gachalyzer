export const formStyles = {
  formContainer: {
    maxWidth: 600,
    mx: "auto",
    p: 3
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

  filePreviewContainer: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 200,
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

  fileImageContainer: {
    sx: { position: 'relative', width: '100%', height: 200 }
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

  removeFileButton: {
    size: "small",
    sx: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'error.main',
      color: 'white',
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
  }
};

/**
 * Helper function to get form control props with consistent spacing
 * @param {boolean} spaced - Whether to use extra spacing (for selects, etc.)
 */
export const getFormControlProps = (spaced = false) => {
  return spaced ? formStyles.formControlSpaced : formStyles.formControl;
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