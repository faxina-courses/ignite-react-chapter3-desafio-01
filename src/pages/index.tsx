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

export default function Home({
  postsPagination: { results } = {} as PostPagination,
}: HomeProps) {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="logo" />
        <main className={styles.posts}>
          {results?.map(post => (
            <Link key={post.uid} href="/">
              <a>
                <div className={styles.post}>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <div className={styles.dateInfo}>
                      <FiCalendar color="#bbbbbb" />
                      <time>{post.first_publication_date}</time>
                    </div>
                    <div className={styles.userInfo}>
                      <FiUser color="#bbbbbb" />
                      <span>{post.data.author}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
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
