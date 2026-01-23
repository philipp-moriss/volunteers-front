import {apiClient} from "@/shared/api";
import {Category} from "@/entities/category/model/types.ts";

export const categoryApi = {
    getCategories: () => {
        return apiClient.request<Category[]>('/categories');
    },
};