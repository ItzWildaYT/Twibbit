import React from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";

export default function Tweet({
  id,
  text = "",
  likes,
  userName = "Anonymous",
  userPhoto = "",
  currentUser
}) {
  // ✅ Ensure likes is always an array
  const safeLikes = Array.isArray(likes) ? likes : [];

  const liked = currentUser && safeLikes.includes(currentUser.uid);

  async function toggleLike() {
    if (!currentUser) return;
    const ref = doc(db, "tweets", id);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center gap-2 mb-2">
        {userPhoto && <img src={userPhoto} alt="" className="w-8 h-8 rounded-full" />}
        <span className="font-semibold">{userName}</span>
      </div>
      <p className="mb-2">{text}</p>
      <button
        onClick={toggleLike}
        className={`px-3 py-1 rounded ${
          liked ? "bg-pink-500 text-white" : "bg-gray-200"
        }`}
      >
        ❤️ {safeLikes.length}
      </button>
    </div>
  );
}


