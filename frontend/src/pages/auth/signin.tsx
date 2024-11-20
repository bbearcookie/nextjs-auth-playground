import React from 'react';
import { next_authAPI } from '../api/auth/signin';

const SignInPage = () => {
  const handleLogin = async () => {
    const res = await next_authAPI.postSignIn({
      data: {
        email: 'bear@naver.com',
        password: '1234',
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
