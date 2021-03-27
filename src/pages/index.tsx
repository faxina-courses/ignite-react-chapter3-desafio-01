import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import { useEffect, useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
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

const formatPostsPagination = (postsResponse: ApiSearchResponse) => {
  const { next_page, results } = postsResponse;

  const newResults = results.map(post => ({
    uid: post.uid,
    first_publication_date: new Date(
      post.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    data: post.data,
  }));

  return {
    results: newResults,
    next_page,
  };
};

const formatPostsPaginationFront = (
  postsResponse: ApiSearchResponse,
  nextPage?: string
) => {
  const { next_page, results } = formatPostsPagination(postsResponse);

  return {
    next_page: next_page
      ? `${next_page}&access_token=${nextPage?.split('access_token=')[1]}`
      : null,
    results,
  };
};

export default function Home({
  postsPagination: { results, next_page } = {} as PostPagination,
}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState<string>();

  useEffect(() => {
    setPosts(results);
    setNextPage(next_page);
  }, [results, next_page]);

  const handleShowMorePostButton = async () => {
    try {
      const response = await fetch(nextPage);
      const data = await response.json();
      const {
        results: newPosts,
        next_page: newNextPage,
      } = formatPostsPaginationFront(data, nextPage);
      setPosts([...posts, ...newPosts]);
      setNextPage(newNextPage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div className={styles.container}>
        <img src="/Logo.svg" alt="logo" />
        <main className={styles.posts}>
          {posts?.map(post => (
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
        {nextPage && (
          <button
            type="button"
            className={styles.showMorePostsButton}
            onClick={handleShowMorePostButton}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

const formatPostsPaginationServer = (postsResponse: ApiSearchResponse) => {
  const { next_page, results } = formatPostsPagination(postsResponse);

  return {
    next_page: `${next_page}&access_token=${process.env.PRISMIC_ACCESS_TOKEN}`,
    results,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );
  // console.log(JSON.stringify(postsResponse, null, 2));

  return {
    props: {
      postsPagination: formatPostsPaginationServer(postsResponse),
    },
  };
};
