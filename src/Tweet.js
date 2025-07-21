import React from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export default function Tweet({ id, text, likes }) {
  async function like() {
    await updateDoc(doc(db, "tweets", id), {
      likes: increment(1)
    });
  }

  return (
    <div style={{border: "1px solid #ccc", padding: "8px", margin: "4px 0"}}>
      <p>{text}</p>
      <button onClick={like}>❤️ {likes}</button>
    </div>
  );
}
