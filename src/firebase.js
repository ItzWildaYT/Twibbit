import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; // your initialized firebase

const firebaseConfig = {
  apiKey: "AIzaSyCw9stJHZGVO89LXN0aYk2eFYf2y1oN8gI",
  authDomain: "twibbit-566eb.firebaseapp.com",
  projectId: "twibbit-566eb",
  storageBucket: "twibbit-566eb.firebasestorage.app",
  messagingSenderId: "398351874179",
  appId: "1:398351874179:web:e1076ff7cccb6a56dfc3b6",
  measurementId: "G-MEKWLJHTJE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  await signInWithPopup(auth, provider);
}

export async function logout() {
  await signOut(auth);
}

export async function saveUserProfile(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      photo: user.photoURL,
    });
  }
}
