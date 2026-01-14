import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api';
import { VerifySmsRequest } from '../types';
import { setToken, setRefreshToken } from '@/shared/lib/auth';

export function useVerifySms() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifySmsRequest) => authApi.verifySms(data),
    onSuccess: async (data) => {
      // Валидация данных ответа - проверяем что все обязательные поля присутствуют
      if (!data || !data.accessToken || !data.refreshToken || !data.user) {
        console.error('Некорректные данные ответа:', data);
        toast.error('Ошибка входа', {
          description: 'Получены некорректные данные от сервера',
          duration: 5000,
        });
        throw new Error('Некорректные данные ответа от сервера');
      }

      try {
        // Сохраняем токены в localStorage
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        // Устанавливаем данные пользователя в кэш БЕЗ перезапроса
        // Это предотвращает возможную 401 ошибку при refetch сразу после логина
        queryClient.setQueryData(['user', 'me'], data.user);

        // Показываем успешное уведомление
        toast.success('Добро пожаловать!', {
          description: `Привет, ${data.user.firstName || data.user.phone || 'Пользователь'}! Вы успешно вошли в систему`,
          duration: 4000,
        });

        // Редирект на основе роли пользователя
        // Если новый пользователь (нет firstName) - на онбординг
        // Если существующий - на главную по роли
        if (!data.user.firstName && data.user.role === 'volunteer') {
          navigate('/volunteer/onboarding', { replace: true });
        } else {
          const roleRoutes: Record<string, string> = {
            volunteer: '/volunteer',
            needy: '/needy',
            admin: '/admin',
          };
          const redirectPath = roleRoutes[data.user.role] || '/auth';
          navigate(redirectPath, { replace: true });
        }
      } catch (error) {
        console.error('Ошибка при сохранении токенов:', error);
        toast.error('Ошибка входа', {
          description: 'Не удалось сохранить данные авторизации',
          duration: 5000,
        });
        throw error;
      }
    },
    onError: (error: unknown) => {
      console.error('Ошибка верификации SMS:', error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as Error)?.message ||
        'Неверный код подтверждения';

      toast.error('Ошибка входа', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}
