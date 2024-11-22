import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { useSessionContext } from '@/providers/SessionProvider';
import { getIronSession } from 'iron-session';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

const ShopPage = ({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const handleLogout = async () => {
    await nextServerAuthAPI.postSignOut();
    router.replace('/auth/signin');
  };

  const { accessToken } = useSessionContext();
  console.log('accessToken in ShopPage', accessToken);

  return (
    <div>
      {message}
      <h1>로그인 된 사용자만 들어올 수 있는 상점 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default ShopPage;

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<{
    accessToken: string;
  }>(context.req, context.res, sessionOptions);
  console.log('session in getServerSideProps', session);

  return {
    props: {
      message: 'hello',
      session: session,
    },
  };
}) satisfies GetServerSideProps<{ message: string }>;
