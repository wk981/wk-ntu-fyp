import { ComboBox } from '@/components/combo-box'
import { MultiSelectComboBox } from '@/components/multi-select-combo-box'
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
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="careerLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Q1. Which industry do you prefer to work in?Industry Preferences
                (Select one)
              </FormLabel>
              <FormControl>
                <ComboBox {...field} data={mockData} setValue={form.setValue} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Q2. What role are you aiming for? (Select One)
              </FormLabel>
              <FormControl>
                <MultiSelectComboBox
                  {...field}
                  data={mockData}
                  setValue={form.setValue}
                  showValues={false}
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
            <FormItem>
              <FormLabel>
                Q3. Which of the following skills do you possess? (Select all
                that apply)
              </FormLabel>
              <FormControl>
                <MultiSelectComboBox
                  {...field}
                  data={mockData}
                  setValue={form.setValue}
                  showValues={false}
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
