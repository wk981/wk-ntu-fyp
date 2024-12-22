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

interface DataProps {
  label: string
  value: string
}

interface MultiComboBoxProps {
  data: DataProps[]
  value: string[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
  showValues: boolean
}

export const MultiSelectComboBox = ({
  data,
  value,
  setValue,
  showValues,
}: MultiComboBoxProps) => {
  const [open, setOpen] = useState(false)

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1)
      setValue(value.filter((item) => item !== val))
    } else {
      setValue((prevValue) => [...prevValue, val])
    }
  }

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
                ? value.map((val, i) => (
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
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
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
