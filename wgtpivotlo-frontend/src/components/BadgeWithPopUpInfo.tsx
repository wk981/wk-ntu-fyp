import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button, ButtonProps } from './ui/button';
import { useEffect, useState } from 'react';

interface BadgeWithTooltipProps {
  text: string;
  tooltipContent: string;
  badgeStyle?: ButtonProps;
}
export function BadgeWithTooltip({ text, tooltipContent, badgeStyle }: BadgeWithTooltipProps) {
  const [isMobile, setIsMobile] = useState(false);
  const breakpoint = 768;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button className="cursor-pointer" {...badgeStyle}>
            {text}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 z-50">
          <p>{tooltipContent}</p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button {...badgeStyle}>{text}</Button>
        </TooltipTrigger>
        <TooltipContent
          className="z-50 rounded-lg bg-white px-4 py-2 border-2 text-sm font-medium text-black shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          sideOffset={5}
        >
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
