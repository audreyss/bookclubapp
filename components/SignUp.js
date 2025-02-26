import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

function SignUp(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');


    const handleSubmit = () => {
        fetch('http://localhost:3000/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setEmail('');
                    setPseudo('');
                    setPassword('');
                } else {
                    alert(data.error);
                }
            })
    };

    return (
        <div className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to BookClubBuddy</h1>
            <h2 className={styles.subtitle}>Gère ton propre club de lecture ou bien suis les dernières actualités livresques de tes clubs de lecture préférés.</h2>
            <label for="pseudo" className={styles.label}>Pseudo</label>
            <input type="text" id="pseudo" name="pseudo" className={styles.input} placeholder='pseudo' onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
            <label for="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
            <label for="mdp" className={styles.label}>Mot de passe</label>
            <input type="password" id="mdp" name="mdp" className={styles.input} placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password} />
            <button className={styles.buttonConnect} onClick={handleSubmit}>Créer un compte</button>
            <hr />

            <span className={styles.create}>Déjà un compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se connecter.</a></span>
        </div>
    );
}

export default SignUp;