import { DataProps } from '@/features/questionaire/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { capitalizeEveryFirstChar } from '@/utils';
import { RedCross } from './red-cross';
import { Loader2 } from 'lucide-react';

interface NameSelectProps {
  title: string;
  options: DataProps[];
  onValueChange: (value: string) => void | Promise<void>;
  onRedCrossClick: () => void | Promise<void>;
  selectValue: string;
  isLoading: boolean;
}

export const DropdownComponent = ({
  title,
  options,
  onValueChange,
  onRedCrossClick,
  selectValue,
  isLoading,
}: NameSelectProps) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <p className="text-sm font-medium truncate">{capitalizeEveryFirstChar(title)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              void onRedCrossClick();
            }}
            className="flex-shrink-0"
            disabled={isLoading}
            aria-label={`Remove ${title}`}
          >
            <RedCross size={16} className="cursor-pointer" />
          </button>
        </div>
        {isLoading && (
          <div className="flex-shrink-0">
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <Select value={selectValue} onValueChange={(e) => void onValueChange(e)} disabled={isLoading}>
        <SelectTrigger className="h-9 text-sm w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
