import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";
import Replies from "./Replies";
import Retweet from "./Retweet";
import Share from "./Share";

export default function Tweet({
  id,
  text = "",
  likes,
  userName = "Anonymous",
  userPhoto = "",
  currentUser,
  savedCustomName
}) {
  const [showReplies, setShowReplies] = useState(false);

  const safeLikes = Array.isArray(likes) ? likes : [];
  const liked = currentUser && safeLikes.includes(currentUser.uid);

  async function toggleLike() {
    if (!currentUser) return;
    const ref = doc(db, "tweets", id);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center gap-2 mb-2">
        {userPhoto && (
          <img
            src={userPhoto}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="font-semibold">{userName}</span>
      </div>

      <p className="mb-2">{text}</p>

      <div className="flex items-center gap-6 mt-2">
        <button
          onClick={() => setShowReplies(true)}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
        >
          <img
            src="/reply-icon.png"
            alt="reply"
            className="w-5 h-5 inline-block"
          />
          <span>0</span>
        </button>

        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded transition ${
            liked ? "bg-pink-500 text-white" : "bg-gray-200"
          }`}
        >
          ❤️ {safeLikes.length}
        </button>

        <Retweet
          tweetId={id}
          currentUser={currentUser}
          customName={savedCustomName || currentUser?.displayName}
        />

        <Share tweetId={id} />
      </div>

      {showReplies && (
        <Replies
          tweetId={id}
          currentUser={currentUser}
          onClose={() => setShowReplies(false)}
        />
      )}
    </div>
  );
}
