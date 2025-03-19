import { ComboBox } from '@/components/combo-box';
import { FormFieldMultiComboBox } from '@/components/multi-select-combo-box-form-control';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useQuestionaire } from '../hook/useQuestionaire';
import { useSkills } from '@/features/skills/hook/useSkills';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { capitalizeEveryFirstChar } from '@/utils';
import { RedCross } from '@/components/red-cross';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useSectors } from '@/features/careers/hooks/useSectors';

const mockData = [
  { label: 'entry level', value: 'entry level' },
  { label: 'mid level', value: 'mid level' },
  { label: 'senior Level', value: 'senior level' },
];

const FormSchema = z.object({
  careerLevel: z.string({ required_error: 'Please select an option.' }),
  sector: z.string({ required_error: 'Please select an option.' }),
  skills: z.array(z.array(z.string({ required_error: 'Please select at least one skill' }))),
});

export const QuestionForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [selectedSkill, setSelectedSkill] = useState<{ skillId: number; profiency: string }[]>([]);

  const { skillsQuery, handleCommandOnChangeCapture, skillsData } = useSkills();
  const { userSkillsList, resultPostMutation, setResults, setQuestionaireFormResults, setUserSkillsList } =
    useQuestionaire();
  const { sectorsQuery } = useSectors();
  const navigate = useNavigate();
  const skillsArray = form.watch('skills');

  useEffect(() => {
    if (userSkillsList && userSkillsList.length > 0) {
      // Process skills data for the form
      const skillsArray = userSkillsList.map((userSkill) => [String(userSkill.skillId), userSkill.name]);

      // Set the default value in the form
      form.setValue('skills', skillsArray);

      // Set select skills
      const selectedSkillsMap = userSkillsList.map((userSkill) => {
        return { skillId: userSkill.skillId, profiency: 'Beginner' };
      });
      setSelectedSkill(selectedSkillsMap);
    }
    return () => {
      setUserSkillsList([]); // Clear the list on unmount
    };
  }, []);

  const handleSelect = (skillId: number, profiency: string) => {
    setSelectedSkill((prev) => prev.map((s) => (s.skillId === skillId ? { ...s, profiency } : s)));
  };

  const handleRemove = (skillId: number) => {
    form.setValue(
      'skills',
      skillsArray.filter((skill) => Number(skill[0]) !== skillId)
    );
    setSelectedSkill((prev) => prev.filter((skill) => Number(skill.skillId) !== skillId));
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const body = {
        sector: data.sector.toLowerCase(),
        careerLevel: data.careerLevel,
        skillIdWithProfiencyDTOList: selectedSkill,
        pageNumber: 1,
        pageSize: 5,
      };
      setQuestionaireFormResults(body);
      const response = await resultPostMutation.mutateAsync(body);
      if (response) {
        setResults(response);
        await navigate('/questionaire/result');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const multiSelectBoxExtraFn = (currentValue: string) => {
    setSelectedSkill((prev) => {
      // Convert the currentValue to a number
      const skillId = Number(currentValue);

      // Check if the skill is already in the array
      const skillExists = prev.some((item) => item.skillId === skillId);

      // If it exists, remove it, otherwise add it
      if (skillExists) {
        return prev.filter((item) => item.skillId !== skillId);
      } else {
        return [...prev, { skillId, profiency: 'Beginner' }];
      }
    });
  };
  return (
    <Form {...form}>
      {resultPostMutation.isPending && <LoadingSpinner />}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
          form
            .handleSubmit(onSubmit)()
            .catch((error) => {
              console.error('Form submission error:', error);
            });
        }}
        className="space-y-6 px-7"
      >
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Q1. Which industry do you prefer to work in? Sector Preferences (Select one){' '}
                <span className="text-blue-anchor">*</span>
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
          name="careerLevel"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Q2. What role are you aiming for? (Select One) <span className="text-blue-anchor">*</span>
              </FormLabel>
              <FormControl>
                <ComboBox {...field} data={mockData} setValue={form.setValue} isLoading={false} />
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
                Q3. Which of the following skills do you possess? (Select all that apply){' '}
                <span className="text-blue-anchor">*</span>
              </FormLabel>
              <FormControl>
                <FormFieldMultiComboBox
                  {...field}
                  data={skillsData}
                  setValue={form.setValue}
                  showValues={false}
                  commandOnChangeCapture={handleCommandOnChangeCapture}
                  isLoading={skillsQuery.isLoading}
                  isSuccess={skillsQuery.isSuccess}
                  extraSetValueFn={multiSelectBoxExtraFn}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {skillsArray &&
            skillsArray.map((skill, index) => {
              const skillId = skill[0];
              const skillProfiency = selectedSkill.find((item) => item.skillId === Number(skillId));
              return (
                <div key={index} className="mt-2">
                  <label>{capitalizeEveryFirstChar(skill[1])}</label>
                  <div className="flex items-center space-x-4 mt-1">
                    <Select
                      onValueChange={(value) => handleSelect(Number(skill[0]), value)}
                      defaultValue="Beginner"
                      value={skillProfiency?.profiency}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select your proficiency" />
                      </SelectTrigger>
                      <SelectContent defaultValue={'Beginner'}>
                        <SelectItem value="Beginner" defaultChecked>
                          Beginner
                        </SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <button type="button" className="text-red" onClick={() => handleRemove(Number(skill[0]))}>
                      <RedCross size={24} className="hover:opacity-50 transition-opacity cursor-pointer" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="space-x-4">
          <Button
            type="button"
            variant={'ghost'}
            className="border"
            onClick={() => {
              void navigate('/questionaire/upload');
            }}
          >
            Go back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
