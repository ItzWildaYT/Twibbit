import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function Retweet({ tweetId, currentUser }) {
  const [loading, setLoading] = useState(false);

  async function handleRetweet() {
    if (!currentUser) return;
    setLoading(true);

    try {
      // Get original tweet data
      const originalSnap = await getDoc(doc(db, "tweets", tweetId));
      if (!originalSnap.exists()) {
        alert("Original tweet not found!");
        setLoading(false);
        return;
      }
      const originalData = originalSnap.data();

      // Create a new tweet that references the original
      await addDoc(collection(db, "tweets"), {
        text: originalData.text,
        likes: [],
        retweets: [],
        userName: currentUser.customName || currentUser.displayName || "Anonymous",
        userPhoto: currentUser.photoURL,
        userId: currentUser.uid,
        retweetOf: tweetId, // reference to original
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



