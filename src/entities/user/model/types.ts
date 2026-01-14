export type UserRole = 'volunteer' | 'needy' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';

// Базовый тип пользователя (без пароля и refreshTokenHash)
export interface BaseUser {
  id: string;
  phone: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  firstName: string | null;
  lastName: string | null;
  photo: string | null;
  about: string | null;
  lastLoginAt: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Типы для профилей ролей
export interface VolunteerProfile {
  id: string;
  userId: string;
  points: number;
  completedTasksCount: number;
  rating: number | null;
  programs?: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  skills?: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface NeedyProfile {
  id: string;
  userId: string;
  programId: string;
  creatorId: string;
  program?: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
  creator?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    [key: string]: unknown;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminProfile {
  id: string;
  userId: string;
  ownedPrograms?: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  createdByAdmin?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    [key: string]: unknown;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Типы для пользователей с данными роли
export interface UserWithVolunteerData extends BaseUser {
  role: 'volunteer';
  profile: VolunteerProfile;
}

export interface UserWithNeedyData extends BaseUser {
  role: 'needy';
  profile: NeedyProfile;
}

export interface UserWithAdminData extends BaseUser {
  role: 'admin';
  profile: AdminProfile;
}

// Объединенный тип для всех расширенных пользователей
export type UserWithRoleData =
  | UserWithVolunteerData
  | UserWithNeedyData
  | UserWithAdminData;

// Для обратной совместимости
export type User = BaseUser;
