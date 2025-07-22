import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function Retweet({ tweetId, currentUser, customName }) {
  const [loading, setLoading] = useState(false);

  async function handleRetweet() {
    if (!currentUser) return;
    setLoading(true);

    try {
      const originalSnap = await getDoc(doc(db, "tweets", tweetId));
      if (!originalSnap.exists()) {
        alert("Original tweet not found!");
        setLoading(false);
        return;
      }
      const originalData = originalSnap.data();

      await addDoc(collection(db, "tweets"), {
        text: originalData.text,
        likes: [],
        retweets: [],
        userName: customName,
        userPhoto: currentUser.photoURL,
        userId: currentUser.uid,
        retweetOf: tweetId,
        originalAuthorName: originalData.userName,
        originalAuthorPhoto: originalData.userPhoto,
        originalAuthorId: originalData.userId,
        createdAt: serverTimestamp(),
      });

      alert("Retweeted!");
    } catch (err) {
      console.error("Retweet error:", err);
      alert("Failed to retweet. Try again later.");
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleRetweet}
      disabled={loading}
      className="flex items-center gap-1 text-gray-600 hover:text-green-500"
    >
      🔁 Retweet
    </button>
  );
}
