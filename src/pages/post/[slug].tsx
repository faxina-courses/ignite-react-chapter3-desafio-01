import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

// export default function Post({
//   post: {
//     first_publication_date,
//     data: { title, banner, author, content },
//   },
// }: PostProps) {
export default function Post(props: PostProps) {
  const router = useRouter();
  // console.log(props);
  // eslint-disable-next-line react/destructuring-assignment
  // console.log(props?.post);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const {
    post: {
      first_publication_date,
      data: { title, banner, author, content },
    },
  } = props;

  return (
    <div className={styles.container}>
      <Header />
      <img src={banner.url} alt="banner" />
      <main className={styles.main}>
        <h1>{title}</h1>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <FiCalendar color="#BBBBBB" />
            <time>{first_publication_date}</time>
          </div>
          <div className={styles.info}>
            <FiUser color="#BBBBBB" />
            <span>{author}</span>
          </div>
          <div className={styles.info}>
            <FiClock color="#BBBBBB" />
            <time>4 min</time>
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
  const { first_publication_date, data } = response;

  const newContent = (data?.content || []).map(elem => {
    const newBody = (elem?.body || []).map(body => ({
      text: body.text,
    }));
    return {
      heading: elem?.heading,
      body: newBody,
      // body: RichText.asHtml(elem?.body),
    };
  });

  return {
    props: {
      post: {
        first_publication_date: new Date(
          first_publication_date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        data: {
          title: data?.title,
          banner: {
            url: data?.banner?.url,
          },
          author: data.author,
          content: newContent,
        },
      },
    },
  };
};
