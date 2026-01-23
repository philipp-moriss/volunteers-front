import {apiClient} from "@/shared/api";
import {Skill} from "@/entities/category/model";

export const skillsApi = {
    getSkills: () => apiClient.request<Skill[]>('/skills'),
    getSkill: (id: string) => apiClient.request<Skill>(`/skills/${id}`),
};