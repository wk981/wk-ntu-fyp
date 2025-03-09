import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProviderProps } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function CmsLayout({ children }: ProviderProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('careers');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    void navigate(`/admin/${value}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] border">
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
