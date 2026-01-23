import {useQueries} from "@tanstack/react-query";
import {QUERY_KEYS} from "@/shared/api/hook/query-keys.ts";
import {skillsApi} from "@/entities/skills/api";

export const useGetSkillById = (ids: string[]) => {
    return useQueries({
        queries: ids.map((id) => ({
            queryKey: [QUERY_KEYS.SKILLS, id],
            queryFn: () => skillsApi.getSkill(id),
            enabled: !!id,
        })),
    });
};