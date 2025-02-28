import { Card } from '@/components/ui/card';
import { ProviderProps } from '@/utils';

import { NavLink } from 'react-router-dom';
import { SettingSelect } from './SettingSelect';
import { settingsNavItems, SettingsSidebarProps } from '../data';

export const SettingSideBar = () => {
  return (
    <>
      <SettingSideBarDesktop items={settingsNavItems} />
      <SettingSelect items={settingsNavItems} />
    </>
  );
};

const SettingSideBarDesktop = ({ items = settingsNavItems }: SettingsSidebarProps) => {
  return (
    <div className="md:col-span-1 hidden md:block">
      <Card className="rounded-md shadow-sm overflow-hidden bg-white">
        {items.map((item, index) => (
          <SettingsSideBarItem key={index} to={item.href} end={true}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </SettingsSideBarItem>
        ))}
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
        'w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-slate-700 hover:text-white transition-all' +
        (isActive ? ' bg-slate-700 text-white font-medium' : '')
      }
    >
      {children}
    </NavLink>
  );
};
