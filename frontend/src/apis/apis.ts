import { BASE_URL, serviceAPI } from '@/lib/serviceAPI';
import axios from 'axios';

type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export const authAPI = {
  /** 로그인 */
  postSignIn: async (params: {
    data: { email: string; password: string };
    query?: { code: string };
  }) => {
    const res = await axios<AuthTokenResponse>({
      baseURL: BASE_URL,
      method: 'post',
      url: '/auth/signin',
      data: params.data,
      params: params.query,
    });

    return res.data;
  },

  /** 토큰 갱신 */
  getToken: async (params: { query: { refreshToken: string } }) => {
    const res = await axios<AuthTokenResponse>({
      baseURL: BASE_URL,
      method: 'get',
      url: '/auth/token',
      params: params.query,
    });

    return res.data;
  },

  /** 내 정보 조회 */
  getMyInfo: async () => {
    const res = await serviceAPI<{
      email: string;
      name: string;
    }>({
      method: 'get',
      url: '/auth/myinfo',
    });

    return res.data;
  },
} as const;
