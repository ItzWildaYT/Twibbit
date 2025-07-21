import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export default function TweetForm({ user, customName }) {
  const [text, setText] = useState("");

  async function postTweet(e) {
    e.preventDefault();
    if (!text.trim()) return;

    // ✅ Use the customName from Firestore instead of Google displayName
    await addDoc(collection(db, "tweets"), {
      text: text.trim(),
      likes: [],
      userName: customName,          // 👈 CUSTOM NAME
      userPhoto: user.photoURL,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  }

  return (
    <form
      onSubmit={postTweet}
      className="bg-white p-4 rounded-lg shadow mb-4"
    >
      <textarea
        className="w-full border p-2 rounded mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tweet
      </button>
    </form>
  );
}


