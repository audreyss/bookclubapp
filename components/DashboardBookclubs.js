import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/DashboardBookclubs.module.css'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: '#CAD8E6',
    borderRadius: '10px',
    boxShadow: 2,
    padding: 4,
};

function DashboardBookclubs() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [userBookclubs, setUserBookclubs] = useState([]);
    const [followingBookclubs, setFollowingBookclubs] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
    }, [user, router]);

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faPlus} className={styles.subtitleIcon} onClick={handleOpen} /><span>Tes clubs de lecture</span>
            </div>
            <Modal open={open} onClose={handleClose}>
                <div style={style}>
                    Test
                </div>
            </Modal>
            {userBookclubs.length === 0 ? "Vous n'avez pas créé de club de lecture" : userBookclubs.map(bk => <img src={bk.icon} alt={bk.name} />)}
            <hr />
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.subtitleIcon} /><span>Les clubs de lecture que tu suis</span>
            </div>
            {followingBookclubs.length === 0 ? "Vous n'avez pas rejoint de club de lecture" : followingBookclubs.map(bk => <img src={bk.icon} alt={bk.name} />)}
        </div>

    );
}

export default DashboardBookclubs;