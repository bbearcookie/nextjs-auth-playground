import { authAPI } from '@/apis/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { withSessionHandler } from '@/hocs/withSession';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import type { NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  accessToken?: string;
  refreshToken?: string;
};

export default withSessionHandler(
  async (req, res: NextApiResponse<ResponseData>) => {
    if (req.method === 'POST') {
      const session = await getIronSession<SessionType>(
        req,
        res,
        sessionOptions
      );

      const result = await authAPI.postSignIn({
        data: {
          email: req.body.email,
          password: req.body.password,
        },
      });

      session.accessToken = result.accessToken;
      session.refreshToken = result.refreshToken;

      await session.save();

      res.status(200).json({
        message: '로그인 성공! 세션에 토큰을 보관했습니다.',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    }
  }
);
