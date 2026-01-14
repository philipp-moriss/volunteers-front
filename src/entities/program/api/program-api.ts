import { apiClient } from '@/shared/api';
import { Program } from '../model/types';

export const programApi = {
  getPrograms: () => apiClient.request<Program[]>('/program'),
  getProgram: (id: string) => apiClient.request<Program>(`/program/${id}`),
};
