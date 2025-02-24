import styles from '../styles/Home.module.css';
import Link from 'next/link';

function SignIn(props) {
    return (
        <div className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to BookClubBuddy</h1>
            <h2 className={styles.subtitle}>Gère ton propre club de lecture ou bien suis les dernières actualités livresques de tes clubs de lecture préférés.</h2>
            <label for="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} placeholder='example@gmail.com' />
            <label for="mdp" className={styles.label}>Mot de passe</label>
            <input type="password" id="mdp" name="mdp" className={styles.input} placeholder='mot de passe' />
            <button className={styles.buttonConnect}>Se connecter</button>
            <hr />
            <button className={styles.buttonConnect}>Se connecter avec Google</button>
            <span className={styles.create}>Pas de compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se créer un compte.</a></span>
        </div>
    );
}

export default SignIn;
