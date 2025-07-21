import React from "react";

export default function Share({ tweetId }) {
  function copyLink() {
    const url = `${window.location.origin}/tweet/${tweetId}`;
    navigator.clipboard.writeText(url);
    alert("Tweet link copied!");
  }

  return (
    <button
      onClick={copyLink}
      className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
    >
      📤
    </button>
  );
}
