import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeartBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  checked: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const HeartBadge: React.FC<HeartBadgeProps> = ({ text, checked = false, variant = 'default', ...props }) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        'gap-1 transition-colors duration-200 cursor-pointer',
        variant === 'secondary' && 'hover:bg-secondary-foreground hover:text-secondary'
      )}
      {...props}
    >
      <Heart className={`h-3 w-3 ${checked && 'fill-current'}`} />
      {text}
    </Badge>
  );
};
