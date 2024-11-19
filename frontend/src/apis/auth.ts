import { apiInstance } from '@/pages/lib/api-instance';

export const authAPI = {
  signIn: async (params: {
    data: { email: string; password: string };
    query: { code: string };
  }) => {
    const res = await apiInstance<{
      accessToken: string;
    }>({
      url: '/auth/signin',
      method: 'post',
      data: params.data,
      params: params.query,
    });

    return res;
  },
} as const;
