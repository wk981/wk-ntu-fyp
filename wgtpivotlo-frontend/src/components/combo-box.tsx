/* eslint-disable */
// Enable eslint when developing this as it has any types.
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { ComboBoxProps } from '@/features/questionaire/types';
import { FormControl } from './ui/form';
import { capitalizeEveryFirstChar } from '@/utils';

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
                  'w-[250px] min-full justify-between overflow-visible break-normal',
                  !value && 'text-muted-foreground'
                )}
                ref={ref}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Fetching Data'
                  : value && data
                    ? capitalizeEveryFirstChar(data.find((d) => d.value === value.toLowerCase())?.label || '')
                    : 'Select an option'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search" className="h-9" />
              <CommandList>
                <CommandEmpty>No data found.</CommandEmpty>
                {data && (
                  <CommandGroup>
                    {data.map((d) => (
                      <CommandItem
                        key={d.value}
                        value={capitalizeEveryFirstChar(d.value)}
                        onSelect={(currentValue) => {
                          setValue(String(name), String(currentValue));
                        }}
                      >
                        {capitalizeEveryFirstChar(d.label)}
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === capitalizeEveryFirstChar(d.value) ? 'opacity-100' : 'opacity-0'
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
    );
  }
);
