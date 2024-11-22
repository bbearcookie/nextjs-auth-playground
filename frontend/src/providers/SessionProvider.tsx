import { createSafeContext } from '@/utils/createSafeContext';

const [SessionProvider, useSessionContext] = createSafeContext<{
  accessToken: string;
}>();

export { SessionProvider, useSessionContext };
