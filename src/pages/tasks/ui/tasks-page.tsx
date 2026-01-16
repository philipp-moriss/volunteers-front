import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TaskList} from '@/widgets/task-list';
import {Header, IconButton} from '@/shared/ui';
import {useGetTasks} from "@/entities/task/hook";
import {Tabs} from "@/shared/ui/tabs";

export const TasksPage: FC = () => {
  const {t} = useTranslation();
  const tabs = ['All tasks', 'My tasks'];
  const [activeTab, setActiveTab] = useState(tabs[0]);


  const {data: tasks = [], isLoading: isLoading} = useGetTasks();


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={t('tasks.title')}
        rightActions={[
          <IconButton
            key="profile"
            variant="ghost"
            aria-label={t('common.profile')}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 17 17"
                fill="none"
                className="w-5 h-5"
              >
                <path
                  d="M11.825 0H4.84167C1.80833 0 0 1.80833 0 4.84167V11.825C0 14.1667 1.075 15.775 2.96667 16.3833C3.51667 16.575 4.15 16.6667 4.84167 16.6667H11.825C12.5167 16.6667 13.15 16.575 13.7 16.3833C15.5917 15.775 16.6667 14.1667 16.6667 11.825V4.84167C16.6667 1.80833 14.8583 0 11.825 0ZM15.4167 11.825C15.4167 13.6083 14.7167 14.7333 13.3083 15.2C12.5 13.6083 10.5833 12.475 8.33333 12.475C6.08333 12.475 4.175 13.6 3.35833 15.2H3.35C1.95833 14.75 1.25 13.6167 1.25 11.8333V4.84167C1.25 2.49167 2.49167 1.25 4.84167 1.25H11.825C14.175 1.25 15.4167 2.49167 15.4167 4.84167V11.825Z"
                  fill="currentColor"
                />
              </svg>
            }
            className="text-deepBlue"
            onClick={() => console.log('Клик!')}
          />
        ]}
      />
      <Tabs tabs={tabs} onChange={setActiveTab}/>
      <div className="px-4 py-6">
        <TaskList tasks={tasks}/>
      </div>
    </div>
  );
};
