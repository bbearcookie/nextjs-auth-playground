import { authAPI } from '@/apis/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { withSessionHandler } from '@/hocs/withSession';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default withSessionHandler(
  async (req, res: NextApiResponse<ResponseData>) => {
    if (req.method === 'POST') {
      const session = await getIronSession<SessionType>(
        req,
        res,
        sessionOptions
      );

      session.destroy();
    }

    res.status(200).json({ message: '로그아웃 성공!' });
  }
);
