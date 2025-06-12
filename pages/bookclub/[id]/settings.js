import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import Header from '../../../components/Header';
import styles from '../../../styles/BookclubSettings.module.css';
import BookclubSettings from "../../../components/BookclubSettings";
import BookclubMod from "../../../components/BookclubMod";

export default function BookClubSettingsPage() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const { id } = router.query;

    const [bookclub, setBookclub] = useState(null);
    const [follows, setFollows] = useState([]);
    const [activeTab, setActiveTab] = useState(0);


    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        if (!id) return;

        fetch(`http://localhost:3000/bookclubs/${id}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => {
                if (res.status == 403) return router.push('/');
                return res.json()
            })
            .then(data => {
                setBookclub(data.bookclub);
            });

        fetch(`http://localhost:3000/followers/bookclub/${id}`, {
            headers: {
                'authorization': 'Bearer ' + user.token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setFollows(data.followings)
                const userFollow = data.followings.filter(follow => follow.id_user.email === user.email);
                const roleUser = userFollow.length > 0 ? userFollow[0].role : 3;
                roleUser != 0 && router.push(`/bookclub/${id}`);
            });
    }, [user, router, activeTab]);

    const content = () => {
        switch (activeTab) {
            case 0:
                return <BookclubSettings user={user} bookclub={bookclub}/>;
            case 1:
                return <BookclubMod user={user} follows={follows}/>;
            case 2:
                return null;
            default:
                return null;
        }
    };

    const tabs = ['Paramètres', 'Modération', 'Membres'];
    const styleTabs = tabs.map((_, idx) => {
        if (idx === activeTab) return { fontWeight: 'bold', color: 'var(--text-light)', backgroundColor: 'var(--button-hover)' };
        else return {};
    })

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Gestion du club <br />
                        {bookclub?.name}
                    </h1>
                    <div className={styles.tabs}>
                        {tabs.map((tab, idx) => <button key={idx} onClick={() => setActiveTab(idx)} style={styleTabs[idx]} className={styles.tab}>{tab}</button>)}
                    </div>
                    <div className={styles.tabContent}>{content()}</div>
                </div>
            </div>
        </>
    );
}