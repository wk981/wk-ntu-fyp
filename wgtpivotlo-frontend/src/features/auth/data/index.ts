import { Shield, User } from 'lucide-react';

export interface SettingsSidebarMobileProps {
  items?: typeof settingsNavItems;
  defaultValue?: string;
}
export interface SettingsSidebarProps {
  items?: typeof settingsNavItems;
  className?: string;
}

export const settingsNavItems = [
  {
    value: 'account',
    label: 'Account Settings',
    icon: User,
    href: '/settings',
    end: true,
  },
  {
    value: 'security',
    label: 'Security',
    icon: Shield,
    href: '/settings/security',
    end: false,
  },
  // {
  //   value: "billing",
  //   label: "Billing",
  //   icon: CreditCard,
  //   href: "/settings/billing",
  // },
  // {
  //   value: "notifications",
  //   label: "Notifications",
  //   icon: Bell,
  //   href: "/settings/notifications",
  // },
];
