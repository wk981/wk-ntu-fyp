import { useQuery } from '@tanstack/react-query'
import { getCareer } from '../api'
import { CareerWithSkills } from '../types'
import { useEffect, useState } from 'react'

export const useCareers = (careerId: number) => {
  const [careerWithSkills, setCareerWithSkills] = useState<
    CareerWithSkills | undefined
  >()

  const careerQuery = useQuery({
    queryKey: ['career', careerId],
    queryFn: () => getCareer(careerId),
  })

  useEffect(() => {
    if (careerQuery.isSuccess) {
      setCareerWithSkills(careerQuery.data)
    }
  }, [careerQuery])

  return { careerQuery, careerWithSkills }
}
