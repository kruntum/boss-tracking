import { useEffect, useState } from "react";
import { subscribeMaps } from "@/services/mapService";
import type { GameMap } from "@/types";

export function useMaps() {
    const [maps, setMaps] = useState<GameMap[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeMaps((data) => {
            setMaps(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { maps, loading };
}
