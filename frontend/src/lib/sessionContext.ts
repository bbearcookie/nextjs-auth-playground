import { isServer } from '@/utils/isServer';
import { SessionType } from '@/types/session';
import { AsyncLocalStorage } from 'async_hooks';

/** 서버에서 사용할 수 있는 세션 정보를 공유하는 컨텍스트 */
let asyncLocalStorage: AsyncLocalStorage<SessionType> | undefined;

if (isServer()) {
  asyncLocalStorage = new AsyncLocalStorage<SessionType>();
}

export { asyncLocalStorage };
