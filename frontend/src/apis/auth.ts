import { serviceAPI } from '@/pages/lib/service-api';

export const authAPI = {
  postSignIn: async (params: {
    data: { email: string; password: string };
    query?: { code: string };
  }) => {
    const res = await serviceAPI<{
      accessToken: string;
    }>({
      url: '/auth/signin',
      method: 'post',
      data: params.data,
      params: params.query,
    });

    return res.data;
  },
} as const;
