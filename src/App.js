import React from "react";
import TweetForm from "./TweetForm";
import Feed from "./Feed";

export default function App() {
  return (
    <div style={{maxWidth: "600px", margin: "auto"}}>
      <h1>Mini Twitter</h1>
      <TweetForm />
      <Feed />
    </div>
  );
}
