import { nextServerAPI } from '@/pages/lib/nextServerAPI';

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

  /** iron-session 토큰으로 세션 정보 가져오기 */
  getToken: async () => {
    const res = await nextServerAPI<{
      accessToken: string;
    }>({
      method: 'get',
      url: '/api/auth/token',
    });

    console.log('res.data', res.data);

    return res.data;
  },
} as const;
