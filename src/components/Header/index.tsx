import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";

import styles from './styles.module.scss'

export function Header(){

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <ActiveLink href='/' activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href='/posts' activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}