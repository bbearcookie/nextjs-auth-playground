import { serviceAPI } from '@/lib/serviceAPI';

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
    const res = await serviceAPI<AuthTokenResponse>({
      url: '/auth/signin',
      method: 'post',
      data: params.data,
      params: params.query,
    });

    return res.data;
  },

  /** 토큰 갱신 */
  getToken: async (params: { query: { refreshToken: string } }) => {
    const res = await serviceAPI<AuthTokenResponse>({
      url: '/auth/token',
      method: 'get',
      params: params.query,
    });

    return res.data;
  },
} as const;
