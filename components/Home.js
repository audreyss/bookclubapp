import styles from '../styles/Home.module.css';
import Image from "next/image";
import SignIn from "./SignIn";
import SignUp from './SignUp';
import { useState } from 'react';

function Home() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className={styles.content}>
      <main className={styles.main}>
        <Image src='/home_books.png' width={300} height={500} alt="Picture of books" />
        {isSignIn ? <SignIn onSwitch={() => setIsSignIn(false)} /> : <SignUp onSwitch={() => setIsSignIn(true)} />}
      </main>
    </div>
  );
}

export default Home;
