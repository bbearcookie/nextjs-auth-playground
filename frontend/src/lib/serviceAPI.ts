import { isServer } from '@/utils/isServer';
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { ServerSession, BrowserSession } from './session';
import { nextServerAuthAPI } from '@/pages/api/auth/_apis';
import { RetryQueue } from './retryQueue';

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
        // 토큰 만료 시 토큰 재발급 후 요청 재시도
        if (`${error?.response?.data?.errorCode}` === '4444') {
          if (RetryQueue.isRefreshing === true) {
            return new Promise((resolve, reject) => {
              RetryQueue.add({
                config,
                resolve,
                reject,
              });
            });
          } else if (RetryQueue.isRefreshing === false) {
            RetryQueue.isRefreshing = true;

            try {
              await nextServerAuthAPI.getToken();

              while (!RetryQueue.isEmpty()) {
                const item = RetryQueue.shift();
                if (!item) break;
                serviceAPI(item.config).then(item.resolve).catch(item.reject);
              }

              return serviceAPI(config);
            } catch (err) {
              RetryQueue.reset();
              await nextServerAuthAPI.postSignOut();
              window.location.href = '/auth/signin';
            } finally {
              RetryQueue.isRefreshing = false;
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api(config);
};
