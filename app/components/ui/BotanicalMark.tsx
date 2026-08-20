interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export default function BotanicalMark({ size = 22, color = "currentColor", className }: Props) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 25 Q9.5 18 10 8" stroke={color} strokeWidth="1.15" strokeLinecap="round" />
      <path d="M10 21 C8 19 5 19 4 17 C6 13 10 15 10 19 Z" fill={color} />
      <path d="M10 16 C12 14 15 13 16 11 C14 7 10 9 10 14 Z" fill={color} opacity="0.78" />
      <path d="M10 9 C9.5 7 9 5 10 3 C11 5 10.5 7 10 9 Z" fill={color} opacity="0.5" />
    </svg>
  );
}
