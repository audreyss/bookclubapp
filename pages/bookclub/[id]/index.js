import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from "../../../components/Header";
import BookclubAvatar from "../../../components/BookclubAvatar";
import styles from '../../../styles/Bookclub.module.css';

function BookclubPage() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const bookclubId = router.query.id;
    const [bookclub, setBookclub] = useState(null);
    const [follows, setFollows] = useState([]);
    const [role, setRole] = useState(3); // 0: creator, 1: moderator, 2: user, 3: not following user

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
                const userFollow = data.followings.filter(follow => follow.id_user.email === user.email);
                if (userFollow.length > 0) setRole(userFollow[0]?.role);
            });
    }, [user, router]);

    const handleFollow = async () => {
        if (role < 3) {
            // désabonner
            const res = await fetch(`http://localhost:3000/followers/delete`, {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId })
            });
            const data = await res.json();
            if (data.follower.deletedCount > 1) setRole(3);

        } else {
            // s'abonner
            const res = await fetch(`http://localhost:3000/followers/create`, {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookclubId, role: 2 })
            });
            const data = await res.json();
            setRole(2);
        }
    };

    const gear = role <= 1 ? <Link href={`/bookclub/${bookclubId}/settings`}><FontAwesomeIcon className={styles.settingsIcon} icon={faGear} /></Link> : null;
    const follow = role <= 2 ? "Ne plus suivre" : "Suivre";
    const btn = role === 0 ? null : <button className={styles.btnFollow} onClick={handleFollow}>{follow}</button>
    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    {gear}
                    <img src={bookclub?.icon} alt={bookclub?.name} className={styles.icon} />
                    <h2 className={styles.name}>{bookclub?.name}</h2>
                    <span>{bookclub?.description}</span>
                    {btn}
                    <div className={styles.members}>
                        <div className={styles.divCreatMod}>
                            <BookclubAvatar name="Créateur-trice" users={follows.filter(f => f.role === 0)} />
                            <BookclubAvatar name="Modérateurs-trices" users={follows.filter(f => f.role === 1)} />
                        </div>
                        <BookclubAvatar name="Membres" users={follows.filter(f => f.role === 2)} size={50} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookclubPage;