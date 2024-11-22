import { isServer } from '@tanstack/react-query';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { AsyncLocalStorage } from 'async_hooks';
import { asyncLocalStorage } from './asyncLocalStorage';

export const browserSession = {
  accessToken: undefined as string | undefined,
};

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // TODO: 서버, 클라이언트 환경에 따라 액세스 토큰 가져오기
  // 여기에서 서버단인 경우에는 getIronSession 가져와야 함.
  // AsyncLocalStorage를 활용해서, 서버 단에서의 session 정보를 각 request마다 저장하고 꺼내쓰는 방식?
  // 일종의 서버 단에서 동작하는 Context API같은 느낌
  const accessToken = isServer
    ? asyncLocalStorage?.getStore()?.accessToken
    : browserSession.accessToken;

  if (isServer) {
    console.log('서버에서 API Call 합니다: ', accessToken);
  } else {
    console.log('브라우저에서 API Call 합니다: ', browserSession);
  }

  const api = axios.create({
    baseURL: 'http://localhost:5010',
  });

  config.headers = {
    ...config.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  };

  api.interceptors.request.use((config) => {
    return config;
  });

  api.interceptors.response.use((config) => {
    return config;
  });

  return api(config);
};
