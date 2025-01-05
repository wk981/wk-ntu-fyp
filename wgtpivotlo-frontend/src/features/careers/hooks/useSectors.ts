import { getAllSectors } from '@/features/questionaire/api'
import { DataProps } from '@/features/questionaire/types'
import { useQuery } from '@tanstack/react-query'

export const useSectors = () => {
  // const [careerId, setCareerId] = useState<number|undefined>();
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
