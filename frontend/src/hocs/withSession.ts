import { sessionOptions } from '@/config/sessionOptions';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext, NextApiHandler } from 'next';
import { ServerSession } from '../lib/session';

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
