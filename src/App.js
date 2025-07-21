import React, { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import TweetForm from "./TweetForm";
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      {/* Top bar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-500">Twibbit</h1>
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Sign in with Google
          </button>
        )}
      </header>

      {/* Three-column layout */}
      <div className="grid grid-cols-12">
        {/* Left Sidebar */}
        <div className="col-span-3 border-r min-h-screen">
          <Sidebar />
        </div>

        {/* Center feed */}
        <main className="col-span-6 max-w-2xl mx-auto p-4">
          {user ? (
            <>
              <TweetForm user={user} />
              <Feed user={user} />
            </>
          ) : (
            <p className="text-center mt-20">
              Sign in to post and like tweets.
            </p>
          )}
        </main>

        {/* Right Sidebar */}
        <div className="col-span-3 border-l min-h-screen">
          <Rightbar />
        </div>
      </div>
    </div>
  );
}


