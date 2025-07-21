import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";

export default function Retweet({ tweetId, currentUser }) {
  const [retweets, setRetweets] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "tweets", tweetId), (snap) => {
      const data = snap.data();
      setRetweets(Array.isArray(data?.retweets) ? data.retweets : []);
    });
    return () => unsub();
  }, [tweetId]);

  const retweeted = currentUser && retweets.includes(currentUser.uid);

  async function toggleRetweet() {
    if (!currentUser) return;
    const ref = doc(db, "tweets", tweetId);
    await updateDoc(ref, {
      retweets: retweeted
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
  }

  return (
    <button
      onClick={toggleRetweet}
      className={`flex items-center gap-1 px-3 py-1 rounded transition ${
        retweeted ? "bg-green-500 text-white" : "bg-gray-200"
      }`}
    >
      🔁 {retweets.length}
    </button>
  );
}
