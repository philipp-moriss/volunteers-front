import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../../api';
import { RefreshTokensRequest } from '../types';
import { setToken, setRefreshToken, removeToken, removeRefreshToken } from '@/shared/lib/auth';

export function useRefreshTokens() {
  return useMutation({
    mutationFn: (data: RefreshTokensRequest) => authApi.refreshTokens(data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    onError: (error: unknown) => {
      console.error('Ошибка обновления токенов:', error);

      toast.error('Сессия истекла', {
        description: 'Пожалуйста, войдите в систему заново',
        duration: 5000,
      });

      // При ошибке обновления токенов очищаем токены
      removeToken();
      removeRefreshToken();
    },
  });
}
