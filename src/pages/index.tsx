import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="logo" />
        <main className={styles.posts}>
          <Link key="'" href="/">
            <a>
              <div className={styles.post}>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.info}>
                  <div className={styles.dateInfo}>
                    <FiCalendar color="#bbbbbb" />
                    <time>15 Mar 2021</time>
                  </div>
                  <div className={styles.userInfo}>
                    <FiUser color="#bbbbbb" />
                    <span>Joseph Oliveira</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <Link key="'" href="/">
            <a>
              <div className={styles.post}>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.info}>
                  <div className={styles.dateInfo}>
                    <FiCalendar color="#bbbbbb" />
                    <time>15 Mar 2021</time>
                  </div>
                  <div className={styles.userInfo}>
                    <FiUser color="#bbbbbb" />
                    <span>Joseph Oliveira</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <Link key="'" href="/">
            <a>
              <div className={styles.post}>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.info}>
                  <div className={styles.dateInfo}>
                    <FiCalendar color="#bbbbbb" />
                    <time>15 Mar 2021</time>
                  </div>
                  <div className={styles.userInfo}>
                    <FiUser color="#bbbbbb" />
                    <span>Joseph Oliveira</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <Link key="'" href="/">
            <a>
              <div className={styles.post}>
                <h1>Como utilizar Hooks</h1>
                <p>Pensando em sincronização em vez de ciclos de vida.</p>
                <div className={styles.info}>
                  <div className={styles.dateInfo}>
                    <FiCalendar color="#bbbbbb" />
                    <time>15 Mar 2021</time>
                  </div>
                  <div className={styles.userInfo}>
                    <FiUser color="#bbbbbb" />
                    <span>Joseph Oliveira</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </main>
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
