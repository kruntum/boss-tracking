import { useEffect, useState } from "react";

export interface CountdownResult {
    timeLeft: string;
    totalSeconds: number;
    isSpawned: boolean;
}

export function useCountdown(targetTime: Date | null): CountdownResult {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!targetTime) {
        return { timeLeft: "—", totalSeconds: -1, isSpawned: false };
    }

    const diffMs = targetTime.getTime() - now.getTime();

    if (diffMs <= 0) {
        return { timeLeft: "SPAWNED!", totalSeconds: 0, isSpawned: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    parts.push(`${String(minutes).padStart(2, "0")}m`);
    parts.push(`${String(seconds).padStart(2, "0")}s`);

    return { timeLeft: parts.join(" "), totalSeconds, isSpawned: false };
}
