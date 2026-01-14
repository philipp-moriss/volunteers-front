import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api';
import { UserWithRoleData } from '@/entities/user/model/types';
import { getToken, removeToken, removeRefreshToken } from '@/shared/lib/auth';
import { useState, useEffect } from 'react';

export function useGetMe() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  return useQuery<UserWithRoleData | null>({
    queryKey: ['user', 'me'],
    queryFn: async (): Promise<UserWithRoleData | null> => {
      try {
        // Бэкенд возвращает UserWithRoleData напрямую, а не объект с полем user
        const response = await authApi.getMe();
        return response || null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    },
    enabled: hasToken === true, // Выполнять запрос только если есть токен
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
    refetchOnWindowFocus: false, // не перезагружать при фокусе окна
    refetchOnMount: false, // не перезагружать при монтировании
    retry: (failureCount, error: unknown) => {
      // Не повторять запрос при 401 ошибке - interceptor уже обработает это
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        removeToken();
        removeRefreshToken();
        return false;
      }
      // Повторить максимум 2 раза для других ошибок
      return failureCount < 2;
    },
  });
}
