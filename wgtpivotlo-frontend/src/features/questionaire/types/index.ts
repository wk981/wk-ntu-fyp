import { ControllerRenderProps, FieldValues, Path, UseFormSetValue } from "react-hook-form"

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

interface Career {
  careerId: number
  title: string
  sector: string
  responsibility: string
  careerLevel: string
  pic_url: string
}

interface CareerWithSimilarityScore extends Career {
  averageWeightage: number
}

export interface CareerRecommendationResponse {
  directMaches: CareerWithSimilarityScore[]
  pathwayMatches: CareerWithSimilarityScore[]
  aspirationMatches: CareerWithSimilarityScore[]
}

export interface DataProps {
  label: string
  value: string
}

export interface ComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[]
  setValue: UseFormSetValue<TFieldValues> // Corrected type
}