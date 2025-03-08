/* eslint-disable */
// Enable eslint when developing this as it has any types.
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef, useCallback, useState } from 'react';
import type { ComboBoxProps } from '@/features/questionaire/types';
import { FormControl } from './ui/form';
import { capitalizeEveryFirstChar } from '@/utils';

export const ComboBox = forwardRef<HTMLButtonElement, ComboBoxProps<any, any>>(
  ({ data, value, setValue, name, isLoading }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    // Use a callback to handle selection to prevent event propagation
    const handleSelect = useCallback(
      (currentValue: string) => {
        setValue(String(name), String(currentValue));
        setOpen(false);
      },
      [name, setValue]
    );

    return (
      <>
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
                aria-expanded={open}
                onClick={(e) => {
                  // Prevent event from reaching Dialog
                  e.stopPropagation();
                }}
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
          <PopoverContent
            className="w-full p-0"
            align="start"
            side="bottom"
            sideOffset={4}
            // Force using a portal to render outside the Dialog DOM hierarchy
            forceMount
          >
            <Command
              // Stop propagation on all Command interactions
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <CommandInput placeholder="Search" className="h-9" onKeyDown={(e) => e.stopPropagation()} />
              <CommandList>
                <CommandEmpty>No data found.</CommandEmpty>
                {data && (
                  <CommandGroup>
                    {data.map((d) => (
                      <CommandItem
                        key={d.value}
                        value={capitalizeEveryFirstChar(d.value)}
                        onSelect={handleSelect}
                        // Stop propagation on mouse events
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === capitalizeEveryFirstChar(d.value) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {capitalizeEveryFirstChar(d.label)}
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

// Make sure to add displayName for forwardRef components
ComboBox.displayName = 'ComboBox';
