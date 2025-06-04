import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import styles from '../styles/Bookclub.module.css';


function BookclubAvatar(props) {

    return (
        <div className={styles.followers}>
            {props.name}
            <AvatarGroup sx={{ border: 0, ".MuiAvatar-root": { border: 0 }, }}>
                {props.users.map((f, i) => <Avatar src={f.id_user.icon} alt={f.id_user.pseudo} key={i} variant="rounded" sx={{ width: 100, height: 100 }} />)}
            </AvatarGroup>
        </div>
    );
}

export default BookclubAvatar;