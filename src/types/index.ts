import type { Timestamp } from "firebase/firestore";

export interface GameMap {
    id: string;
    name: string;
    bossName: string;
    element: string;
    monsterType: string;
    mapLevel: number;
    bossLevel: number;
}

export interface Channel {
    id: string;
    name: string;
}

export interface BossTimer {
    id: string;
    map_id: string;
    channel_id: string;
    respawn_countdown: number; // in minutes
    recorded_time: Timestamp;
    monster_death_time: Timestamp | null;
    is_favorite: boolean;
}

export interface BossTimerWithDetails extends BossTimer {
    mapName: string;
    channelName: string;
    nextSpawnTime: Date | null;
}
