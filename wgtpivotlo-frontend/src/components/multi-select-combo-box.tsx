/* eslint-disable */
// Enable eslint when developing this as it has any types.
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DataProps } from '@/features/questionaire/types';
import { capitalizeEveryFirstChar } from '@/utils';
interface MultiComboBoxProps {
  data: DataProps[] | undefined;
  commandOnChangeCapture?: React.FormEventHandler<HTMLInputElement>;
  isLoading: boolean;
  isSuccess: boolean;
  extraSetValueFn?: (value: string) => void | Promise<void>;
  placeholder: string;
}
export const MultiComboxBox = ({
  data,
  commandOnChangeCapture,
  isLoading,
  isSuccess,
  extraSetValueFn,
  placeholder = 'Select an option',
}: MultiComboBoxProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-[250px] min-full justify-between overflow-visible break-normal font-normal')}
          disabled={isLoading}
        >
          {isLoading ? 'Fetching Data' : <div className="flex gap-2 justify-start">{placeholder}</div>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
                        // handleSetValue(currentValue);
                        setOpen(false);
                        if (extraSetValueFn) {
                          extraSetValueFn(currentValue);
                        }
                      }}
                    >
                      {capitalizeEveryFirstChar(d.label)}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
