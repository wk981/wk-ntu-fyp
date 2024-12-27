/* eslint-disable */
// Enable eslint when developing this as it has any types.
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from './ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form'
import { DataProps } from '@/features/questionaire/types'
import { FormControl } from './ui/form'

interface MultiComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[]
  setValue: UseFormSetValue<TFieldValues> // Corrected type
  showValues: boolean
  commandOnChangeCapture?: React.FormEventHandler<HTMLInputElement>
}

export const MultiComboBox = forwardRef<
  HTMLButtonElement,
  MultiComboBoxProps<any, any>
>(
  (
    { data, value, setValue, name, showValues, commandOnChangeCapture },
    ref
  ) => {
    const handleSetValue = (val: string) => {
      console.log(`value :${value}. name: ${name}. val: ${val}`)
      if (value && value.includes(val)) {
        setValue(
          name,
          value.filter((item: any) => item !== val)
        )
      } else if (!value) {
        setValue(name, [val])
      } else {
        // Add the value to the array
        setValue(name, [...value, val] as PathValue<any, any>)
      }
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-[200px] justify-between',
                !value && 'text-muted-foreground'
              )}
              ref={ref}
            >
              {showValues === true ? (
                <div className="flex gap-2 justify-start">
                  {value?.length
                    ? value.map((val: any, i: any) => (
                        <div
                          key={i}
                          className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                        >
                          {data.find((d) => d.value === val)?.label}
                        </div>
                      ))
                    : 'Select an option'}
                </div>
              ) : (
                'Select an option'
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search"
              onChangeCapture={(e) => {
                if (commandOnChangeCapture) {
                  commandOnChangeCapture(e)
                }
              }}
            />
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data && (
                <CommandList>
                  {data.map((d) => (
                    <CommandItem
                      key={d.value}
                      value={d.value}
                      onSelect={() => {
                        handleSetValue(d.value)
                      }}
                    >
                      {d.label}
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value?.includes(d?.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
