import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { settingsNavItems, SettingsSidebarMobileProps } from '../data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SettingSelect = ({ items = settingsNavItems }: SettingsSidebarMobileProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Compute current path segment by filtering empty strings
  const currentValue = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length <= 1 && segments[0] === 'settings') {
      return 'account';
    } else {
      return segments.pop();
    }
  }, [location.pathname]);

  // Use currentValue directly as the selected value
  const handleValueChange = (value: string) => {
    const selectedItem = items.find((item) => item.value === value);
    if (selectedItem?.href) {
      void navigate(selectedItem.href);
    }
  };

  return (
    <div className="block md:hidden w-full rounded-md">
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full mb-4 bg-background border-input">
          <SelectValue placeholder="Select setting" />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span>{item.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
