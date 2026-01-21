import { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens } from '@/shared/lib/auth';

// Автоматическое определение API URL
const getApiBaseUrl = (): string => {
  // Если указан явно через переменную окружения
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Если запущено локально, используем текущий хост с портом бэкенда
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Если это localhost или IP адрес локальной сети, используем порт 3000
    if (host === 'localhost' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      return `http://${host === 'localhost' ? 'localhost' : host}:3000`;
    }
  }

  // По умолчанию production URL
  return "https://volunteers-backend-production.up.railway.app";
};

const API_BASE_URL = getApiBaseUrl();

// Логирование API URL в development режиме
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshTokens(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const accessToken = getToken();
        const refreshToken = getRefreshToken();

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens available');
        }

        const response = await fetch(`${this.baseUrl}/auth/user/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh tokens');
        }

        const data = await response.json();
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      } catch (error) {
        clearTokens();
        // Перенаправление на страницу авторизации
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = getToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Обработка 401 ошибки - попытка обновить токены
    if (response.status === 401 && token) {
      try {
        await this.refreshTokens();
        
        // Повторяем запрос с новым токеном
        const newToken = getToken();
        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
        }

        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (error) {
        // Если refresh не удался, токены уже очищены и произошел редирект
        throw error;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Если не удалось распарсить JSON, используем текст ошибки
        if (errorText) {
          errorMessage = errorText;
        }
      }

      const error = new Error(errorMessage) as Error & { status?: number; response?: Response };
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
