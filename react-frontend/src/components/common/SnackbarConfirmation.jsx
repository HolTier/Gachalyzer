import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef(function Alert(props, ref){
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
});

function SnackbarConfirmation({ open, severity, message, hideDuration = 3000, onClose}) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        onClose?.();
    };

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={hideDuration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={severity}
                    sx={{ width: '100%'}}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SnackbarConfirmation;