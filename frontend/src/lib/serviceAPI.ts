import { isServer } from '@/utils/isServer';
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { ServerSession, BrowserSession } from './session';
import { nextServerAuthAPI } from '@/pages/api/auth/_apis';

export const BASE_URL = 'http://localhost:5010';

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const accessToken = isServer()
    ? ServerSession?.getStore()?.accessToken
    : BrowserSession.get()?.accessToken;

  const api = axios.create({
    baseURL: BASE_URL,
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

        if (`${error?.response?.data?.errorCode}` === '4444') {
          try {
            console.log('토큰 재발급');
            await nextServerAuthAPI.getToken();
            return serviceAPI(config);
          } catch (err) {
            console.log('토큰 재발급 실패');
            await nextServerAuthAPI.postSignOut();
            window.location.href = '/auth/signin';
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api(config);
};
