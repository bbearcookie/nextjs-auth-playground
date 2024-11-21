import { nextServerAuthAPI } from '@/apis/next/auth/apis';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => nextServerAuthAPI.getToken(),
  });
};
