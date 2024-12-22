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
import { useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form'
import { DataProps } from '@/features/questionaire/types'

interface MultiComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[]
  setValue: UseFormSetValue<TFieldValues> // Corrected type
  showValues: boolean;
}

export const MultiSelectComboBox =<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> ({
  data,
  value,
  setValue,
  name,
  showValues
}: MultiComboBoxProps<TFieldValues, TName>) => {
  const [open, setOpen] = useState(false)

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      // Remove the value if it already exists
      setValue(
        name,
        value.filter((item: any) => item !== val) // TypeScript knows `item` is a string
      );
    } else {
      // Add the value to the array
      setValue(name, [...value, val] as PathValue<TFieldValues, TName>);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {data.map((d) => (
                <CommandItem
                  key={d.value}
                  value={d.value}
                  onSelect={() => {
                    handleSetValue(d.value)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(d.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {d.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
