import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownCellProps {
  targetTime: Date | null;
}

export function CountdownCell({ targetTime }: CountdownCellProps) {
  const { timeLeft, totalSeconds, isSpawned } = useCountdown(targetTime);

  if (!targetTime) {
    return (
      <span className="text-sm text-muted-foreground italic">
        Not killed yet
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-mono font-bold tracking-wider transition-colors",
        isSpawned &&
          "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30",
        !isSpawned &&
          totalSeconds <= 60 &&
          "bg-red-500/10 text-red-400 border border-red-500/20",
        !isSpawned &&
          totalSeconds > 60 &&
          totalSeconds <= 300 &&
          "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        !isSpawned &&
          totalSeconds > 300 &&
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      )}
    >
      {isSpawned && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      )}
      {timeLeft}
    </span>
  );
}
