import { useEffect, useState } from "react";
import { subscribeBossTimers } from "@/services/bossTimerService";
import type { BossTimer } from "@/types";

export function useBossTimers() {
    const [bossTimers, setBossTimers] = useState<BossTimer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeBossTimers((data) => {
            setBossTimers(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { bossTimers, loading };
}
