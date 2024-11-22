import { isServer } from '@/utils/isServer';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { Suspense, useState } from 'react';
import { browserSession } from '../lib/serviceAPI';
import '@/styles/globals.css';

export default function App({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) {
  const accessToken = session?.accessToken;

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

  if (isServer()) {
    console.log('서버입니다 session', session);
  } else {
    browserSession.accessToken = accessToken;
    console.log('클라이언트입니다 session', session);
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
