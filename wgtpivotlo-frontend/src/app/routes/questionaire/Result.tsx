import { Navigate, useNavigate } from 'react-router-dom';
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerPreview } from '@/features/careers/components/career-preview';
import { toast } from 'react-toastify';

export const Result = () => {
  const { results, isResultLoading, isResulterror } = useQuestionaire();
  const { checkedId, handleHeartButtonClick } = usePreference();

  const navigate = useNavigate();
  const onClick = (category: string) => {
    void navigate(category);
  };

  const backButtonOnClick = () => {
    void navigate('explore/career/');
  };

  if (isResultLoading && !results) {
    return null; // Prevent rendering while redirecting
  }

  if (isResultLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isResulterror) {
    toast.error('Something went wrong with the results');
  }
  if (!results) {
    return <Navigate to={'/questionaire'} />;
  }
  console.log(results);
  return (
    <div className="container mx-auto md:px-4 ">
      {results !== undefined && (
        <>
          <CareerPreview
            category={'aspiration'}
            data={results.aspirationMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <CareerPreview
            category={'pathway'}
            data={results.pathwayMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <CareerPreview
            category={'direct'}
            data={results.directMaches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
        </>
      )}
    </div>
  );
};
