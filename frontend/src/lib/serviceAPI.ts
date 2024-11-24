import { isServer } from '@/utils/isServer';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { asyncLocalStorage } from './sessionContext';

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const accessToken = isServer()
    ? asyncLocalStorage?.getStore()?.accessToken
    : browserSession.accessToken;

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

/** 브라우저에서 전역 변수로 보관할 세션 정보 */
export const browserSession = {
  _accessToken: undefined as string | undefined,
  _refreshToken: undefined as string | undefined,

  get accessToken() {
    return isServer() ? undefined : this._accessToken;
  },

  get refreshToken() {
    return isServer() ? undefined : this._refreshToken;
  },

  set accessToken(value: string | undefined) {
    if (isServer()) return;
    this._accessToken = value;
  },

  set refreshToken(value: string | undefined) {
    if (isServer()) return;
    this._refreshToken = value;
  },
};
