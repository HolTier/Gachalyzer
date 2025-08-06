import { createTheme } from '@mui/material/styles';

// dark
export const darkFormTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff',
      dark: '#1f6feb',
      light: '#79c0ff'
    },
    secondary: {
      main: '#f85149',
      dark: '#da3633',
      light: '#ff7b72'
    },
    background: {
      default: '#22272e',
      paper: '#2d333b'
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#c9d1d9'
    },
    error: {
      main: '#f85149',
      dark: '#da3633'
    },
    divider: '#444c56'
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d333b',
          borderBottom: '1px solid #444c56',
          boxShadow: 'none'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#c9d1d9',
          '&:hover': {
            backgroundColor: '#21262d',
            color: '#58a6ff'
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#c9d1d9'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#444c56'
            },
            '&:hover fieldset': {
              borderColor: '#58a6ff'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#58a6ff'
            }
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: '#f0f6fc',
          '&:before': {
            borderBottomColor: '#444c56'
          },
          '&:hover:before': {
            borderBottomColor: '#58a6ff'
          },
          '&:after': {
            borderBottomColor: '#58a6ff'
          }
        }
      }
    }
  }
});

// Light
export const lightFormTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0969da',
      dark: '#0550ae',
      light: '#218bff'
    },
    secondary: {
      main: '#cf222e',
      dark: '#a40e26',
      light: '#ff6b6b'
    },
    background: {
      default: '#ffffff',
      paper: '#f6f8fa'
    },
    text: {
      primary: '#24292f',
      secondary: '#656d76'
    },
    error: {
      main: '#cf222e',
      dark: '#a40e26'
    },
    divider: '#d0d7de'
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f6f8fa',
          borderRight: '1px solid #d0d7de',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f6f8fa',
          borderBottom: '1px solid #d0d7de',
          boxShadow: 'none',
          color: '#24292f'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#24292f',
          '&:hover': {
            backgroundColor: '#f3f4f6',
            color: '#0969da'
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#656d76'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d0d7de'
            },
            '&:hover fieldset': {
              borderColor: '#0969da'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0969da'
            }
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: '#24292f',
          '&:before': {
            borderBottomColor: '#d0d7de'
          },
          '&:hover:before': {
            borderBottomColor: '#0969da'
          },
          '&:after': {
            borderBottomColor: '#0969da'
          }
        }
      }
    }
  }
});

// Updated form styles that work with both themes
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
