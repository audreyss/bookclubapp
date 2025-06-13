import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function CustomSnackbar(props) {
    const {open, onClose, msg} = props;

    const action = (
        <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={onClose} >
                <FontAwesomeIcon icon={faXmark} />
            </IconButton>
        </>
    );

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={onClose} message={msg} action={action} />
        </>
    )
}

export default CustomSnackbar;