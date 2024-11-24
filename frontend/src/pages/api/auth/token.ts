import { authAPI } from '@/apis/apis';
import { sessionOptions } from '@/config/sessionOptions';
import { withSessionHandler } from '@/hocs/withSession';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import { NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default withSessionHandler(
  async (req, res: NextApiResponse<ResponseData>) => {
    if (req.method === 'GET') {
      const session = await getIronSession<SessionType>(
        req,
        res,
        sessionOptions
      );

      if (!session.refreshToken) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
      }

      const result = await authAPI.getToken({
        query: {
          refreshToken: session.refreshToken,
        },
      });

      session.accessToken = result.accessToken;
      session.refreshToken = result.refreshToken;

      await session.save();

      res.status(200).json({
        message: `토큰 갱신 성공! --- accessToken: ${result.accessToken} --- refreshToken: ${result.refreshToken}`,
      });
    }
  }
);
