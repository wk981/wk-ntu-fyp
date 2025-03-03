import { Button } from '@/components/ui/button';
import { PreviewProps } from '../types';
import { CareerPreviewList } from './career-preview-list';

export const previewTitleMap: { [key: string]: string } = {
  aspiration: 'Career Matches Based on Aspirations',
  pathway: 'Career Pathway Recommendations',
  direct: 'Direct Career Suggestions',
  user: 'Career Matches Based On Your Skills',
  career: 'Career Matches Based on Your Preferred Career',
};

export const CareerPreview = ({ category, data, onClick, checkedId, handleHeartButtonClick }: PreviewProps) => {
  return (
    <div className="w-full">
      <div className={`flex justify-between items-center`}>
        <div className="flex justify-between items-center flex-1 mb-2">
          <h1 className="text-xl font-bold">{previewTitleMap[category]}</h1>
          <Button
            variant={'outline'}
            onClick={() => {
              onClick(category);
            }}
          >
            See More
          </Button>
        </div>
      </div>
      <CareerPreviewList data={data} checkedId={checkedId} handleHeartButtonClick={handleHeartButtonClick} />
    </div>
  );
};
