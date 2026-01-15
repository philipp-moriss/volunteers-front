import { programApi } from "@/entities/program/api";
import { Program } from "@/entities/program/model/types";
import { QUERY_KEYS } from "@/shared/api/hook/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetPrograms = () => {
  return useQuery<Program[]>({
    queryKey: [QUERY_KEYS.PROGRAMS],
    queryFn: () => programApi.getPrograms()
  });
};