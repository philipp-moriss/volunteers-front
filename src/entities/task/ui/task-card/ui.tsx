import { FC } from 'react';
import { Task } from '../../model/types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  return (
    <div className='flex items-center justify-between border border-[#e0e7ff] rounded-2xl p-4 shadow-[2px_2px_0_0_#e0e7ff] bg-white'>

      <div className="flex flex-col justify-between">

        <span
          className={`
            font-sans text-[14px] font-normal text-[#393939] px-2 py-0.5 rounded-full w-fit mb-1
            ${task.status === 'active' && 'bg-yellow-100 text-yellow-700'}
            ${task.status === 'in_progress' && 'bg-blue-100 text-blue-700'}
            ${task.status === 'completed' && 'bg-green-100 text-green-700'}
            ${task.status === 'cancelled' && 'bg-red-100 text-red-700'}
          `}
        >
          {task.status}
        </span>

        <h3 className="font-sans font-medium text-lg text-[#000]">
          {task.title}
        </h3>

        <p className="font-sans font-normal text-[14px] text-[#4f4f4f]">
          {task.points}
        </p>

        <p className="font-sans font-normal text-[#004573] text-[14px]">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="w-[88px] h-[88px] rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src="/task-placeholder.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};