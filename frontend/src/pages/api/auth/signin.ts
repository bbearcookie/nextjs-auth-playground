import { authAPI } from '@/apis/auth';
import { sessionOptions } from '@/config/session-options';
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

    const result = await authAPI.signIn({
      data: {
        email: 'hello@naver.com',
        password: '1234',
      },
      query: {
        code: 'hello my querystring',
      },
    });

    session.accessToken = result.accessToken;
    await session.save();
  }
  res.status(200).json({ message: 'Hello from Next.js!' });
}
