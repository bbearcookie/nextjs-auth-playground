import { sessionOptions } from '@/config/sessionOptions';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import { GetServerSidePropsContext } from 'next';
import { asyncLocalStorage } from '../lib/sessionContext';

export function withSessionContext<T>(
  handler: (context: GetServerSidePropsContext) => Promise<T>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getIronSession<SessionType>(
      context.req,
      context.res,
      sessionOptions
    );

    return asyncLocalStorage?.run({ accessToken: session.accessToken }, () => {
      return handler(context);
    });
  };
}
