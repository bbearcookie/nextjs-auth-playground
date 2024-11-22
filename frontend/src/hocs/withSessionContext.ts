import { sessionOptions } from '@/config/sessionOptions';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext } from 'next';
import { asyncLocalStorage } from '../lib/sessionContext';

/**
 * 세션 정보를 컨텍스트에 주입하는 HOC
 */
export function withSessionContext<T>(
  handler: (context: GetServerSidePropsContext) => Promise<T>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getIronSession<SessionType>(
      context.req,
      context.res,
      sessionOptions
    );

    return asyncLocalStorage?.run(
      { accessToken: session.accessToken },
      async () => {
        const result = (await handler(context)) as { props: T };

        return {
          ...result,
          props: {
            ...result.props,
            session,
          },
        } as T;
      }
    );
  };
}
