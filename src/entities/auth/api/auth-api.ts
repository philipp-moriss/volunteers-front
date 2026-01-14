import { apiClient } from '@/shared/api';
import {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  AuthResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  GetMeResponse,
} from '../model/types';

export const authApi = {
  // Отправка SMS кода
  sendSms: async (data: SendSmsRequest): Promise<SendSmsResponse> => {
    const payload: Record<string, unknown> = {
      phoneNumber: data.phoneNumber,
    };
    
    payload.isDev = true;

    return apiClient.request<SendSmsResponse>('/auth/user/sms/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Верификация SMS кода и авторизация
  verifySms: async (data: VerifySmsRequest): Promise<AuthResponse> => {
    const response = await apiClient.request<AuthResponse>('/auth/user/sms/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Проверяем что ответ содержит все необходимые данные
    if (
      !response ||
      !response.accessToken ||
      !response.refreshToken ||
      !response.user
    ) {
      throw new Error('Некорректный формат ответа от сервера');
    }

    return response;
  },

  // Обновление токенов
  refreshTokens: async (
    data: RefreshTokensRequest
  ): Promise<RefreshTokensResponse> => {
    return apiClient.request<RefreshTokensResponse>('/auth/user/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Получение данных текущего пользователя
  getMe: async (): Promise<GetMeResponse> => {
    const response = await apiClient.request<GetMeResponse>('/auth/user/me');
    return response;
  },

  // Выход из системы
  logout: async (): Promise<{ message: string }> => {
    return apiClient.request<{ message: string }>('/auth/user/logout', {
      method: 'POST',
    });
  },
};
