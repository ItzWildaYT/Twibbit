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

  function openReplies() {
    // For now, just log or alert; later we can open a replies modal or section
    alert(`Open replies for tweet ${id}`);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center gap-2 mb-2">
        {userPhoto && (
          <img src={userPhoto} alt="" className="w-8 h-8 rounded-full" />
        )}
        <span className="font-semibold">{userName}</span>
      </div>
      <p className="mb-2">{text}</p>

      {/* Action bar */}
      <div className="flex items-center gap-6 mt-2">
        {/* Replies button */}
        <button
          onClick={openReplies}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
        >
          <img
            src="/reply-icon.png"
            alt="reply"
            className="w-5 h-5 inline-block"
          />
          <span>0</span> {/* later replace with reply count */}
        </button>

        {/* Likes button */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded transition ${
            liked ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          ❤️ {safeLikes.length}
        </button>

        {/* Retweet placeholder */}
        <button className="flex items-center gap-1 text-gray-600 hover:text-green-500">
          🔁 0
        </button>

        {/* Share placeholder */}
        <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500">
          📤
        </button>
      </div>
    </div>
  );
}



