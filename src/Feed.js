import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Tweet from "./Tweet";

export default function Feed({ user }) {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTweets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      {tweets.map((tweet) => (
        <div key={tweet.id} className="border-b p-4">
          {tweet.retweetOf && (
            <p className="text-sm text-gray-500 mb-1">
              🔁 Retweeted from {tweet.originalAuthorName}
            </p>
          )}
          <Tweet
            id={tweet.id}
            text={tweet.text}
            likes={tweet.likes}
            userName={tweet.userName}
            userPhoto={tweet.userPhoto}
            currentUser={user}
          />
        </div>
      ))}
    </div>
  );
}

