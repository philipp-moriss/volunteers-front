import {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@tanstack/react-query';
import {TaskList} from '@/widgets/task-list';
import {Header} from '@/shared/ui';
import {programApi} from '@/entities/program';
import {Task} from "@/entities/task";
import {Tabs} from "@/shared/ui/tabs";

export const mockTasks: Task[] = [
  {
    id: '1',
    programId: 'program-food-support',
    needyId: 'needy-101',
    type: 'delivery',
    title: 'Deliver groceries to elderly woman',
    description: 'Need help delivering a set of groceries from the social center.',
    details: 'Products are already packed. Delivery time is flexible between 10:00 and 16:00.',
    points: 50,
    status: 'active',
    cityId: 'city-minsk',
    address: 'Minsk, Independence Ave 45, apt 12',
    firstResponseMode: true,
    assignedVolunteerId: null,
    completedByVolunteer: false,
    completedByNeedy: false,
    createdAt: new Date('2026-01-10T09:15:00'),
    updatedAt: new Date('2026-01-10T09:15:00'),
  },

  {
    id: '2',
    programId: 'program-digital-help',
    needyId: 'needy-204',
    type: 'consultation',
    title: 'Help setting up a smartphone',
    description: 'An elderly man needs help configuring a new smartphone.',
    details: 'Need to set up WhatsApp, contacts, and explain how to use the camera.',
    points: 70,
    status: 'in_progress',
    cityId: 'city-minsk',
    address: 'Minsk, Gikalo St. 8, floor 2',
    firstResponseMode: false,
    assignedVolunteerId: 'volunteer-17',
    completedByVolunteer: false,
    completedByNeedy: false,
    createdAt: new Date('2026-01-08T14:40:00'),
    updatedAt: new Date('2026-01-12T11:20:00'),
  },

  {
    id: '3',
    programId: 'program-home-care',
    needyId: 'needy-309',
    type: 'household',
    title: 'Clean apartment after surgery',
    description: 'Woman after surgery needs help with light home cleaning.',
    details: 'Vacuum cleaning, washing dishes, taking out the trash. No heavy lifting.',
    points: 90,
    status: 'completed',
    cityId: 'city-minsk',
    address: 'Minsk, Nemiga St. 22, apt 5',
    firstResponseMode: false,
    assignedVolunteerId: 'volunteer-04',
    completedByVolunteer: true,
    completedByNeedy: true,
    createdAt: new Date('2025-12-28T10:00:00'),
    updatedAt: new Date('2026-01-05T18:30:00'),
  },
];

export const TasksPage: FC = () => {
  const {t} = useTranslation();
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const tabs = ['All tasks', 'My tasks'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // const filteredTasks = tasks.filter(task =>
  //   activeTab === 'My tasks' ? task.assignedVolunteerId !== null : true
  // );


  const {data: programs = [], isLoading: isLoadingPrograms} = useQuery({
    queryKey: ['programs'],
    queryFn: () => programApi.getPrograms(),
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={t('tasks.title')}
        // rightActions={[
        //   <select
        //     key="program-select"
        //     value={selectedProgramId}
        //     onChange={(e) => setSelectedProgramId(e.target.value)}
        //     className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        //     disabled={isLoadingPrograms}
        //   >
        //     <option value="">{t('tasks.allPrograms') || 'All Programs'}</option>
        //     {programs.map((program) => (
        //       <option key={program.id} value={program.id}>
        //         {program.name}
        //       </option>
        //     ))}
        //   </select>,
        // ]}
      />
      <Tabs tabs={tabs} onChange={setActiveTab}/>
      <div className="px-4 py-6">
        <TaskList tasks={mockTasks}/>
      </div>
    </div>
  );
};
