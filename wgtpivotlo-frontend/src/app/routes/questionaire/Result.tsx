import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Preview } from '@/components/preview'
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire'

export const Result = () => {
  const {
    results,
    choiceCareerRecommendationPostMutation,
    fetchChoiceCareerRecommendation,
  } = useQuestionaire()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const categorySearchParams = searchParams.get('category')
  const onClick = async (category: string) => {
    setSearchParams({ category: category.toLowerCase() })
    await fetchChoiceCareerRecommendation(category)
  }

  useEffect(() => {
    if (!results) {
      void navigate('/questionaire') // Redirect to the questionnaire page if results are undefined
    }
  }, [results, navigate])

  if (!results) {
    return null // Prevent rendering while redirecting
  }

  return (
    <div className="m-auto max-w-[1280px] space-y-7 p-4">
      {results && (categorySearchParams === '' || !categorySearchParams) ? (
        <>
          <Preview
            category={'Aspiration'}
            data={results?.aspirationMatches}
            onClick={onClick}
          />
          <Preview
            category={'Pathway'}
            data={results.pathwayMatches}
            onClick={onClick}
          />
          <Preview
            category={'Pathway'}
            data={results.directMaches} // Fixed typo from "directMaches"
            onClick={onClick}
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
            />
          </>
        )
      )}
    </div>
  )
}
