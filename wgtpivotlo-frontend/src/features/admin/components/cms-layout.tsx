import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProviderProps } from '@/utils';
import { useNavigate } from 'react-router-dom';

interface CMSLayoutProps extends ProviderProps {
  tab: 'careers' | 'courses';
}

export default function CmsLayout({ children, tab }: CMSLayoutProps) {
  const navigate = useNavigate();
  const handleTabChange = (value: string) => {
    if (value === 'careers' || value === 'courses') {
      void navigate(`/admin/${value}`);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col justify-between">
          <h1 className="text-4xl font-bold tracking-tight mb-1">Admin Portal</h1>
          <p className="text-muted-foreground max-w-3xl">One way stop to edit the contents in database</p>
        </div>
        <Tabs defaultValue={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[250px] border">
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            {/* <TabsTrigger value="skills">Skills</TabsTrigger> */}
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
