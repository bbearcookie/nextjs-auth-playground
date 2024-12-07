import { nextServerAuthAPI } from '@/pages/api/auth/_apis';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { serviceAPI } from '../../lib/serviceAPI';
import { withSessionSSR } from '@/hocs/withSession';

const ShopPage = ({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const logout = async () => {
    await nextServerAuthAPI.postSignOut();
    router.replace('/auth/signin');
  };

  const healthCheck = async () => {
    serviceAPI({
      url: '/',
      method: 'GET',
    });
  };

  const getToken = async () => {
    const result = await nextServerAuthAPI.getToken();
    console.log(result);
  };

  return (
    <div>
      {message}
      <h1>로그인 된 사용자만 들어올 수 있는 상점 페이지</h1>
      <button onClick={logout}>로그아웃</button>
      <br />

      <h2>카운트: {count}</h2>
      <div>
        <button onClick={() => setCount((prev) => prev + 1)}>
          카운트 증가
        </button>
      </div>
      <br />

      <div>
        <button onClick={() => router.push(`/shop/${count}`)}>화면 이동</button>
      </div>
      <br />

      <div>
        <button onClick={healthCheck}>백엔드 서버로 API Call</button>
      </div>
      <br />

      <div>
        <button onClick={getToken}>토큰 Check and Refresh 해보기</button>
      </div>
    </div>
  );
};

export default ShopPage;

export const getServerSideProps = withSessionSSR(async () => {
  const result = await serviceAPI<string>({
    url: '/',
    method: 'GET',
  });

  return {
    props: {
      message: result.data,
    },
  };
});
