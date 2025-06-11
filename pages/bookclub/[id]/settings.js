import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Header from '../../../components/Header';
import styles from '../../../styles/BookclubSettings.module.css';

export default function BookClubSettingsPage() {
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const { id } = router.query;
    const [bookclub, setBookclub] = useState(null);
    const [follows, setFollows] = useState([]);
    const [role, setRole] = useState(3); // 0: creator, 1: moderator, 2: user, 3: not following user

    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState(false);
    const [desc, setDesc] = useState('');
    const [icon, setIcon] = useState(null);
    const [iconURL, setIconURL] = useState('');

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
                setName(data.bookclub?.name);
                setPrivacy(data.bookclub?.private);
                setDesc(data.bookclub?.description);
                setIconURL(data.bookclub?.icon);
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
                setRole(roleUser);
                roleUser != 0 && router.push(`/bookclub/${id}`);
            });
    }, [user, router]);

    useEffect(() => {
        if (!icon) return;

        try {
            const formData = new FormData();
            formData.append('icon', icon[0]);

            fetch('http://localhost:3000/bookclubs/upload', {
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
            let res = await fetch('http://localhost:3000/bookclubs/modify', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: bookclub._id, name, description: desc, private: privacy })
            });
            const dataMod = await res.json();
            dataMod?.bookclub && alert('Modifications réussies');
        } catch {
            alert('Erreur pendant l\'enregistrement des modifications.')
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Gestion du club</h1>

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

                    <button onClick={handleSave}>Enregistrer</button>
                </div>
            </div>
        </>
    );
}