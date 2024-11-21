import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { useRouter } from 'next/router';
import React from 'react';

const ShopPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await nextServerAuthAPI.postSignOut();
    router.replace('/auth/signin');
  };

  return (
    <div>
      <h1>로그인 된 사용자만 들어올 수 있는 상점 페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default ShopPage;
