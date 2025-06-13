import { forwardRef, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CustomSnackbar from './CustomSnackbar';
import styles from '../styles/BookclubSettings.module.css';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BookclubSettings(props) {
    const { user, bookclub } = props;
    const router = useRouter();
    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [desc, setDesc] = useState('');
    const [icon, setIcon] = useState(null);
    const [iconURL, setIconURL] = useState('');
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarOpenDel, setSnackbarOpenDel] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setName(bookclub?.name);
        setPrivacy(bookclub?.private);
        setDesc(bookclub?.description);
        setIconURL(bookclub?.icon);
    }, [bookclub]);

    useEffect(() => {
        if (!icon) return;

        try {
            const formData = new FormData();
            formData.append('icon', icon[0]);

            fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/upload', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'bookclub': bookclub._id,
                },
                body: formData
            })
                .then(res => res.json())
                .then(data => setIconURL(data.bookclub?.icon))
        } catch {
            alert('Erreur pendant le chargement de l\'image de profil.')
        }
    }, [icon]);

    const handleSave = async () => {
        try {
            let res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/modify', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: bookclub._id, name, description: desc, private: privacy })
            });
            const dataMod = await res.json();
            dataMod?.bookclub && setSnackbarOpen(true);
        } catch {
            alert('Erreur pendant l\'enregistrement des modifications.')
        }
    };

    const handleDelete = async () => {
        try {
            let res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/delete', {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId: bookclub._id })
            });
            const dataBk = await res.json();
            res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'followers/deleteBookclub', {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId: bookclub._id })
            });
            const dataFollow = await res.json();
            if (dataBk?.result && dataFollow?.result) {
                setOpen(false);
                setSnackbarOpenDel(true);
                setTimeout(() => router.push('/dashboard'), 1500);
            }
        } catch {
            alert('Erreur pendant la suppression.')
        }
    }

    return (
        <div className={styles.tab0}>
            <div className={styles.iconContainer}>
                <label htmlFor="file-input">
                    <FontAwesomeIcon icon={faPen} className={styles.iconEdit} />
                    <img src={iconURL} alt={name} className={styles.icon} />
                </label>
                <input id="file-input" type="file" accept="image/*" onChange={(e) => setIcon(e.target.files)} />
            </div>

            <label htmlFor="name" className={styles.label}>Nom</label>
            <input id="name" name="name" onChange={(e) => setName(e.target.value)} value={name} autoComplete="off" className={styles.input} />

            <label htmlFor="desc" className={styles.label}>Description</label>
            <input id="desc" name="desc" onChange={(e) => setDesc(e.target.value)} value={desc} autoComplete="off" className={styles.input} />

            <label htmlFor="privacy" className={styles.label}>Privé</label>
            <input style={{ width: '24px' }} id="privacy" name="privacy" type='checkbox' onChange={(e) => setPrivacy(e.target.checked)} checked={privacy} className={styles.input} />

            <button onClick={handleSave} className={styles.saveBtn}>Enregistrer</button>
            <button onClick={handleClickOpen} className={styles.saveBtn}>Supprimer le club de lecture</button>
            
            <Dialog open={open} slots={{ transition: Transition }} keepMounted onClose={handleClose}>
                <DialogTitle sx={{backgroundColor: 'var(--background-color)', color: 'var(--primary-color)'}}>Suppression club de lecture</DialogTitle>
                <DialogContent sx={{backgroundColor: 'var(--background-color)', color: 'var(--primary-color)'}}>
                    <DialogContentText sx={{color: 'var(--primary-color)'}}>
                        Etes vous sûr-e de vouloir supprimer le club de lecture {bookclub?.name} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{backgroundColor: 'var(--background-color)'}}>
                    <button onClick={handleDelete} >Oui</button>
                    <button onClick={handleClose}>Annuler</button>
                </DialogActions>
            </Dialog>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} msg="Modifications réussies !"/>
            <CustomSnackbar open={snackbarOpenDel} onClose={() => setSnackbarOpenDel(false)} msg="Suppression réussie !"/>
        </div>
    );
}

export default BookclubSettings;