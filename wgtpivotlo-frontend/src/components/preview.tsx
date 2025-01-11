import { ScrollArea, ScrollBar } from './ui/scroll-area';

import { Button } from './ui/button';

import { CareerWithSimilarityScoreDTO } from '@/features/careers/types';
import { ArrowLeft } from 'lucide-react';
import useInViewPort from '@/hook/useInViewPort';
import { useEffect, useRef } from 'react';
import { PreviewItem } from './preview-item';
import { usePreference } from '@/features/careers/hooks/usePreference';

interface PreviewProps extends PreviewListProps {
  category: string;
  onClick: (category: string) => void;
  backButtonOnClick: () => void;
  back?: boolean;
  seeMore?: boolean;
  layout?: 'flex' | 'grid';
}

interface PreviewListProps {
  data: CareerWithSimilarityScoreDTO[];
  intersectionAction?: () => void;
  layout?: 'flex' | 'grid';
}

const previewTitleMap: { [key: string]: string } = {
  aspiration: 'Career Matches Based on Aspirations',
  pathway: 'Career Pathway Recommendations',
  direct: 'Direct Career Suggestions',
};

export const Preview = ({
  category,
  data,
  onClick,
  backButtonOnClick,
  intersectionAction,
  back = false,
  seeMore = true,
  layout = 'flex',
}: PreviewProps) => {
  return (
    <div className="w-full">
      <div className={`flex ${seeMore ? 'justify-between' : 'gap-16'} items-center`}>
        {back && (
          <Button onClick={() => backButtonOnClick()} aria-label="Go back" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-lg font-bold mb-2">{previewTitleMap[category]}</h1>
        {seeMore && (
          <p
            className="cursor-pointer text-blue-anchor hover:text-blue-800 transition-colors"
            onClick={() => {
              onClick(category);
            }}
          >
            See More
          </p>
        )}
      </div>
      <PreviewList data={data} layout={layout} intersectionAction={intersectionAction} />
    </div>
  );
};

const PreviewList = ({ data, intersectionAction, layout = 'flex' }: PreviewListProps) => {
  const { checkedId, handleHeartButtonClick } = usePreference();
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
    <ScrollArea className="w-full pb-4">
      <div
        className={`${
          layout === 'flex'
            ? 'flex flex-col md:flex-row items-center gap-4'
            : 'grid grid-cols-[repeat(auto-fit,minmax(332px,1fr))] items-center justify-center'
        } gap-4 `}
      >
        {Array.isArray(data) &&
          data.map((d, index) => (
            <PreviewItem
              key={d.career.careerId}
              item={d}
              ref={data.length === index + 1 && layout === 'grid' ? elementRef : null}
              heartBadgeOnClick={() => handleHeartButtonClick(d.career.careerId.toString())}
              heartBadgeCheckedId={checkedId}
            />
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
