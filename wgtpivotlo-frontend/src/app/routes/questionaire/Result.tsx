import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Preview } from '@/components/preview';
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire';
import { FetchChoiceCareerRecommendationParams } from '@/features/questionaire/contexts/QuestionaireProvider';
import { usePreference } from '@/features/careers/hooks/usePreference';

export const Result = () => {
  const { results, fetchChoiceCareerRecommendation, categoryResult, setCategoryResult, page, setPage } =
    useQuestionaire();
  const { checkedId, handleHeartButtonClick } = usePreference();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySearchParams = searchParams.get('category');

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
    if (!results) {
      void navigate('/questionaire'); // Redirect to the questionnaire page if results are undefined
    }
  }, [results, navigate]);

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

  if (!results) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="m-auto max-w-[1280px] min-h-[calc(100vh-65px)] overflow-auto space-y-7 p-4">
      {results && (categorySearchParams === '' || !categorySearchParams) ? (
        <>
          <Preview
            category={'aspiration'}
            data={results?.aspirationMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <Preview
            category={'pathway'}
            data={results.pathwayMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
            checkedId={checkedId}
            handleHeartButtonClick={handleHeartButtonClick}
          />
          <Preview
            category={'direct'}
            data={results.directMaches} // Fixed typo from "directMaches"
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
