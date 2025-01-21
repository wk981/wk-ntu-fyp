import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

interface NavItemDropdownProps {
  label: string;
  items: NavItem[];
}

export function NavItemDropdown({ label, items }: NavItemDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2 text-blue-anchor font-normal text-lg">
          {label}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <Link to={item.href} className="w-full  text-blue-anchor mt-2" key={item.href}>
            <DropdownMenuItem className="cursor-pointer text-base">{item.label}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
