import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="flex flex-col p-6 gap-6 text-lg font-medium">
      <Link to="/" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🏠 Home
      </Link>
      <Link to="/explore" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🔍 Explore
      </Link>
      <Link to="/notifications" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        🔔 Notifications
      </Link>
      <Link to="/messages" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        ✉️ Messages
      </Link>
      <Link to="/bookmarks" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        📑 Bookmarks
      </Link>
      <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-200 p-3 rounded-full">
        👤 Profile
      </Link>
      <button className="bg-blue-500 text-white rounded-full py-3 mt-6 font-bold hover:bg-blue-600">
        Post
      </button>
    </div>
  );
}
