import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CareerCard } from './career-card';
import { PreviewListProps } from '../types';

export const CareerPreviewList = ({ data, handleHeartButtonClick, checkedId }: PreviewListProps) => {
  return (
    <ScrollArea className="w-full">
      {data && (
        <div className="flex flex-nowrap gap-4 pb-4" style={{ width: `${data.length * 280}px` }}>
          {Array.isArray(data) &&
            data.map((d, index) => (
              <CareerCard
                key={index}
                item={d}
                heartBadgeOnClick={handleHeartButtonClick}
                heartBadgeCheckedId={checkedId}
              />
            ))}
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
