import {FC} from 'react';
import {Task} from '../../model/types';
import {useNavigate} from "react-router-dom";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({task}) => {

  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/volunteer/tasks/${task.id}/preview`)
  }

  return (
    <div
      className='flex items-center justify-between border border-[#e0e7ff] rounded-2xl p-4 shadow-[2px_2px_0_0_#e0e7ff] bg-white'
      onClick={handleClick}
    >

      <div className="flex flex-col justify-between">

        <span
          className={`
            font-sans text-[14px] font-normal text-[#393939] px-2 py-0.5 rounded-full w-fit mb-1
            ${task.status === 'active' && 'bg-pastel-peach'}
            ${task.status === 'in_progress' && 'bg-pastel-blue '}
            ${task.status === 'completed' && 'bg-pastel-green'}
            ${task.status === 'cancelled' && 'bg-pastel-pink '}
          `}
        >
          {task.status}
        </span>

        <h3 className="font-sans font-medium text-lg text-[#000] truncate">
          {task.title}
        </h3>

        <p className="font-sans font-normal text-[14px] text-[#4f4f4f]">
          {task.points}
        </p>

        <p className="font-sans font-normal text-deepBlue text-[14px]">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div
        className="w-[88px] h-[88px] rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src="/task-placeholder.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};