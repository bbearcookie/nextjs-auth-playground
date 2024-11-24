import { withSessionSSR } from '@/hocs/withSession';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

const ShopIdPage = ({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

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

export const getServerSideProps = withSessionSSR(async (context) => {
  return {
    props: {
      message: 'hello',
    },
  };
});
