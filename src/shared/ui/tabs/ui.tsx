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
    <div className="flex border-b border-gray-200 bg-white px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className={`
            py-2 px-4 text-sm font-medium transition
            ${activeTab === tab
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
