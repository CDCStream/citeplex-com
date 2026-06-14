import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  accent?: boolean;
}

/**
 * The CitePlex mark: citation brackets enclosing stacked reference lines.
 * Uses currentColor so it adapts to light/dark surfaces. When `accent` is
 * true, the top reference line is highlighted in amber.
 */
export function LogoMark({ className, accent = true }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <path
        d="M13 8.5H9.5V23.5H13"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 8.5H22.5V23.5H19"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 12.5H18.5"
        stroke={accent ? "#f59e0b" : "currentColor"}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M13.5 16H17" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M13.5 19.5H18.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  accent?: boolean;
}

/** Full lockup: mark + "citeplex" wordmark. */
export function Logo({
  className,
  markClassName,
  showWordmark = true,
  accent = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("h-6 w-6", markClassName)} accent={accent} />
      {showWordmark && (
        <span className="text-[15px] font-bold tracking-tight leading-none">
          cite<span className="text-zinc-400">plex</span>
        </span>
      )}
    </span>
  );
}
