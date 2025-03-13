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

export const previewSubTitleMap: { [key: string]: string } = {
  aspiration: 'Discover careers that align with your future aspirations and current potential.',
  pathway: 'Explore recommended career pathways based on your current level.',
  direct: 'Get direct career suggestions tailored to your preferred sector and level.',
  user: 'Find career matches that highlight your unique skill set.',
  career: 'Uncover career options that match your preferred career direction.',
};
export const CareerPreview = ({ category, data, onClick, checkedId, handleHeartButtonClick }: PreviewProps) => {
  return (
    <div className="w-full">
      <div className={`flex justify-between items-center`}>
        <div className="flex justify-between items-center flex-1">
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
      {category && <p className="text-muted-foreground max-w-3xl mb-2">{previewSubTitleMap[category]}</p>}

      <CareerPreviewList data={data} checkedId={checkedId} handleHeartButtonClick={handleHeartButtonClick} />
    </div>
  );
};
