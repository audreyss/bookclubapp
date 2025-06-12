import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../reducers/user";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Header from "../components/Header";
import styles from '../styles/Account.module.css';
import EditAccount from "../components/EditAccount";

function AccountPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('');
    const [field, setField] = useState('');
    const [userAccount, setUserAccount] = useState(null);
    const [icon, setIcon] = useState(null);
    const [iconURL, setIconURL] = useState('');

    const handleClick = (type, field) => {
        setIsOpen(true);
        setType(type);
        setField(field);
    }

    const handleLogout = () => {
        dispatch(logout());
    }

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        if (!icon) return;
        try {
            const formData = new FormData();
            formData.append('icon', icon[0]);

            fetch(process.env.NEXT_PUBLIC_API_URL + 'accounts/uploadIcon', {
                method: 'PUT',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                },
                body: formData
            })
                .then(res => res.json())
                .then(data => setIconURL(data.url))
        } catch {
            alert('Erreur pendant le chargement de l\'image de profil.')
        }
    }, [icon]);

    useEffect(() => {
        if (!user?.token) {
            router.push('/');
        }

        fetch(process.env.NEXT_PUBLIC_API_URL + 'accounts/user', {
            headers: {
                'authorization': 'Bearer ' + user.token,
            }
        })
            .then(res => {
                if (res.status == 403) return router.push('/');
                return res.json()
            })
            .then(data => {
                if (!data?.user) return;
                setUserAccount(data?.user);
                setIconURL(data?.user.icon)
            });
    }, [user, router]);

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.iconContainer}>
                        <label htmlFor="file-input">
                            <FontAwesomeIcon icon={faPen} className={styles.iconEdit} />
                            <img src={iconURL} alt={userAccount?.pseudo} className={styles.icon} />
                        </label>
                        <input id="file-input" type="file" accept="image/*" onChange={(e) => setIcon(e.target.files)} />
                    </div>
                    <span> {userAccount?.pseudo} - {userAccount?.email} </span>
                    <button className={styles.button} onClick={() => handleClick('text', 'pseudo')}>Changer pseudo</button>
                    <button className={styles.button} onClick={() => handleClick('email', 'email')}>Changer email</button>
                    <button className={styles.button} onClick={() => handleClick('password', 'mot de passe')}>Changer mot de passe</button>
                    <button className={styles.button} onClick={handleLogout}>Se déconnecter</button>
                </div>
                <div className={styles.contentEdit}>
                    {isOpen && <EditAccount type={type} field={field} />}
                </div>
            </div>
        </div>
    )
}

export default AccountPage;