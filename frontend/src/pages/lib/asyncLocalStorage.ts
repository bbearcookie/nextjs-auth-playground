import { SessionType } from '@/types/session';
import { isServer } from '@/utils/isServer';
import { AsyncLocalStorage } from 'async_hooks';

export let asyncLocalStorage: AsyncLocalStorage<SessionType> | undefined;

if (isServer()) {
  asyncLocalStorage = new AsyncLocalStorage<SessionType>();
}
