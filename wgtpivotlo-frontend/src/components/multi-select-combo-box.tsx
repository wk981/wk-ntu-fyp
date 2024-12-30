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
import { forwardRef, useEffect, useRef } from 'react'
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form'
import { DataProps } from '@/features/questionaire/types'
import { FormControl } from './ui/form'
import { capitalizeFirstChar } from '@/utils'

interface MultiComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[] | undefined
  setValue: UseFormSetValue<TFieldValues> // Corrected type
  showValues: boolean
  commandOnChangeCapture?: React.FormEventHandler<HTMLInputElement>
  isLoading: boolean
  isSuccess: boolean
}

export const MultiComboBox = forwardRef<
  HTMLButtonElement,
  MultiComboBoxProps<any, any>
>(
  (
    {
      data,
      value,
      setValue,
      name,
      showValues,
      commandOnChangeCapture,
      isLoading,
      isSuccess,
    },
    ref
  ) => {
    const handleSetValue = (val: string, label: string) => {
      if (value && Array.isArray(value)) {
        const existingItemIndex = value.findIndex(
          (item: any) => Array.isArray(item) && item[0] === val
        )

        if (existingItemIndex !== -1) {
          // If the value already exists, remove it
          setValue(
            name,
            value.filter((item: any) => Array.isArray(item) && item[0] !== val)
          )
        } else {
          // If the value doesn't exist, add the new [val, label] pair
          setValue(name, [...value, [val, label]] as PathValue<any, any>)
        }
      } else {
        // If no value exists yet, initialize with the [val, label] pair
        setValue(name, [[val, label]])
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
              {showValues ? (
                <div className="flex gap-2 justify-start">
                  {value?.length
                    ? value.map((val: any) => (
                        <div
                          key={val}
                          className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                        >
                          {data?.find((d) => d.value === val)?.label}
                        </div>
                      ))
                    : 'Select an option'}
                </div>
              ) : (
                value?.length + ' selected'
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search"
              onChangeCapture={(e) => {
                if (commandOnChangeCapture) {
                  commandOnChangeCapture(e)
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {isSuccess &&
                  data?.map((d, index) => {
                    return (
                      <CommandItem
                        key={index}
                        value={d.value}
                        onSelect={(currentValue) => {
                          handleSetValue(currentValue, d.label)
                        }}
                      >
                        {capitalizeFirstChar(d.label)}
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value?.some(
                              (item: any) =>
                                Array.isArray(item) && item[0] === d.value
                            )
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
