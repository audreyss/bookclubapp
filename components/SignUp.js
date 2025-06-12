import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';

function SignUp(props) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
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
        if (!passwordRegex.test(pseudo)) {
            return "Le pseudo contient des caractères interdits.";
        }
        return null;
    };


    const handleSubmit = () => {
        const validationError = validateInput(email, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        fetch(process.env.NEXT_PUBLIC_API_URL + 'users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    dispatch(login({ pseudo, email, token: data.token }));
                    setEmail('');
                    setPseudo('');
                    setPassword('');
                    setError('');
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
            <label htmlFor="pseudo" className={styles.label}>Pseudo</label>
            <input type="text" id="pseudo" name="pseudo" className={styles.input} placeholder='pseudo' onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
            
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
            
            <label htmlFor="mdp" className={styles.label}>Mot de passe</label>
            <input type="password" id="mdp" name="mdp" className={styles.input} placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password} />
            
            <button className={styles.buttonConnect} onClick={handleSubmit}>Créer un compte</button>
            {error && <span>{error}</span>}
            <hr />

            <span className={styles.create}>Déjà un compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se connecter.</a></span>
        </div>
    );
}

export default SignUp;