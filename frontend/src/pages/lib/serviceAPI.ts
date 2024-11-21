import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

let browserAccessToken: string | null = null;

/** 서비스의 백엔드 서버와 통신하기 위한 클라이언트 */
export const serviceAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // TODO: 서버, 클라이언트 환경에 따라 액세스 토큰 가져오기
  const accessToken =
    typeof window === 'undefined' ? undefined : browserAccessToken;

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
