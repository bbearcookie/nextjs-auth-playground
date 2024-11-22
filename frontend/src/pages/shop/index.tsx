import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { getIronSession } from 'iron-session';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { serviceAPI } from '../../lib/serviceAPI';
import { useSessionContext } from '../../lib/sessionContext';
import { withSessionContext } from '../../hocs/withSessionContext';

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

export const getServerSideProps = withSessionContext(async (context) => {
  const session = await getIronSession<{
    accessToken: string;
  }>(context.req, context.res, sessionOptions);

  const result = await serviceAPI<string>({
    url: '/',
    method: 'GET',
  });

  return {
    props: {
      message: result.data,
      session,
    },
  };
});
