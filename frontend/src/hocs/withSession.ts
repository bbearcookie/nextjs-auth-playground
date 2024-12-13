import { sessionOptions } from '@/config/sessionOptions';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext, NextApiHandler } from 'next';
import { ServerSession } from '../lib/session';
import { isTokenExpired } from '@/utils/isTokenExpired';
import { authAPI } from '@/apis/apis';

/** 세션 정보를 getServerSideProps의 컨텍스트에 주입하는 고차함수 */
export function withSessionSSR<T>(
  handler: (context: GetServerSidePropsContext) => Promise<T>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getIronSession<SessionType>(
      context.req,
      context.res,
      sessionOptions
    );
    const accessToken = session.accessToken;
    const refreshToken = session.refreshToken;

    try {
      if (accessToken && isTokenExpired(accessToken)) {
        if (!refreshToken) {
          throw new Error('리프레쉬 토큰이 없습니다.');
        }

        if (refreshToken && isTokenExpired(refreshToken)) {
          throw new Error('리프레쉬 토큰이 만료되었습니다.');
        }

        const refreshedResponse = await authAPI.getToken({
          query: {
            refreshToken,
          },
        });

        session.accessToken = refreshedResponse.accessToken;
        session.refreshToken = refreshedResponse.refreshToken;
        await session.save();
      }
    } catch (err) {
      session.destroy();
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: true,
        },
      };
    }

    return ServerSession?.run(session, async () => {
      const result = (await handler(context)) as { props: T };

      return {
        ...result,
        props: {
          ...result.props,
          session,
        },
      } as T;
    });
  };
}

/** 세션 정보를 API Route의 컨텍스트에 주입하는 고차함수 */
export function withSessionHandler(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const session = await getIronSession<SessionType>(req, res, sessionOptions);

    return ServerSession?.run(session, async () => {
      return handler(req, res);
    });
  };
}
