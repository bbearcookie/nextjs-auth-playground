import { isServer } from '@/utils/isServer';
import { SessionType } from '@/types/session';
import { AsyncLocalStorage } from 'async_hooks';

/** 서버에서 요청당 세션 정보를 공유하는 컨텍스트 */
let ServerSession: AsyncLocalStorage<SessionType> | undefined;

if (isServer()) {
  ServerSession = new AsyncLocalStorage<SessionType>();
}

/** 브라우저에서 전역으로 보관할 세션 정보 */
class BrowserSession {
  private static accessToken: string | undefined;
  private static refreshToken: string | undefined;

  static get() {
    if (isServer()) return;
    return {
      accessToken: BrowserSession.accessToken,
      refreshToken: BrowserSession.refreshToken,
    };
  }

  static set(accessToken: string, refreshToken: string) {
    if (isServer()) return;
    BrowserSession.accessToken = accessToken;
    BrowserSession.refreshToken = refreshToken;
  }

  static clear() {
    if (isServer()) return;
    BrowserSession.accessToken = undefined;
    BrowserSession.refreshToken = undefined;
  }
}

export { ServerSession, BrowserSession };
