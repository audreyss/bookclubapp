import React from 'react';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons'

function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>BookClubBuddy</h1>
            <nav className={styles.nav}>
                <a href='/dashboard'><FontAwesomeIcon icon={faHouse} className={styles.icon_left}/></a>
                <a href='/account'><FontAwesomeIcon icon={faUser} /></a>
            </nav>
        </header>
    );
}

export default Header;
