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
import type { Channel } from "@/types";

const COLLECTION_NAME = "channels";

export function subscribeChannels(callback: (channels: Channel[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    return onSnapshot(q, (snapshot) => {
        const channels: Channel[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
        }));
        callback(channels);
    });
}

export async function addChannel(name: string) {
    await addDoc(collection(db, COLLECTION_NAME), { name });
}

export async function deleteChannel(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
