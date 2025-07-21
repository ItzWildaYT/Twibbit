import React from "react";

export default function Sidebar() {
  return (
    <div className="flex flex-col p-6 gap-6 text-lg font-medium">
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🏠 Home
      </button>
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🔍 Explore
      </button>
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🔔 Notifications
      </button>
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        ✉️ Messages
      </button>
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        📑 Bookmarks
      </button>
      <button className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        👤 Profile
      </button>
      <button className="bg-blue-500 text-white rounded-full py-3 mt-6 font-bold hover:bg-blue-600">
        Post
      </button>
    </div>
  );
}

