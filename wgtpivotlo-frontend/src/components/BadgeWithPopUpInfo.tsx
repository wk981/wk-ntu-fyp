import * as React from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BadgeWithTooltipProps {
  text: string;
  tooltipContent: string;
  badgeStyle: BadgeProps;
}

export function BadgeWithTooltip({ text, tooltipContent, badgeStyle }: BadgeWithTooltipProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const breakpoint = 768;

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge className="cursor-pointer" {...badgeStyle}>
            {text}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <p>{tooltipContent}</p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge {...badgeStyle}>{text}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
