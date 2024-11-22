import { SessionProvider } from '@/providers/SessionProvider';
import '@/styles/globals.css';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { Suspense, useState } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
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

  console.log('session', session);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <SessionProvider accessToken={accessToken}>
          <Suspense fallback={<div>로딩중</div>}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen />
          </Suspense>
        </SessionProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
