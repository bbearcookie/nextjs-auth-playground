import { isServer } from '@/utils/isServer';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServerSession, BrowserSession } from './session';

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const accessToken = isServer()
    ? ServerSession?.getStore()?.accessToken
    : BrowserSession.get()?.accessToken;

  if (isServer()) {
    console.log('[serviceAPI] 서버에서 API Call', accessToken);
  } else {
    console.log('[serviceAPI] 브라우저에서 API Call', accessToken);
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
