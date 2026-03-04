import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BossTimer } from "@/types";

const COLLECTION_NAME = "boss_timers";

export function subscribeBossTimers(
    callback: (timers: BossTimer[]) => void
) {
    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("recorded_time", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const timers: BossTimer[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                map_id: data.map_id,
                channel_id: data.channel_id,
                respawn_countdown: data.respawn_countdown,
                recorded_time: data.recorded_time,
                monster_death_time: data.monster_death_time ?? null,
            };
        });
        callback(timers);
    });
}

export async function addBossTimer(data: {
    map_id: string;
    channel_id: string;
    respawn_countdown: number;
}) {
    await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        recorded_time: Timestamp.now(),
        monster_death_time: null,
    });
}

export async function updateBossDeathTime(id: string) {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
        monster_death_time: Timestamp.now(),
    });
}

export async function updateBossTimer(id: string, data: {
    respawn_countdown: number;
    monster_death_time: Timestamp | null;
}) {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function resetBossTimer(id: string) {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
        monster_death_time: null,
    });
}

export async function deleteBossTimer(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
