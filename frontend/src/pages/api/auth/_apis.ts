import { nextServerAPI } from '@/lib/nextServerAPI';
import { BrowserSession } from '@/lib/session';

export const nextServerAuthAPI = {
  /** 로그인 */
  postSignIn: async (params: { data: { email: string; password: string } }) => {
    const res = await nextServerAPI<{
      accessToken?: string;
      refreshToken?: string;
    }>({
      method: 'post',
      url: '/api/auth/signin',
      data: params.data,
    });

    if (res.data.accessToken && res.data.refreshToken) {
      BrowserSession.set(res.data.accessToken, res.data.refreshToken);
    }

    return res.data;
  },

  /** 로그아웃 */
  postSignOut: async () => {
    const res = await nextServerAPI({
      method: 'post',
      url: '/api/auth/signout',
    });

    BrowserSession.clear();

    return res.data;
  },

  /** 토큰 갱신 */
  getToken: async () => {
    const res = await nextServerAPI<{
      accessToken?: string;
      refreshToken?: string;
    }>({
      method: 'get',
      url: '/api/auth/token',
    });

    if (res.data.accessToken && res.data.refreshToken) {
      BrowserSession.set(res.data.accessToken, res.data.refreshToken);
    }

    return res.data;
  },
} as const;
