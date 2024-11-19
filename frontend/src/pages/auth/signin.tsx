import { authAPI } from '@/apis/auth';
import React from 'react';

const SignInPage = () => {
  const handleLogin = async () => {
    const res = await authAPI.signIn({
      data: {
        email: 'hello@naver.com',
        password: '1234',
      },
      query: {
        code: 'hello my querystring',
      },
    });

    console.log(res);
  };

  return (
    <div>
      Welcome to SignIn Page <hr />
      <button onClick={handleLogin}>로그인 하기</button>
    </div>
  );
};

export default SignInPage;
