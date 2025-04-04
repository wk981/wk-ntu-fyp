/* eslint-disable */
// Enable eslint when developing this as it has any types.
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { ControllerRenderProps, FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form';
import { DataProps } from '@/features/questionaire/types';
import { FormControl } from './ui/form';
import { capitalizeEveryFirstChar } from '@/utils';

interface FormFieldMultiComboBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends ControllerRenderProps<TFieldValues, TName> {
  data: DataProps[] | undefined;
  setValue: UseFormSetValue<TFieldValues>; // Corrected type
  showValues: boolean;
  commandOnChangeCapture?: React.FormEventHandler<HTMLInputElement>;
  isLoading: boolean;
  isSuccess: boolean;
  extraSetValueFn?: (currentValue: string) => void;
}

export const FormFieldMultiComboBox = forwardRef<HTMLButtonElement, FormFieldMultiComboBoxProps<any, any>>(
  ({ data, value, setValue, name, showValues, commandOnChangeCapture, isLoading, isSuccess, extraSetValueFn }, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleSetValue = (val: string, label: string) => {
      if (value && Array.isArray(value)) {
        const existingItemIndex = value.findIndex((item: any) => Array.isArray(item) && item[0] === val);

        if (existingItemIndex !== -1) {
          // If the value already exists, remove it
          setValue(
            name,
            value.filter((item: any) => Array.isArray(item) && item[0] !== val)
          );
        } else {
          // If the value doesn't exist, add the new [val, label] pair
          setValue(name, [...value, [val, label]] as PathValue<any, any>);
        }
      } else {
        // If no value exists yet, initialize with the [val, label] pair
        setValue(name, [[val, label]]);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-[250px] min-full justify-between overflow-visible break-normal font-normal',
                !value && 'text-muted-foreground'
              )}
              ref={ref}
              disabled={isLoading}
            >
              {isLoading ? (
                'Fetching Data'
              ) : showValues ? (
                <div className="flex gap-2 justify-start">
                  {value?.length
                    ? value.map((val: any) => (
                        <div key={val} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">
                          {capitalizeEveryFirstChar(data?.find((d) => d.value === value.toLowerCase())?.label || '')}
                        </div>
                      ))
                    : 'Select an option'}
                </div>
              ) : (
                (value?.length | 0) + ' Selected'
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search"
              onChangeCapture={(e) => {
                if (commandOnChangeCapture) {
                  commandOnChangeCapture(e);
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
                        value={capitalizeEveryFirstChar(d.value)}
                        onSelect={(currentValue) => {
                          handleSetValue(currentValue, d.label);
                          setOpen(false);
                          if (extraSetValueFn) {
                            extraSetValueFn(currentValue);
                          }
                        }}
                      >
                        {capitalizeEveryFirstChar(d.label)}
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value?.some((item: any) => Array.isArray(item) && item[0] === d.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
