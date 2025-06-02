import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/DashboardBookclubs.module.css'
import Modal from '@mui/material/Modal';
import Link from 'next/link';

function DashboardBookclubs() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [userFollow, setUserFollow] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [privacy, setPrivacy] = useState(true); // true = public, false = private
    const [icon, setIcon] = useState(null);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleClick = async () => {
        if (!name || !desc || !icon) {
            alert('Il manque des informations.')
            return;
        }

        try {
            let res = await fetch('http://localhost:3000/bookclubs/create', {
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

            res = await fetch('http://localhost:3000/bookclubs/upload', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'bookclub': dataCreate.bookclub._id,
                },
                body: formData
            });
            const dataUpload = await res.json();

            res = await fetch('http://localhost:3000/followers/create', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId: dataCreate.bookclub._id })
            });
            const dataFollow = await res.json();
            console.log(dataFollow);

            setName('');
            setDesc('');
            setIcon(null);
            setPrivacy(false);
            setOpen(false);
            console.log('Club de lecture créé.')
        } catch {
            alert('Erreur pendant la création du club de lecture.')
        }
    };

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
        fetch('http://localhost:3000/followers/user?userId=', {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        }).then(res => res.json())
            .then(data => {
                setUserFollow(data.followings)
                console.log(userFollow);
            })
    }, [user, router, open]);

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
                                <input style={{ width: '16px' }} type='checkbox' id='privacy' name='privacy' onChange={(e) => setPrivacy(e.target.value)} value={privacy} />
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
            <div className={styles.iconsContainer}>
                {modoBookclubs.length === 0 ? "Tu es modérateur-trice d'aucun club de lecture" : modoBookclubs.map((bk, i) => <div className={styles.bookclubIconDiv} key={i}><Link href={`/bookclub/${bk.id_bookclub._id}`}><img src={bk.id_bookclub.icon} alt={bk.id_bookclub.name} className={styles.bookclubIcon} /></Link></div>)}
            </div>
            <hr />
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.subtitleIcon} /><span>Les clubs de lecture que tu suis</span>
            </div>
            <div className={styles.iconsContainer}>
                {followBookclubs.length === 0 ? "Tu n'as pas encore rejoint de club de lecture" : followBookclubs.map((bk, i) => <div className={styles.bookclubIconDiv} key={i}><Link><img src={bk.id_bookclub.icon} alt={bk.id_bookclub.name} className={styles.bookclubIcon} /></Link></div>)}
            </div>
        </div>

    );
}

export default DashboardBookclubs;