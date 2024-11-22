import { sessionOptions } from '@/config/sessionOptions';
import { useSessionContext } from '@/lib/sessionContext';
import { getIronSession } from 'iron-session';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

const ShopIdPage = ({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const session = useSessionContext();

  return (
    <div>
      <h1>상점 상세 페이지</h1>

      <div>
        <button onClick={() => router.push('/shop')}>화면 이동</button>
      </div>

      <div>
        <button
          onClick={() =>
            router.push('/shop', undefined, {
              shallow: true,
            })
          }
        >
          화면 shllow 이동
        </button>
      </div>
    </div>
  );
};

export default ShopIdPage;

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<{
    accessToken: string;
  }>(context.req, context.res, sessionOptions);

  return {
    props: {
      message: 'hello',
      session: session,
    },
  };
}) satisfies GetServerSideProps<{ message: string }>;
