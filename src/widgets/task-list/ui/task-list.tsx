import { FC } from 'react';
import { TaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
