import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { TaskList } from '@/widgets/task-list';
import { Header } from '@/shared/ui';
import { programApi } from '@/entities/program';

export const TasksPage: FC = () => {
  const { t } = useTranslation();
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');

  const { data: programs = [], isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programApi.getPrograms(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={t('tasks.title')}
        rightActions={[
          <select
            key="program-select"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoadingPrograms}
          >
            <option value="">{t('tasks.allPrograms') || 'All Programs'}</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>,
        ]}
      />
      <div className="px-4 py-6">
        <TaskList tasks={[]} />
      </div>
    </div>
  );
};
