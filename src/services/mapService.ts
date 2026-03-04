import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GameMap } from "@/types";

const COLLECTION_NAME = "maps";

export function subscribeMaps(callback: (maps: GameMap[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    return onSnapshot(q, (snapshot) => {
        const maps: GameMap[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                bossName: data.bossName || "",
                element: data.element || "",
                monsterType: data.monsterType || "",
            };
        });
        callback(maps);
    });
}

export async function addMap(mapData: Omit<GameMap, 'id'>) {
    await addDoc(collection(db, COLLECTION_NAME), mapData);
}

export async function deleteMap(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
