import { cn } from '@/lib/utils';

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinnerComponent = ({ size = 24, className, ...props }: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export const LoadingSpinner = ({ size = 24, className, ...props }: ISVGProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <LoadingSpinnerComponent size={size} className={className} {...props} />
    </div>
  );
};

export const LoadingSpinnerWrapper = ({ size = 24, className, children, ...props }: ISVGProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <div className="flex flex-col items-center">
        <LoadingSpinnerComponent size={size} className={className} {...props} />
        {children}
      </div>
    </div>
  );
};
