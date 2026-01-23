import {PopularTaskTile} from "@/entities/task/ui/popular-task-tile";
import {useQuery} from "@tanstack/react-query";
import {taskApi} from "@/entities/task";

export const PopularTaskScroll = () => {
    const { data: popularTask } = useQuery({
        queryKey: ['my-recent-tasks'],
        queryFn: () => taskApi.getMyTasks(),
    });
    return (
        <div dir="rtl" className="flex gap-2.5 overflow-x-auto px-[20px] pb-4 mt-3">
            {popularTask?.map((popularTask, index) => (
                <PopularTaskTile key={popularTask.id} popularTask={popularTask} place={index}/>
        ))}
        </div>
    );
}