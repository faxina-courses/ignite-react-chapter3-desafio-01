import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../utils/date-format';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const {
    post: {
      first_publication_date,
      data: { title, banner, author, content },
    },
  } = props;

  const timeToRead = () => {
    let count = 0;
    content.map(cont => {
      cont.body.map(elem => {
        count += elem.text.split(' ').length;
        return elem;
      });
      return cont;
    });

    return Math.ceil(count / 200);
  };

  return (
    <div className={styles.container}>
      <Header />
      <img src={banner.url} alt="banner" />
      <main className={styles.main}>
        <h1>{title}</h1>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <FiCalendar color="#BBBBBB" />
            <time>{formatDate(first_publication_date)}</time>
          </div>
          <div className={styles.info}>
            <FiUser color="#BBBBBB" />
            <span>{author}</span>
          </div>
          <div className={styles.info}>
            <FiClock color="#BBBBBB" />
            <time>{timeToRead()} min</time>
          </div>
        </div>

        <div className={styles.contentContainer}>
          {content.map((cont, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={styles.content}>
              <h1>{cont.heading}</h1>
              <div className={styles.bodyContainer}>
                {cont.body.map((paragraph, paragraphIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <p key={paragraphIndex}>{paragraph.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  const { first_publication_date, data, uid } = response;

  const newContent = (data?.content || []).map(elem => {
    const newBody = (elem?.body || []).map(body => ({
      text: body.text,
      spans: body.spans,
      type: body.type,
    }));
    return {
      heading: elem?.heading,
      body: newBody,
    };
  });

  return {
    props: {
      post: {
        first_publication_date,
        data: {
          title: data?.title,
          subtitle: data?.subtitle,
          banner: {
            url: data?.banner?.url,
          },
          author: data.author,
          content: newContent,
        },
        uid,
      },
    },
  };
};
