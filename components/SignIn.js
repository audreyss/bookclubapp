import { useState } from 'react';
import styles from '../styles/Home.module.css';


function SignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        fetch('http://localhost:3000/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setEmail('');
                    setPassword('');
                } else {
                    alert(data.error);
                }
            })
    }

    return (
        <div className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to BookClubBuddy</h1>
            <h2 className={styles.subtitle}>Gère ton propre club de lecture ou bien suis les dernières actualités livresques de tes clubs de lecture préférés.</h2>
            <label for="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email}/>
            <label for="mdp" className={styles.label}>Mot de passe</label>
            <input type="password" id="mdp" name="mdp" className={styles.input} placeholder='mot de passe' onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button className={styles.buttonConnect} onClick={handleSubmit}>Se connecter</button>
            <hr />
            <button className={styles.buttonConnect}>Se connecter avec Google</button>
            <span className={styles.create}>Pas de compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se créer un compte.</a></span>
        </div>
    );
}

export default SignIn;
