import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export default function TweetForm() {
  const [text, setText] = useState("");

  async function postTweet(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "tweets"), {
      text,
      likes: 0,
      createdAt: serverTimestamp()
    });
    setText("");
  }

  return (
    <form onSubmit={postTweet} style={{marginBottom: "1rem"}}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's happening?" />
      <button type="submit">Tweet</button>
    </form>
  );
}
