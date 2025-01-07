import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Preview } from '@/components/preview';
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire';
import { FetchChoiceCareerRecommendationParams } from '@/features/questionaire/contexts/QuestionaireProvider';

export const Result = () => {
  const { results, choiceCareerRecommendationPostMutation, fetchChoiceCareerRecommendation } = useQuestionaire();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySearchParams = searchParams.get('category');
  const onClick = async (category: string) => {
    setSearchParams({ category: category.toLowerCase() });
    const params: FetchChoiceCareerRecommendationParams = {
      category: category,
      pageNumber: 1,
    };
    await fetchChoiceCareerRecommendation(params);
  };
  const backButtonOnClick = () => {
    setSearchParams({});
  };
  const interSectionAction = useCallback(() => {
    console.log('This is intersected');
  }, []);

  useEffect(() => {
    if (!results) {
      void navigate('/questionaire'); // Redirect to the questionnaire page if results are undefined
    }
  }, [results, navigate]);

  if (!results) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="m-auto max-w-[1280px] space-y-7 p-4">
      {results && (categorySearchParams === '' || !categorySearchParams) ? (
        <>
          <Preview
            category={'aspiration'}
            data={results?.aspirationMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
          />
          <Preview
            category={'pathway'}
            data={results.pathwayMatches}
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
          />
          <Preview
            category={'direct'}
            data={results.directMaches} // Fixed typo from "directMaches"
            onClick={onClick}
            backButtonOnClick={backButtonOnClick}
          />
        </>
      ) : (
        categorySearchParams &&
        choiceCareerRecommendationPostMutation.data && (
          <>
            <Preview
              category={categorySearchParams}
              data={choiceCareerRecommendationPostMutation.data.data}
              onClick={onClick}
              seeMore={false}
              back={true}
              layout="grid"
              backButtonOnClick={backButtonOnClick}
              intersectionAction={interSectionAction}
            />
          </>
        )
      )}
    </div>
  );
};
