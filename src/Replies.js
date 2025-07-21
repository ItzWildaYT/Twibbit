import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Replies({ tweetId, currentUser }) {
  const [replies, setReplies] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "tweets", tweetId, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [tweetId]);

  async function sendReply(e) {
    e.preventDefault();
    if (!currentUser || !text.trim()) return;
    await addDoc(collection(db, "tweets", tweetId, "replies"), {
      text: text.trim(),
      userName: currentUser.displayName || "Anonymous",
      userPhoto: currentUser.photoURL || "",
      createdAt: serverTimestamp(),
    });
    setText("");
    setShowBox(false);
  }

  return (
    <div className="flex flex-col">
      {/* Button to open replies */}
      <button
        onClick={() => setShowBox(!showBox)}
        className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
      >
        <img src="/reply-icon.png" alt="reply" className="w-5 h-5 inline-block" />
        <span>{replies.length}</span>
      </button>

      {/* Reply box */}
      {showBox && currentUser && (
        <form onSubmit={sendReply} className="mt-2">
          <textarea
            className="w-full border p-2 rounded mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Reply
          </button>
        </form>
      )}

      {/* List replies */}
      {replies.length > 0 && (
        <div className="mt-2 space-y-2 border-l pl-3">
          {replies.map((r) => (
            <div key={r.id} className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-2 mb-1">
                {r.userPhoto && (
                  <img
                    src={r.userPhoto}
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span className="font-medium text-sm">{r.userName}</span>
              </div>
              <p className="text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
