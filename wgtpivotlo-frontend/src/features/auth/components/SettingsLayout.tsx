import { SettingSideBar } from './SettingSideBar';
import { LoadingSpinnerWrapper } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditAccountSettings } from '../hook/useEditAccountSettings';
import { ProviderProps } from '@/utils';
import { Separator } from '@/components/ui/separator';

interface SettingsLayoutProps extends ProviderProps {
  title: string;
  description: string;
}

export const SettingsLayout = ({ title, description, children }: SettingsLayoutProps) => {
  const { isLoading } = useEditAccountSettings();

  return (
    <div className={`${isLoading ? 'cursor-wait' : ''}`}>
      {isLoading && (
        <LoadingSpinnerWrapper className="fixed z-50 flex justify-center items-center bg-inherit"></LoadingSpinnerWrapper>
      )}
      <div className="container bg-inherit h-full">
        <div className="grid grid-cols-5 gap-6">
          <SettingSideBar />
          <Card className="w-full col-span-4">
            <CardHeader className="text-lg font-thin">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <Separator />
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
