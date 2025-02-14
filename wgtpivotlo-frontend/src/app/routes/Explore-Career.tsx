import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Preview } from '@/components/preview';
import { useExploreCareer } from '@/features/careers/hooks/useExploreCareer';
import { usePreference } from '@/features/careers/hooks/usePreference';
import { useRecommendationCategory } from '@/features/careers/hooks/useRecommendationCategory';
import { FetchChoiceCareerRecommendationParams } from '@/features/questionaire/contexts/QuestionaireProvider';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const ExploreCareer = () => {
  const { data, isLoading: isExploringLoading } = useExploreCareer();

  const { checkedId, handleHeartButtonClick } = usePreference();
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySearchParams = searchParams.get('category');
  const {
    categoryResult,
    setCategoryResult,
    page,
    setPage,
    choiceCareerRecommendationPostMutation,
    fetchChoiceCareerRecommendation,
  } = useRecommendationCategory();
  const { isPending: isChoiceLoading } = choiceCareerRecommendationPostMutation;

  const onClick = (category: string) => {
    setSearchParams({ category: category.toLowerCase() });
    setPage(1);
  };

  const backButtonOnClick = () => {
    setSearchParams({});
    setPage(1);
    setCategoryResult(undefined);
  };

  const interSectionAction = () => {
    console.log('intersected');
    setPage((prevPage) => prevPage + 1); // Increment the page
  };

  useEffect(() => {
    if (categorySearchParams === '' || categorySearchParams === null) {
      setPage(1);
      setCategoryResult(undefined);
    }
  }, [categorySearchParams]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!categorySearchParams) return; // Exit if no category selected
      const params: FetchChoiceCareerRecommendationParams = {
        category: categorySearchParams,
        pageNumber: page,
      };
      await fetchChoiceCareerRecommendation(params);
    };

    fetchRecommendations().catch((err) => console.log(err));
  }, [page, categorySearchParams]); // Trigger when `page` or `categorySearchParams` changes

  if (!data) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="m-auto min-h-[calc(100vh-65px)] overflow-auto md:px-4">
      {(isExploringLoading || isChoiceLoading) && (
        <div className="flex items-center w-full justify-center">
          <LoadingSpinnerComponent />
        </div>
      )}
      {data && (categorySearchParams === '' || !categorySearchParams) ? (
        <>
          <Preview
            category={'user'}
            data={data?.user.data}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <Preview
            category={'career'}
            data={data?.career.data}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
        </>
      ) : (
        categorySearchParams &&
        categoryResult && (
          <>
            <Preview
              category={categorySearchParams}
              data={categoryResult}
              onClick={onClick}
              seeMore={false}
              back={true}
              layout="grid"
              backButtonOnClick={backButtonOnClick}
              intersectionAction={interSectionAction}
              checkedId={checkedId}
              handleHeartButtonClick={handleHeartButtonClick}
            />
          </>
        )
      )}
    </div>
  );
};
