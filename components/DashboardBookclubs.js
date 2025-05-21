import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Header from "./Header";
import styles from '../styles/Dashboard.module.css'

function DashboardBookclubs() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [userBookclubs, setUserBookclubs] = useState([]);
    const [followingBookclubs, setFollowingBookclubs] = useState([]);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }
    }, [user, router]);

    const handleIconNew = () => {
        console.log('New bookclub')
    };

    return (
        <div style={{width: '100%'}}>
            <div className={styles.subtitle}>
                <FontAwesomeIcon icon={faPlus} className={styles.subtitleIcon} onClick={handleIconNew} /><span>Tes clubs de lecture</span>
            </div>
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