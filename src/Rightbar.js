import React from "react";

export default function Rightbar() {
  return (
    <div className="p-6">
      {/* What's happening */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-lg mb-3">What’s happening</h2>
        <div className="mb-2">
          <p className="text-sm font-semibold">Trending in Twibbit</p>
          <p className="text-sm text-gray-500">#TwibbitLaunch</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Sports · Trending</p>
          <p className="text-sm text-gray-500">#Firebird</p>
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-3">Who to follow</h2>
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://i.imgur.com/8Km9tLL.png"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">@itzwilda</span>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600">
          Follow
        </button>
      </div>
    </div>
  );
}

