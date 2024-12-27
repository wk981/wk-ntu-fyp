import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getSkill } from '../api'
import { DataProps } from '@/features/questionaire/types'

export const useSkills = () => {
  const [q, setQ] = useState<string>('')
  const [skillsData, setSkillsData] = useState<DataProps[]>([])
  const skillsQuery = useQuery({
    enabled: q !== '', // Only run the query if `q` is not empty
    queryKey: ['skills', q],
    queryFn: async () => {
      const data = await getSkill(q) // Fetch the data
      return data // Return the fetched data
    },
    select: (data) => {
      // Transform the data into the desired format
      return data.map((d) => ({
        label: d.name,
        value: String(d.skillId),
      })) as DataProps[]
    },
  })

  useEffect(() => {
    // Update local state whenever the query data changes
    if (skillsQuery.data) {
      setSkillsData(skillsQuery.data)
    }
  }, [skillsQuery.data])

  return { q, setQ, skillsQuery, skillsData }
}
