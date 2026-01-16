import {useQuery} from "@tanstack/react-query";
import {Task, taskApi} from "@/entities/task";
import {QUERY_KEYS} from "@/shared/api/hook/query-keys.ts";

export const useGetTasks = () => {
  return useQuery<Task[]>(
    {
      queryKey: [QUERY_KEYS.TASKS],
      queryFn: () => taskApi.getTasks()
    }
  )
}