import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProviderProps } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function CmsLayout({ children }: ProviderProps) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState('users');
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Navigate to the corresponding route
    void navigate(`/${value}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="users" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] border">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
