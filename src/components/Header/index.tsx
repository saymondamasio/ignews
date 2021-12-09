import Image from "next/image";

import styles from './styles.module.scss'

export function Header(){
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <a>Home</a>
          <a>Posts</a>
        </nav>
      </div>
    </header>
  )
}