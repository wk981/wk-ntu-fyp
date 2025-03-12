import { useAuth } from '@/features/auth/hook/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { capitalizeEveryFirstChar, capitalizeFirstChar } from '@/utils';

export const Profile = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const avatarImage = user?.pic || 'https://github.com/shadcn.png';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarImage} alt={user?.username} />
            <AvatarFallback>{user?.username && capitalizeFirstChar(user.username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.username && capitalizeEveryFirstChar(user.username)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={'/history'}>
          <DropdownMenuItem className="cursor-pointer">Course History</DropdownMenuItem>
        </Link>
        {user?.role.some((role) => ['ROLE_ADMIN'].includes(role)) && (
          <Link to={'/admin/careers'}>
            <DropdownMenuItem className="cursor-pointer">Admin</DropdownMenuItem>
          </Link>
        )}
        <Link to={'/settings'}>
          <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to={'/auth/logout'}>
          <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
