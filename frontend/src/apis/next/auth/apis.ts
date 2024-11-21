import { nextServerAPI } from '@/pages/lib/nextServerAPI';

export const nextServerAuthAPI = {
  postSignIn: async (params: { data: { email: string; password: string } }) => {
    const res = await nextServerAPI({
      url: '/api/auth/signin',
      method: 'post',
      data: params.data,
    });

    return res;
  },
  postSignOut: async () => {
    const res = await nextServerAPI({
      url: '/api/auth/signout',
      method: 'post',
    });

    return res;
  },
} as const;
