import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/** Next.js API Route와 통신하기 위한 클라이언트 */
export const nextServerAPI = <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const api = axios.create({
    baseURL: 'http://localhost:3000',
  });

  return api(config);
};
