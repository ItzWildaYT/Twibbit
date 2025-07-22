import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export default function TweetForm({ user, customName }) {
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState("What's happening?");

  const placeholders = [
    "What's cooking?",
    "Share your thoughts...",
    "Anything exciting today?",
    "Tweet something awesome!",
    "Your followers are waiting...",
    "Got something to say?",
    "Tell us what's up!",
    "Write something cool!",
    "Drop a quick update!",
    "What’s on your mind?"
  ];

  useEffect(() => {
    if (text === "") {
      const random = placeholders[Math.floor(Math.random() * placeholders.length)];
      setPlaceholder(random);
    }
  }, [text]);

  async function postTweet(e) {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "tweets"), {
      text: text.trim(),
      likes: [],
      retweets: [],
      userName: customName,
      userPhoto: user.photoURL,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  }

  return (
    <form onSubmit={postTweet} className="bg-white p-4 rounded-lg shadow mb-4">
      <textarea
        className="w-full border p-2 rounded mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
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
