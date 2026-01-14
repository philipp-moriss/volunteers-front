import { User, UserWithRoleData } from '@/entities/user/model/types';

export interface SendSmsRequest {
  phoneNumber: string;
  isDev?: boolean;
}

export interface SendSmsResponse {
  message: string;
  code?: string;
}

export interface VerifySmsRequest {
  phoneNumber: string;
  code: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

// GetMeResponse - это напрямую UserWithRoleData, который возвращает бэкенд
export type GetMeResponse = UserWithRoleData;
