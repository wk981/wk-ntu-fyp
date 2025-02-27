import { Card } from '@/components/ui/card';
import { ProviderProps } from '@/utils';
import { Settings, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const SettingSideBar = () => {
  return (
    <div className="md:col-span-1">
      <Card className="rounded-md shadow-sm overflow-hidden bg-white">
        <SettingsSideBarItem to="/settings" end={true}>
          <Settings className="h-5 w-5" />
          <span>Account Settings</span>
        </SettingsSideBarItem>
        <SettingsSideBarItem to="/settings/security" end={false}>
          <Shield className="h-5 w-5" />
          <span>Security</span>
        </SettingsSideBarItem>
      </Card>
    </div>
  );
};

interface SettingsSideBarItemProps extends ProviderProps {
  to: string;
  end?: boolean;
}

const SettingsSideBarItem = ({ to, end, children }: SettingsSideBarItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        'w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-blue-400 hover:text-white transition-all' +
        (isActive ? ' bg-blue-400 text-white font-medium' : '')
      }
    >
      {children}
    </NavLink>
  );
};
