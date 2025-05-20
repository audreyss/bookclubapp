import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../reducers/user";
import { useRouter } from "next/router";
import Header from "./Header";
import styles from '../styles/Account.module.css';
import EditAccount from "./EditAccount";

function Account() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('');
    const [field, setField] = useState('');

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
    }, [user, router]);

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <button className={styles.button} onClick={() => handleClick('text', 'pseudo')}>Changer pseudo</button>
                    <button className={styles.button} onClick={() => handleClick('email', 'email')}>Changer email</button>
                    <button className={styles.button} onClick={() => handleClick('password', 'mot de passe')}>Changer mot de passe</button>
                    <button className={styles.button} onClick={handleLogout}>Se déconnecter</button>
                </div>
                <div className={styles.content}>
                    {isOpen && <EditAccount type={type} field={field}/>}
                </div>
            </div>
        </div>
    )
}

export default Account;