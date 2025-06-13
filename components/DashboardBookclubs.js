import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/DashboardBookclubs.module.css'
import CustomSnackbar from './CustomSnackbar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { styled } from "@mui/material/styles";
import Link from 'next/link';

function DashboardBookclubs() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [userFollow, setUserFollow] = useState([]);
    const [bookclubs, setBookclubs] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [privacy, setPrivacy] = useState(false); // true = private, false = public
    const [icon, setIcon] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [valueSearch, setValueSearch] = useState(null);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const StyledAutocomplete = styled(Autocomplete)({
        "&.Mui-focused .MuiInputLabel-outlined": {
            color: 'var(--primary-color)'
        },
        "& .MuiAutocomplete-inputRoot": {
            color: 'var(--primary-color)'
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: 'var(--primary-color)'
        },
        '.MuiAutocomplete-inputFocused': {
            border: 'none',
            color: 'var(--primary-color)'
        },
        '.MuiFormLabel-root': {
            color: 'var(--primary-color)'
        },
    });

    const refreshFollowings = () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + 'followers/user?userId=', {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        }).then(res => res.json())
            .then(data => {
                setUserFollow(data.followings)
            })
    };

    const handleClick = async () => {
        if (!name || !desc || !icon) {
            alert('Il manque des informations.')
            return;
        }

        try {
            let res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/create', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, desc, privacy })
            });
            const dataCreate = await res.json();

            const formData = new FormData();
            formData.append('icon', icon[0]);

            res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/upload', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'bookclub': dataCreate.bookclub._id,
                },
                body: formData
            });
            const dataUpload = await res.json();

            res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'followers/create', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId: dataCreate.bookclub._id, role: 0 })
            });
            const dataFollow = await res.json();

            setName('');
            setDesc('');
            setIcon(null);
            setPrivacy(false);
            setOpen(false);
            refreshFollowings();
            setSnackbarOpen(true);

        } catch {
            alert('Erreur pendant la création du club de lecture.')
        }
    };

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        fetch(process.env.NEXT_PUBLIC_API_URL + 'bookclubs/all', {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        }).then(res => res.json())
            .then(data => {
                setBookclubs(data.bookclubs)
            })

    }, []);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        refreshFollowings();

    }, [user, router]);

    const modoBookclubs = userFollow.filter(follow => follow.role <= 1);
    const followBookclubs = userFollow.filter(follow => follow.role == 2);

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faPlus} className={styles.subtitleIcon} onClick={handleOpen} /><span>Tes clubs de lecture en modération</span>
            </div>
            <Modal open={open} onClose={handleClose}>
                <div className={styles.modal}>
                    <h3 className={styles.modalTitle}>Création club de lecture</h3>
                    <div className={styles.inputs}>
                        <div className={styles.firstRow}>
                            <div className={styles.nameCol}>
                                <label htmlFor='name' style={{ textAlign: 'right' }}>Nom</label>
                                <input type='text' id='name' name='name' placeholder='Club de lecture' onChange={(e) => setName(e.target.value)} value={name} />
                            </div>
                            <div className={styles.privateCol}>
                                <label style={{ margin: '0px' }} htmlFor='privacy'>Privé</label>
                                <input style={{ width: '16px' }} type='checkbox' id='privacy' name='privacy' onChange={(e) => setPrivacy(e.target.checked)} checked={privacy} />
                            </div>
                        </div>

                        <label htmlFor='desc'>Description</label>
                        <input type='text' id='desc' name='desc' placeholder='Super club de lecture.' onChange={(e) => setDesc(e.target.value)} value={desc} />

                        <label htmlFor='icon'>Icone</label>
                        <input className={styles.file} type='file' id='icon' name='icon' accept="image/*" onChange={(e) => setIcon(e.target.files)} />

                        <button onClick={handleClick}>Créer le club de lecture</button>
                    </div>
                </div>
            </Modal>
            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} msg="Création réussie !" />

            <div className={styles.iconsContainer}>
                {modoBookclubs.length === 0 ? "Tu es modérateur-trice d'aucun club de lecture" : 
                modoBookclubs.map((bk, i) => <div className={styles.bookclubIconDiv} key={i}><Link href={`/bookclub/${bk.id_bookclub._id}`}><img src={bk.id_bookclub.icon} alt={bk.id_bookclub.name} className={styles.bookclubIcon} /></Link></div>)}
            </div>
            <hr />
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.subtitleIcon} onClick={() => setOpenSearch(true)} /><span>Les clubs de lecture que tu suis</span>
            </div>

            <Modal open={openSearch} onClose={() => setOpenSearch(false)}>
                <div className={styles.modal}>
                    <h3 className={styles.modalTitle}>Recherche club de lecture</h3>
                    <div className={styles.inputs}>
                        <StyledAutocomplete id="select-user" sx={{ width: 1 }}
                            options={bookclubs.sort((a, b) => -b.name[0].localeCompare(a.name[0]))} autoHighlight disableCloseOnSelect
                            getOptionLabel={(option) => option.name} value={valueSearch} onChange={(event, newValue) => { setValueSearch(newValue) }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                                        {<Avatar loading="lazy" src={option.icon} alt={option.icon} variant="rounded" sx={{ width: 32, height: 32, mr: 2 }} />}
                                        {option.name}
                                    </Box>
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label="Choisir un membre" />}
                        />
                        <Link href={`/bookclub/${valueSearch._id}`}><button>Afficher le club de lecture</button></Link>
                    </div>
                </div>
            </Modal>

            <div className={styles.iconsContainer}>
                {followBookclubs.length === 0 ? "Tu n'as pas encore rejoint de club de lecture" : 
                followBookclubs.map((bk, i) => <div className={styles.bookclubIconDiv} key={i}><Link href={`/bookclub/${bk.id_bookclub._id}`}><img src={bk.id_bookclub.icon} alt={bk.id_bookclub.name} className={styles.bookclubIcon} /></Link></div>)}
            </div>
        </div>

    );
}

export default DashboardBookclubs;