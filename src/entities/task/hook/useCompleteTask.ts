import {useMutation, useQueryClient} from "@tanstack/react-query";
import {taskApi} from "@/entities/task";
import {QUERY_KEYS} from "@/shared/api/hook/query-keys.ts";

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskApi.approveCompletion(taskId, { role: 'volunteer' }),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
    },
  });
};
