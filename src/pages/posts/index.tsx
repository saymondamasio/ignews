import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts(){
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time>12 de março de 2012</time>
            <strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa velit aperiam libero, illum cupiditate totam illo reprehenderit nostrum</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa quia distinctio porro consectetur excepturi omnis quod ab inventore dolore. Omnis ex vero similique nostrum doloremque nesciunt voluptas aperiam fugiat ut.</p>
          </a>
           <a>
            <time>12 de março de 2012</time>
            <strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa velit aperiam libero, illum cupiditate totam illo reprehenderit nostrum</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa quia distinctio porro consectetur excepturi omnis quod ab inventore dolore. Omnis ex vero similique nostrum doloremque nesciunt voluptas aperiam fugiat ut.</p>
          </a>
           <a>
            <time>12 de março de 2012</time>
            <strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa velit aperiam libero, illum cupiditate totam illo reprehenderit nostrum</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa quia distinctio porro consectetur excepturi omnis quod ab inventore dolore. Omnis ex vero similique nostrum doloremque nesciunt voluptas aperiam fugiat ut.</p>
          </a>
        </div>
      </main>
    </>
  )
}