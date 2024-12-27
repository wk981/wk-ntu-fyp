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
import { ComboBoxProps } from '@/features/questionaire/types'
import { FormControl } from './ui/form'
import { capitalizeFirstChar } from '@/utils'

export const ComboBox = forwardRef<HTMLButtonElement, ComboBoxProps<any, any>>(
  ({ data, value, setValue, name, isLoading }, ref) => {
    return (
      <>
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
                disabled={isLoading}
              >
                {isLoading
                  ? 'Fetching Data'
                  : value && data
                    ? data.find((d) => d.value === value)?.label
                    : 'Select an option'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search" className="h-9" />
              <CommandList>
                <CommandEmpty>No data found.</CommandEmpty>
                {data && (
                  <CommandGroup>
                    {data.map((d) => (
                      <CommandItem
                        key={d.value}
                        value={d.value}
                        onSelect={(currentValue) => {
                          console.log(
                            `name: ${name}, currentValue: ${currentValue}`
                          )
                          setValue(String(name), String(currentValue))
                        }}
                      >
                        {capitalizeFirstChar(d.label)}
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === d.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    )
  }
)
