import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export async function findUserByName(name) {
  const q = query(collection(db, "users"), where("name", "==", name));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function startConversation(currentUserId, otherUserId) {
  // Check if a conversation already exists
  const q = query(collection(db, "conversations"), where("participants", "array-contains", currentUserId));
  const snap = await getDocs(q);

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.participants.includes(otherUserId)) {
      return docSnap.id;
    }
  }

  // Else create a new one
  const newConv = await addDoc(collection(db, "conversations"), {
    participants: [currentUserId, otherUserId],
    lastMessage: "",
    lastUpdated: new Date()
  });
  return newConv.id;
}
