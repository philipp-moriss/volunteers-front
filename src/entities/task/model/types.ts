export enum TaskStatus {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskResponseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TaskApproveRole {
  VOLUNTEER = 'volunteer',
  NEEDY = 'needy',
}

export interface Task {
  id: string;
  programId: string;
  needyId: string;
  type: string;
  title: string;
  description: string;
  details?: string;
  points: number;
  status: TaskStatus;
  categoryId?: string;
  skillIds?: string[];
  firstResponseMode: boolean;
  assignedVolunteerId?: string;
  approveBy: TaskApproveRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResponse {
  id: string;
  taskId: string;
  volunteerId: string;
  programId: string;
  status: TaskResponseStatus;
  createdAt: Date;
}

export interface CreateTaskDto {
  programId: string;
  needyId: string;
  type: string;
  title: string;
  description: string;
  details?: string;
  points?: number;
  categoryId?: string;
  skillIds?: string[];
  firstResponseMode?: boolean;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface ApproveTaskDto {
  role: TaskApproveRole;
}

export interface ApproveVolunteerDto {
  volunteerId: string;
}

export interface AssignVolunteerDto {
  volunteerId: string;
}
