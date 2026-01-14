export interface Program {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
