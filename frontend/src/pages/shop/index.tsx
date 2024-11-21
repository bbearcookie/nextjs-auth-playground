import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { sessionOptions } from '@/config/session-options';
import { useSession } from '@/hooks/useSession';
import { dehydrate, QueryClient } from '@tanstack/react-query';
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

  const { data } = useSession();
  console.log('useSession Data', data);

  const handleToken = async () => {
    const res = await nextServerAuthAPI.getToken();

    console.log('cliked token', res.accessToken);
  };

  return (
    <div>
      {message}
      <h1>로그인 된 사용자만 들어올 수 있는 상점 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={handleToken}>토큰 get</button>
    </div>
  );
};

export default ShopPage;

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<{
    accessToken: string;
  }>(context.req, context.res, sessionOptions);
  console.log('session in getServerSideProps', session);

  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['session'],
    queryFn: () => nextServerAuthAPI.getToken(),
  });

  return {
    props: { message: 'hello', dehydratedState: dehydrate(queryClient) },
  };
}) satisfies GetServerSideProps<{ message: string }>;
