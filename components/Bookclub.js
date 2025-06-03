import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Header from "./Header";
import styles from '../styles/Bookclub.module.css';


function Bookclub() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const bookclubId = router.query.page;
    const [bookclub, setBookclub] = useState(null);
    const [follows, setFollows] = useState([]);
    const [role, setRole] = useState(-1); // 0: creator, 1: moderator, 2: user

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        if (!bookclubId) return;

        console.log('bookclubid', bookclubId);
        fetch(`http://localhost:3000/bookclubs/${bookclubId}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => {
                if (res.status == 403) return router.push('/');
                return res.json()
            })
            .then(data => {
                console.log('bk: ', data.bookclub);
                setBookclub(data.bookclub)
            });

        fetch(`http://localhost:3000/followers/bookclub/${bookclubId}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setFollows(data.followings)
                console.log('follow, ', data.followings);
                const userFollow = follows.filter(follow => follow.id_user.email === user.email);
                if (userFollow.length > 0) setRole(userFollow[0]?.role);
            });
    }, [user, router]);

    const handleOpenSettings = () => {
        console.log('settings bookclub', bookclub);
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <img src={bookclub?.icon} alt={bookclub?.name} className={styles.icon} />
                    <h2 className={styles.name}>{bookclub?.name}</h2>
                    <span>{bookclub?.description}</span>

                    <FontAwesomeIcon icon={faGear} className={styles.settingsIcon} onClick={handleOpenSettings} />
                </div>

            </div>

        </>

    );
}

export default Bookclub;