import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';

function SignIn(props) {
    const dispatch = useDispatch('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const validateInput = (email, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;

        if (!emailRegex.test(email)) {
            return "L'email n'est pas valide.";
        }
        if (password.length < 6) {
            return "Le mot de passe doit contenir au moins 6 caractères.";
        }
        if (!passwordRegex.test(password)) {
            return "Le mot de passe contient des caractères interdits.";
        }
        return null;
    };


    const handleSubmit = () => {
        const validationError = validateInput(email, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        fetch('http://localhost:3000/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.result) {
                    setEmail('');
                    setPassword('');
                    setError('');
                    dispatch(login({ pseudo: data.pseudo, token: data.token }))
                    router.push('/dashboard');
                } else {
                    setError(data.error);
                }
            })
            .catch(() => setError('Une erreur est survenue. Veuillez réessayer.'));
    };

    return (
        <div className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to BookClubBuddy</h1>
            <h2 className={styles.subtitle}>Gère ton propre club de lecture ou bien suis les dernières actualités livresques de tes clubs de lecture préférés.</h2>
            <label htmlFor='email' className={styles.label}>Email</label>
            <input type='email' id='email' name='email' className={styles.input} placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />

            <label htmlFor="mdp" className={styles.label}>Mot de passe</label>
            <input type='password' id='mdp' name='mdp' className={styles.input} placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password} />

            <button className={styles.buttonConnect} onClick={handleSubmit}>Se connecter</button>
            {error && <span>{error}</span>}
            <hr />
            <button className={styles.buttonConnect}>Se connecter avec Google</button>
            <span className={styles.create}>Pas de compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se créer un compte.</a></span>
        </div>
    );
}

export default SignIn;
