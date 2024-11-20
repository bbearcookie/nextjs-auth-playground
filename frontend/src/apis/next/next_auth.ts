import { nextAPI } from '@/pages/lib/next-api';

export const next_authAPI = {
  postSignIn: async (params: { data: { email: string; password: string } }) => {
    const res = await nextAPI({
      url: '/api/auth/signin',
      method: 'post',
      data: params.data,
    });

    return res;
  },
  postSignOut: async () => {
    const res = await nextAPI({
      url: '/api/auth/signout',
      method: 'post',
    });

    return res;
  },
} as const;
