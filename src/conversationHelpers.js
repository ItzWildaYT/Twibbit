import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function findUserByName(name) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("name", "==", name));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { uid: doc.id, ...doc.data() };
}

export async function startConversation(uid1, uid2) {
  const convRef = collection(db, "conversations");
  const participants = [uid1, uid2].sort();
  const participantsKey = participants.join("_");

  const q = query(convRef, where("participantsKey", "==", participantsKey));
  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].id;
  }

  const docRef = await addDoc(convRef, {
    participants,
    participantsKey,
    lastMessage: "",
    createdAt: new Date(),
  });

  return docRef.id;
}

