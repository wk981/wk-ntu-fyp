import { ComboBox } from '@/components/combo-box'
import { MultiComboBox } from '@/components/multi-select-combo-box'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQuestionaire } from '../hook/useQuestionaire'
import { useSkills } from '@/features/skills/hook/useSkills'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

const mockData = [
  { label: 'Entry Level', value: 'Entry Level' },
  { label: 'Mid Level', value: 'Mid Level' },
  { label: 'Senior Level', value: 'Senior Level' },
]

const FormSchema = z.object({
  careerLevel: z.string({ required_error: 'Please select an option.' }),
  sector: z.string({ required_error: 'Please select an option.' }),
  skills: z.array(
    z.array(z.string({ required_error: 'Please select at least one skill' }))
  ),
})

export const QuestionForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [selectedSkill, setSelectedSkill] = useState<
    { skillId: number; profiency: string }[]
  >([])

  const { skillsQuery, setQ, skillsData } = useSkills()
  const { sectorsQuery } = useQuestionaire()
  const skillsArray = form.watch('skills')

  useEffect(() => {
    // Initialize `selectedSkill` when `skillsArray` changes
    if (skillsArray) {
      const initializedSkills = skillsArray.map((skill) => ({
        skillId: Number(skill[0]),
        profiency: 'Beginner', // Default proficiency
      }))
      setSelectedSkill(initializedSkills)
    }
  }, [skillsArray])

  const handleSelect = (skillId: number, profiency: string) => {
    setSelectedSkill((prev) =>
      prev.map((s) => (s.skillId === skillId ? { ...s, profiency } : s))
    )
  }

  const handleRemove = (skillId: number) => {
    form.setValue(
      'skills',
      skillsArray.filter((skill) => Number(skill[0]) !== skillId)
    )
  }

  const handleCommandOnChangeCapture = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setQ(e.currentTarget.value)
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form Data:', data)
    console.log('Selected Skills:', selectedSkill)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault() // Prevent page refresh
          form
            .handleSubmit(onSubmit)()
            .catch((error) => {
              console.error('Form submission error:', error)
            })
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="careerLevel"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Q1. Which industry do you prefer to work in? Sector Preferences
                (Select one)
              </FormLabel>
              <ComboBox
                {...field}
                data={sectorsQuery.data}
                setValue={form.setValue}
                isLoading={sectorsQuery.isLoading}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Q2. What role are you aiming for? (Select One)
              </FormLabel>
              <FormControl>
                <ComboBox
                  {...field}
                  data={mockData}
                  setValue={form.setValue}
                  isLoading={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Q3. Which of the following skills do you possess? (Select all
                that apply)
              </FormLabel>
              <FormControl>
                <MultiComboBox
                  {...field}
                  data={skillsData}
                  setValue={form.setValue}
                  showValues={false}
                  commandOnChangeCapture={handleCommandOnChangeCapture}
                  isLoading={skillsQuery.isLoading}
                  isSuccess={skillsQuery.isSuccess}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {skillsArray &&
            skillsArray.map((skill, index) => (
              <div key={index} className="flex items-center space-x-4">
                <label>{skill[1]}</label>
                <Select
                  onValueChange={(value) =>
                    handleSelect(Number(skill[0]), value)
                  }
                  defaultValue="Beginner"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select your proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner" defaultChecked>
                      Beginner
                    </SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  className="text-red"
                  onClick={() => handleRemove(Number(skill[0]))}
                >
                  x
                </button>
              </div>
            ))}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
