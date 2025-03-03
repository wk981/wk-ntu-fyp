import { useEffect, useRef } from 'react';
import { PreviewListProps } from '../types';
import useInViewPort from '@/hook/useInViewPort';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CareerCard } from './career-card';
import { Scrollbar } from '@radix-ui/react-scroll-area';

export const CareerGrid = ({ data, intersectionAction, handleHeartButtonClick, checkedId }: PreviewListProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useInViewPort(elementRef, {
    root: null, // Use the viewport as the root
    rootMargin: '0px', // No margin around the viewport
    threshold: 0.1, // Trigger when 10% of the target is visible
  });

  useEffect(() => {
    if (intersectionAction && isIntersecting) {
      intersectionAction(); // Call the function if it exists
    }
  }, [isIntersecting]); // Add all necessary dependencies

  return (
    <ScrollArea className="w-full">
      <div
        className={`w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch justify-center flex-1 overflow-y-hidden`}
      >
        {Array.isArray(data) &&
          data.map((d, index) => (
            <CareerCard
              key={index}
              item={d}
              ref={data.length === index + 1 ? elementRef : null}
              heartBadgeOnClick={handleHeartButtonClick}
              heartBadgeCheckedId={checkedId}
            />
          ))}
      </div>
      <Scrollbar orientation={`vertical`} />
    </ScrollArea>
  );
};
