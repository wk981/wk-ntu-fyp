import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getSkill } from '../api'

export const useSkills = () => {
  const [q, setQ] = useState<string>('')
  const skillsQuery = useQuery({
    enabled: q !== '',
    queryKey: ['skills', q],
    queryFn: async () => {
      await getSkill(q)
    },
  })

  const fetchSkill = async (q: string) => {
    setQ(q)
    await skillsQuery.refetch()
  }

  return { q, setQ, fetchSkill }
}
