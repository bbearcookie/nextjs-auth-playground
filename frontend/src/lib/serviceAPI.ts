import { isServer } from '@/utils/isServer';
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { ServerSession, BrowserSession } from './session';
import { nextServerAuthAPI } from '@/pages/api/auth/_apis';

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const accessToken = isServer()
    ? ServerSession?.getStore()?.accessToken
    : BrowserSession.get()?.accessToken;

  const api = axios.create({
    baseURL: 'http://localhost:5010',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      ...config.headers,
    },
  });

  if (isServer()) {
    console.log('serviceAPI', accessToken, config.url);
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!isServer() && isAxiosError(error)) {
        console.log(error.response?.data);

        switch (error?.response?.data?.errorCode) {
          case 4444:
            console.log('토큰 재발급');
            await nextServerAuthAPI.getToken();
            return serviceAPI(config);
          case 5555:
            console.log('리프레쉬 만료됨. 로그아웃 처리 필요');
            await nextServerAuthAPI.postSignOut();
            break;
          default:
            break;
        }
      }

      return Promise.reject(error);
    }
  );

  return api(config);
};
