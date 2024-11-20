import { authAPI } from '@/apis/auth';
import { sessionOptions } from '@/config/session-options';
import { nextAPI } from '@/pages/lib/next-api';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const session = await getIronSession<SessionType>(req, res, sessionOptions);

    const result = await authAPI.postSignIn({
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });

    session.accessToken = result.accessToken;
    await session.save();
  }

  res.status(200).json({ message: 'Hello from Next.js!' });
}

export const next_authAPI = {
  postSignIn: async (params: { data: { email: string; password: string } }) => {
    const res = await nextAPI({
      url: '/api/auth/signin',
      method: 'post',
      data: params.data,
    });

    return res;
  },
} as const;
