import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Tweet from "./Tweet";

export default function TweetPage({ currentUser }) {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTweet() {
      try {
        const snap = await getDoc(doc(db, "tweets", tweetId));
        if (snap.exists()) {
          setTweet({ id: snap.id, ...snap.data() });
        } else {
          setTweet(null);
        }
      } catch (err) {
        console.error("Error loading tweet:", err);
        setTweet(null);
      } finally {
        setLoading(false);
      }
    }

    loadTweet();
  }, [tweetId]);

  if (loading) return <p className="p-4">Loading tweet…</p>;
  if (!tweet) return <p className="p-4">Tweet not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <Tweet
        id={tweet.id}
        text={tweet.text}
        likes={tweet.likes}
        userName={tweet.userName}
        userPhoto={tweet.userPhoto}
        currentUser={currentUser}
      />
    </div>
  );
}
