import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "@/shared/api/hook/query-keys.ts";
import {Task, taskApi} from "@/entities/task";

export const useGetTaskById = (taskId: string | undefined) => {
  return useQuery<Task>({
    queryKey: [QUERY_KEYS.TASKS, taskId],
    queryFn: () => taskApi.getTask(taskId!),
    enabled: !!taskId,
  });
};
