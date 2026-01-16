import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TaskList} from '@/widgets/task-list';
import {Header} from '@/shared/ui';
import {useGetTasks} from "@/entities/task/hook";

export const TasksPage: FC = () => {
  const {t} = useTranslation();
  const tabs = ['All tasks', 'My tasks'];
  const [activeTab, setActiveTab] = useState(tabs[0]);


  const { data: tasks = [], isLoading: isLoading } = useGetTasks();




  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={t('tasks.title')}
        // rightActions={}
      />
      {/*<Tabs tabs={tabs} onChange={setActiveTab}/>*/}
      <div className="px-4 py-6">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};
