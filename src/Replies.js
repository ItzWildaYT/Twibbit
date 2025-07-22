import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Replies({ tweetId, onClose, currentUser }) {
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "tweets", tweetId, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [tweetId]);

  async function addReply(e) {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "tweets", tweetId, "replies"), {
      text: text.trim(),
      userId: currentUser.uid,
      userName: currentUser.customName || currentUser.displayName || "Anonymous",
      userPhoto: currentUser.photoURL,
      createdAt: serverTimestamp(),
    });

    setText("");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-2">Replies</h2>
        <button
          type="button"
          className="text-red-500 mb-4"
          onClick={onClose} 
        >
          Close
        </button>

        <div className="max-h-60 overflow-y-auto mb-4">
          {replies.map((r) => (
            <div key={r.id} className="border-b py-2">
              <div className="flex items-center gap-2 mb-1">
                {r.userPhoto && (
                  <img
                    src={r.userPhoto}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-semibold">{r.userName}</span>
              </div>
              <p>{r.text}</p>
            </div>
          ))}
          {replies.length === 0 && (
            <p className="text-gray-500 text-sm">No replies yet.</p>
          )}
        </div>

        <form onSubmit={addReply} className="flex flex-col">
          <input
            className="border w-full p-2 rounded mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}

