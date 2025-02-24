import styles from '../styles/Home.module.css';
import Link from 'next/link';

function SignUp(props) {
    return (
        <div className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to BookClubBuddy</h1>
            <h2 className={styles.subtitle}>Gère ton propre club de lecture ou bien suis les dernières actualités livresques de tes clubs de lecture préférés.</h2>
            <label for="pseudo" className={styles.label}>Pseudo</label>
            <input type="text" id="pseudo" name="pseudo" className={styles.input} placeholder='pseudo' />
            <label for="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" className={styles.input} placeholder='example@gmail.com' />
            <label for="mdp" className={styles.label}>Mot de passe</label>
            <input type="password" id="mdp" name="mdp" className={styles.input} placeholder='mot de passe' />
            <button className={styles.buttonConnect}>Créer un compte</button>
            <hr />
            
            <span className={styles.create}>Déjà un compte? <a href="#" onClick={(e) => { e.preventDefault(); props.onSwitch(); }}>Se connecter.</a></span>
        </div>
    );
}

export default SignUp;