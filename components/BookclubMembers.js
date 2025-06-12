import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@mui/material/Avatar';
import styles from '../styles/BookclubSettings.module.css';

function BookclubMembers(props) {
    const { follows, user } = props;
    const initialized = useRef(false);
    const [followers, setFollowers] = useState([]);
    const size = 50;

    useEffect(() => {
        if (!follows || follows.length === 0 || initialized.current) return;
        setFollowers(follows);
        initialized.current = true;
    }, [follows]);


    const handleDelete = async (member) => {
        const res = await fetch(`${process.env.REACT_APP_REACT_APP_REACT_APP_BACKEND_URL}followers/delete`, {
            method: 'DELETE',
            headers: {
                'authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: member.id_user._id, bookclubId: member.id_bookclub })
        });
        const data = await res.json();
        if (data.follower) {
            setFollowers(prev => prev.filter(follower => follower._id != member._id));
        }
    };

    const usersDisplay = followers.length === 0 ? "Chargement..." : followers.map(user => {
        const icon = user.role === 0 ? null : <FontAwesomeIcon icon={faXmark} className={styles.deleteBtn} onClick={(e) => handleDelete(user)} />;
        return (
            <div key={user._id} className={styles.rowUser}>
                <Avatar src={user.id_user.icon} alt={user.id_user.pseudo} variant="rounded" sx={{ width: size, height: size }} />
                {user.id_user.pseudo}
                {icon}
            </div>
        )
    });

    return (
        <div className={styles.tab1}>
            <h3>Gérer les membres du club</h3>
            {usersDisplay}
        </div>
    )
}

export default BookclubMembers;