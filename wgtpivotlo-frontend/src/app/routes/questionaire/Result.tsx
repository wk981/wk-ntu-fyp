import { Preview } from '@/components/preview'
import { useQuestionaire } from '@/features/questionaire/hook/useQuestionaire'
import { CareerRecommendationResponse } from '@/features/questionaire/types'
const mockData: CareerRecommendationResponse = {
  aspirationMatches: [
    [
      {
        created_on: '2024-11-12T03:11:22.968+00:00',
        updated_on: '2024-11-12T11:11:22.968211',
        careerId: 22,
        title: 'business intelligence director',
        sector: 'data and analytics',
        responsibility:
          'lead the bi team, develop data strategies, provide insights to support decision-making, and ensure data accuracy and integrity.',
        careerLevel: 'Senior Level',
        pic_url: null,
      },
      0.1,
    ],
    [
      {
        created_on: '2024-11-12T03:11:23.046+00:00',
        updated_on: '2024-11-12T11:11:23.046201',
        careerId: 42,
        title: 'data analyst / associate data engineer',
        sector: 'data and analytics',
        responsibility:
          'collect and analyze data, generate insights, create visualizations, and support data infrastructure development.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.1,
    ],
    [
      {
        created_on: '2024-11-12T03:11:23.244+00:00',
        updated_on: '2024-11-12T11:11:23.244779',
        careerId: 90,
        title: 'junior data scientist',
        sector: 'data and analytics',
        responsibility:
          'analyze data, support model development, conduct data cleaning, and assist in generating insights for business decisions.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.0859375,
    ],
    [
      {
        created_on: '2024-11-12T03:11:23.447+00:00',
        updated_on: '2024-11-12T11:11:23.447601',
        careerId: 146,
        title: 'senior data scientist',
        sector: 'data and analytics',
        responsibility:
          'lead data science projects, develop predictive models, and provide insights for strategic decisions.',
        careerLevel: 'Senior Level',
        pic_url: null,
      },
      0.0859375,
    ],
  ],
  pathwayMatches: [
    [
      {
        created_on: '2024-11-12T03:11:23.046+00:00',
        updated_on: '2024-11-12T11:11:23.046201',
        careerId: 42,
        title: 'data analyst / associate data engineer',
        sector: 'data and analytics',
        responsibility:
          'collect and analyze data, generate insights, create visualizations, and support data infrastructure development.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.1,
    ],
    [
      {
        created_on: '2024-11-12T03:11:23.244+00:00',
        updated_on: '2024-11-12T11:11:23.244779',
        careerId: 90,
        title: 'junior data scientist',
        sector: 'data and analytics',
        responsibility:
          'analyze data, support model development, conduct data cleaning, and assist in generating insights for business decisions.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.0859375,
    ],
  ],
  directMaches: [
    [
      {
        created_on: '2024-11-12T03:11:23.046+00:00',
        updated_on: '2024-11-12T11:11:23.046201',
        careerId: 42,
        title: 'data analyst / associate data engineer',
        sector: 'data and analytics',
        responsibility:
          'collect and analyze data, generate insights, create visualizations, and support data infrastructure development.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.1,
    ],
    [
      {
        created_on: '2024-11-12T03:11:23.244+00:00',
        updated_on: '2024-11-12T11:11:23.244779',
        careerId: 90,
        title: 'junior data scientist',
        sector: 'data and analytics',
        responsibility:
          'analyze data, support model development, conduct data cleaning, and assist in generating insights for business decisions.',
        careerLevel: 'Entry Level',
        pic_url: null,
      },
      0.0859375,
    ],
  ],
}
export const Result = () => {
  const { results } = useQuestionaire()
  console.log(results)
  return (
    <div className="m-auto max-w-[1280px] space-y-7 p-4">
      <h1>Results</h1>
      <Preview
        title={'Career Matches Based on Aspirations'}
        data={mockData.aspirationMatches}
      />
      <Preview
        title={'Career Pathway Recommendations'}
        data={mockData.pathwayMatches}
      />
      <Preview
        title={'Direct Career Suggestions'}
        data={mockData.directMaches}
      />
    </div>
  )
}
