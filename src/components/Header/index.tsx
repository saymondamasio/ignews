import Image from "next/image";
import { SignInButton } from "../SignInButton";

import styles from './styles.module.scss'

export function Header(){
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}