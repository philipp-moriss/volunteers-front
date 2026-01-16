import { FC, useState } from 'react';

interface TabsProps {
  tabs: string[];
  onChange?: (tab: string) => void;
}

export const Tabs: FC<TabsProps> = ({ tabs, onChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex justify-between border-b border-gray-200 bg-white px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className={`
            py-2 px-[45px] text-[18px] font-sans  transition 
            ${activeTab === tab
            ? 'text-deepBlue border-b-2 border-deepBlue font-medium'
            : 'text-deepBlue font-light'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
