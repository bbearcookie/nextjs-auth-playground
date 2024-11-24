import { nextServerAPI } from '@/lib/nextServerAPI';

export const nextServerAuthAPI = {
  /** 로그인 */
  postSignIn: async (params: { data: { email: string; password: string } }) => {
    const res = await nextServerAPI({
      method: 'post',
      url: '/api/auth/signin',
      data: params.data,
    });

    return res.data;
  },

  /** 로그아웃 */
  postSignOut: async () => {
    const res = await nextServerAPI({
      method: 'post',
      url: '/api/auth/signout',
    });

    return res.data;
  },

  /** 토큰 갱신 */
  getToken: async () => {
    const res = await nextServerAPI({
      method: 'get',
      url: '/api/auth/token',
    });

    return res.data;
  },
} as const;
