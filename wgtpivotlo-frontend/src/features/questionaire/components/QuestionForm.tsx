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
// import { useSkills } from '@/features/skills/hook/useSkills'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQuestionaire } from '../hook/useQuestionaire'

const mockData = [
  {
    label: 'Entry Level',
    value: 'Entry Level',
  },
  {
    label: 'Mid Level',
    value: 'Mid Level',
  },
  {
    label: 'Senior Level',
    value: 'Senior Level',
  },
]

const FormSchema = z.object({
  careerLevel: z.string({
    required_error: 'Please select an option.',
  }),
  sector: z.string({
    required_error: 'Please select an option.',
  }),
  skills: z.array(
    z.string({
      required_error: 'Please select at least one skill',
    })
  ),
})

export const QuestionForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  // const { q, fetchSkill } = useSkills()
  const { sectorsQuery } = useQuestionaire()

  // const commandOnChangeCapture = async (e: React.FormEvent<HTMLInputElement>) => {
  //   e.preventDefault()
  //   try{
  //     await fetchSkill(e.currentTarget.value);
  //   }
  //   catch(error){
  //     console.log(error);
  //   }

  // }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          form.handleSubmit(onSubmit)
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
                  value={field.value}
                  data={mockData}
                  setValue={form.setValue}
                  showValues={false}
                  // commandOnChangeCapture={commandOnChangeCapture}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
