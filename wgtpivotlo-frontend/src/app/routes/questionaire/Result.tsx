import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Preview } from '@/components/preview'
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire'

export const Result = () => {
  const { results } = useQuestionaire()
  const navigate = useNavigate()

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
      {results && (
        <>
          <Preview
            title={'Career Matches Based on Aspirations'}
            data={results.aspirationMatches}
          />
          <Preview
            title={'Career Pathway Recommendations'}
            data={results.pathwayMatches}
          />
          <Preview
            title={'Direct Career Suggestions'}
            data={results.directMaches} // Fixed typo from "directMaches"
          />
        </>
      )}
    </div>
  )
}
