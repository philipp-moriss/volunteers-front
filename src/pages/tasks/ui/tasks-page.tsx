import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TaskList} from '@/widgets/task-list';
import {Header, IconButton} from '@/shared/ui';
import {useGetTasks} from "@/entities/task/hook";
import {Tabs} from "@/shared/ui/tabs";
import userIcon from '@/shared/assets/images/userIcon.webp';

export const TasksPage: FC = () => {
  const {t} = useTranslation();
  const tabs = ['All tasks', 'My tasks'];
  const [, setActiveTab] = useState(tabs[0]);


  const {data: tasks = []} = useGetTasks();


  return (
    <section className={'mb-12'}>
      <div className="min-h-screen bg-gray-50">
        <Header
          title={t('tasks.title')}
          rightActions={[
            <IconButton
              className="w-8 h-8 rounded-lg drop-shadow-[2px_2px_0_#004573]"
              key="profile"
              variant="ghost"
              aria-label={t('common.profile')}
              icon={
                <img
                  src={userIcon}
                  alt={t('common.profile')}
                  className={"w-full h-full object-cover"}
                />
              }
              onClick={() => console.log('Клик!')}
            />
          ]}
        />
        <Tabs tabs={tabs} onChange={setActiveTab}/>
        <div className="px-4 py-6">
          <TaskList tasks={tasks}/>
        </div>
      </div>
    </section>
  );
};
