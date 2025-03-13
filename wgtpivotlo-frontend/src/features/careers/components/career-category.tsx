import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerGrid } from '@/features/careers/components/career-grid';
import { previewTitleMap } from '@/features/careers/components/career-preview';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { useRecommendationCategory } from '@/features/careers/hooks/useRecommendationCategory';
import { ResultBody } from '@/features/questionaire/api';
import { ArrowLeft } from 'lucide-react';

interface CareerCategoryProps {
  backButtonOnClick: () => void;
  category: string;
  questionaireFormResults?: ResultBody;
}

export const CareerCategory = ({ backButtonOnClick, category, questionaireFormResults }: CareerCategoryProps) => {
  const { categoryResult, isCategoryLoading, setPage, hasMore } = useRecommendationCategory({
    category: category,
    questionaireFormResults: questionaireFormResults,
  });
  const { checkedId, handleHeartButtonClick } = usePreference();

  if (isCategoryLoading && !categoryResult) {
    return (
      <div className="container overflow-hidden mx-auto w-full space-y-3">
        <Skeleton className="h-8 w-64" />
        <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch justify-center flex-1 overflow-y-hidden">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <Skeleton className="h-[410px] w-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const interSectionAction = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page
    }
  };

  return (
    <div className="container overflow-hidden mx-auto w-full space-y-3">
      <div className="flex gap-2 items-center justify-start">
        <Button variant={'outline'} onClick={() => backButtonOnClick()} aria-label="Go back" className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {category && <h1 className="text-2xl md:text-3xl font-bold">{previewTitleMap[category]}</h1>}
      </div>
      {/* {category && (
        <p className="text-muted-foreground max-w-3xl">
          Browse through career paths that align with your current skillset and experience. These recommendations are
          tailored to help you leverage your existing strengths.
        </p>
      )} */}
      {category && categoryResult && (
        <>
          <CareerGrid
            data={categoryResult}
            intersectionAction={interSectionAction}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
        </>
      )}
      {isCategoryLoading && (
        <div className="flex justify-center py-4">
          <LoadingSpinnerComponent width={10} height={10} />
        </div>
      )}
      {!hasMore && categoryResult && categoryResult.length > 0 && (
        <p className="text-center">You've reached the end of the list</p>
      )}
    </div>
  );
};
