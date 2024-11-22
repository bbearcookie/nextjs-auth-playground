import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { useSessionContext } from '@/providers/SessionProvider';
import { getIronSession } from 'iron-session';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { serviceAPI } from '../lib/serviceAPI';
import { asyncLocalStorage } from '../lib/asyncLocalStorage';
import { isServer } from '@/utils/isServer';
import { useSuspenseQuery } from '@tanstack/react-query';

const ShopPage = ({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const handleLogout = async () => {
    await nextServerAuthAPI.postSignOut();
    router.replace('/auth/signin');
  };

  const { accessToken } = useSessionContext();

  useSuspenseQuery({
    queryKey: ['server-test'],
    queryFn: () => serviceAPI({ url: '/' }),
  });

  return (
    <div>
      {message}
      <h1>로그인 된 사용자만 들어올 수 있는 상점 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>

      <h2>카운트: {count}</h2>
      <div>
        <button onClick={() => setCount((prev) => prev + 1)}>
          카운트 증가
        </button>
      </div>

      <div>
        <button onClick={() => router.push(`/shop/${count}`)}>화면 이동</button>
      </div>

      <div>
        <button
          onClick={() =>
            serviceAPI({
              url: '/',
              method: 'GET',
            })
          }
        >
          API Call 해보기
        </button>
      </div>
    </div>
  );
};

export default ShopPage;

export function withSessionContext(
  handler: (context: GetServerSidePropsContext) => Promise<any>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getIronSession<{
      accessToken: string;
    }>(context.req, context.res, sessionOptions);

    if (isServer()) {
      return asyncLocalStorage?.run(
        { accessToken: session.accessToken },
        () => {
          console.log(
            'asyncLocalStorage 열었어요!',
            asyncLocalStorage?.getStore()
          );
          return handler(context);
        }
      );
    }

    return handler(context);
  };
}

export const getServerSideProps = withSessionContext(async (context) => {
  const session = await getIronSession<{
    accessToken: string;
  }>(context.req, context.res, sessionOptions);
  console.log('session in getServerSideProps', session);

  return {
    props: {
      message: 'hello',
      session,
    },
  };
}) satisfies GetServerSideProps<{ message: string }>;
