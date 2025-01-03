import { getAllSectors } from '@/features/questionaire/api'
import { DataProps } from '@/features/questionaire/types'
import { useQuery } from '@tanstack/react-query'

// sectorsQuery: UseQueryResult<DataProps[], Error>

export const useCareers = () => {
  const sectorsQuery = useQuery({
    queryKey: ['sector'],
    queryFn: () => getAllSectors(),
    select: (data) => {
      const res = data.map((d) => ({
        label: d,
        value: d,
      }))
      return res as DataProps[]
    },
    retry: false,
  })

  return { sectorsQuery }
}
