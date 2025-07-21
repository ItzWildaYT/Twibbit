import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Tweet from "./Tweet";

export default function Feed({ user }) {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTweets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      {tweets.map(t => (
        <Tweet
          key={t.id}
          id={t.id}
          text={t.text}
          likes={t.likes}
          userName={t.userName}
          userPhoto={t.userPhoto}
          currentUser={user}
        />
      ))}
    </div>
  );
}

