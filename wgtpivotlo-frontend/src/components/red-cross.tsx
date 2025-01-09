interface RedCrossProps {
  size?: number;
  className?: string;
}

export function RedCross({ size = 24, className = '' }: RedCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M18 6L6 18M6 6L18 18" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
