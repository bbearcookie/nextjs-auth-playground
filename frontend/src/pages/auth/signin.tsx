import { useRouter } from 'next/router';
import React from 'react';
import { nextServerAuthAPI } from '@/pages/api/auth/_apis';

const SignInPage = () => {
  const router = useRouter();

  const handleLogin = async () => {
    const res = await nextServerAuthAPI.postSignIn({
      data: {
        email: 'bear@naver.com',
        password: '1234',
      },
    });

    router.replace('/shop');
  };

  return (
    <div>
      Welcome to SignIn Page <hr />
      <button onClick={handleLogin}>로그인 하기</button>
    </div>
  );
};

export default SignInPage;
