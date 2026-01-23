import {TaskTile} from "@/entities/task/ui/task-tile";
import {useQuery} from "@tanstack/react-query";
import {taskApi} from "@/entities/task";

export const TaskScroll = () => {

    const { data: tasks } = useQuery({
        queryKey: ['my-recent-tasks'],
        queryFn: () => taskApi.getMyTasks(),
    });
    return (
        <div
            dir="rtl"
            className="flex gap-2.5 overflow-x-auto px-[20px] pb-4 mt-3">
            {tasks?.map((task) => (
                <TaskTile key={task.id} task={task} />
            ))}
        </div>
    )
}