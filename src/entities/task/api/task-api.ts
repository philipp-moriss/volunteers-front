import { apiClient } from '@/shared/api';
import {
  Task,
  TaskResponse,
  CreateTaskDto,
  UpdateTaskDto,
  ApproveTaskDto,
  AssignVolunteerDto,
  ApproveVolunteerDto,
  TaskStatus,
} from '../model/types';

interface GetTasksParams {
  programId?: string;
  status?: TaskStatus;
  categoryId?: string;
  skillIds?: string | string[];
}

export const taskApi = {
  getTasks: (params?: GetTasksParams) => {
    const queryParams = new URLSearchParams();
    if (params?.programId) queryParams.append('programId', params.programId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.skillIds) {
      const skillIdsArray = Array.isArray(params.skillIds) ? params.skillIds : [params.skillIds];
      skillIdsArray.forEach((id) => queryParams.append('skillIds', id));
    }
    const queryString = queryParams.toString();
    return apiClient.request<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  getTask: (id: string) => apiClient.request<Task>(`/tasks/${id}`),

  // getTaskById: async (id: string): Promise<Task> => {
  //   const response = apiClient.request<Task>(`/tasks/${id}`);
  //   return response.data;
  // },

  getMyTasks: () => apiClient.request<Task[]>('/tasks/my'),

  getAssignedTasks: () => apiClient.request<Task[]>('/tasks/assigned'),

  createTask: (data: CreateTaskDto) =>
    apiClient.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTask: (id: string, data: UpdateTaskDto) =>
    apiClient.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) => apiClient.request<void>(`/tasks/${id}`, { method: 'DELETE' }),

  assignVolunteer: (id: string, data: AssignVolunteerDto) =>
    apiClient.request<Task>(`/tasks/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelAssignment: (id: string) =>
    apiClient.request<Task>(`/tasks/${id}/cancel-assignment`, {
      method: 'POST',
    }),

  approveCompletion: (id: string, data: ApproveTaskDto) =>
    apiClient.request<Task>(`/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const taskResponseApi = {
  respond: (taskId: string) =>
    apiClient.request<TaskResponse>(`/task-responses/task/${taskId}/respond`, {
      method: 'POST',
    }),

  cancelResponse: (taskId: string) =>
    apiClient.request<void>(`/task-responses/task/${taskId}/respond`, {
      method: 'DELETE',
    }),

  getByTaskId: (taskId: string) =>
    apiClient.request<TaskResponse[]>(`/task-responses/task/${taskId}`),

  approveVolunteer: (taskId: string, data: ApproveVolunteerDto) =>
    apiClient.request<TaskResponse>(`/task-responses/task/${taskId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  rejectVolunteer: (taskId: string, data: ApproveVolunteerDto) =>
    apiClient.request<TaskResponse>(`/task-responses/task/${taskId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByVolunteerId: (volunteerId: string) =>
    apiClient.request<TaskResponse[]>(`/task-responses/volunteer/${volunteerId}`),
};
