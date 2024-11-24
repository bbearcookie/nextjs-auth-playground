import { isServer } from '@/utils/isServer';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { Suspense, useState } from 'react';
import { BrowserSession } from '@/lib/session';
import '@/styles/globals.css';

export default function App({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) {
  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 5,
          },
        },
      })
  );

  if (!isServer()) {
    BrowserSession.set(accessToken, refreshToken);
  }

  if (isServer()) {
    console.log('[_app.tsx] 서버 환경의 session', session);
  } else {
    console.log('[_app.tsx] 브라우저 환경의 session', session);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>로딩중</div>}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen />
        </Suspense>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
