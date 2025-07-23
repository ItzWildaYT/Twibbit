import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCw9stJHZGVO89LXN0aYk2eFYf2y1oN8gI",
  authDomain: "twibbit-566eb.firebaseapp.com",
  projectId: "twibbit-566eb",
  storageBucket: "twibbit-566eb.firebasestorage.app",
  messagingSenderId: "398351874179",
  appId: "1:398351874179:web:e1076ff7cccb6a56dfc3b6",
  measurementId: "G-MEKWLJHTJE"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Sign in
export async function loginWithGoogle() {
  await signInWithPopup(auth, provider);
}

// ✅ Sign out
export async function logout() {
  await signOut(auth);
}

// ✅ Save user profile (unique name + restricted words)
export async function saveUserProfile(user, customName = null) {
  if (!user) return;
  if (!customName || !customName.trim()) {
    throw new Error("Name cannot be empty.");
  }

  const restrictedWords = ["Owner", "Co-Owner", "Moderator"];
  const approvedUIDs = ["SxxIrBnF45PRwpHGsWcrsP4orNI2"];

  // ✅ Check for restricted words
  const hasRestricted = restrictedWords.some(word =>
    customName.toLowerCase().includes(word.toLowerCase())
  );
  if (hasRestricted && !approvedUIDs.includes(user.uid)) {
    throw new Error("You are not allowed to use that name.");
  }

  // ✅ Check if name is already taken (by someone else)
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("name", "==", customName));
  const snap = await getDocs(q);

  let taken = false;
  snap.forEach(docSnap => {
    if (docSnap.id !== user.uid) {
      // someone else has this name
      taken = true;
    }
  });

  if (taken) {
    throw new Error("That name is already taken.");
  }

  // ✅ Save only if not exists yet
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: customName,
      photo: user.photoURL,
    });
  }
}

// ====== Messaging Helpers ======

// Create a conversation between two users, or return existing
export async function createConversation(currentUserId, otherUserId) {
  const conversationsRef = collection(db, "conversations");
  const q = query(
    conversationsRef,
    where("participants", "array-contains", currentUserId)
  );
  const snapshot = await getDocs(q);
  
  // Check for existing conversation with the other user
  let existingConv = null;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (
      data.participants.length === 2 &&
      data.participants.includes(otherUserId)
    ) {
      existingConv = { id: docSnap.id, ...data };
    }
  });

  if (existingConv) {
    return existingConv.id;
  } else {
    // Create new conversation
    const docRef = await addDoc(conversationsRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

// Send a message in a conversation
export async function sendMessage(conversationId, currentUserId, text) {
  if (!text.trim()) return;
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  await addDoc(messagesRef, {
    text: text.trim(),
    userId: currentUserId,
    createdAt: serverTimestamp(),
  });
}

// Subscribe to conversations for current user
export function subscribeToConversations(currentUserId, callback) {
  const conversationsRef = collection(db, "conversations");
  const q = query(
    conversationsRef,
    where("participants", "array-contains", currentUserId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(conversations);
  });
}

// Subscribe to messages in a conversation
export function subscribeToMessages(conversationId, callback) {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}
