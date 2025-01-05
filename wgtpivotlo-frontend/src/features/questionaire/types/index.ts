import { CareerWithSimilarityScoreDTO } from '@/features/careers/types'
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormSetValue,
} from 'react-hook-form'

export interface Skills {
  skillId: number
  name: string
  description: string
  pic: string
  profiency: string
}

export interface SkillsAbstract {
  skillId: number
  profiency: string
}

export interface Career {
  created_on: string // ISO string for date
  updated_on: string // ISO string for date
  careerId: number
  title: string
  sector: string
  responsibility: string
  careerLevel: string
  pic_url: string | null
}

export interface CareerRecommendationResponse {
  directMaches: CareerWithSimilarityScoreDTO[]
  pathwayMatches: CareerWithSimilarityScoreDTO[]
  aspirationMatches: CareerWithSimilarityScoreDTO[]
}

export interface DataProps {
  label: string
  value: string
}

export interface ComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[] | undefined // Array of options for the ComboBox
  setValue: UseFormSetValue<TFieldValues> // Corrected typing for setValue
  isLoading: boolean
}
