import React, { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout, saveUserProfile, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import TweetForm from "./TweetForm";
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";
import TweetPage from "./TweetPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Modal for choosing a custom name
function UsernameModal({ onSave }) {
  const [name, setName] = useState("");

  // ✅ Add a simple list of banned words
  const bannedWords = [
    "niger",
    "dickhead",
    "shit",
    "fuck",
    "bitch",
    "nigger",
    "asshole",
    // add more as you like
  ];

  function containsBadWord(input) {
    const lower = input.toLowerCase();
    return bannedWords.some((bw) => lower.includes(bw));
  }

  function handleSave() {
    const trimmed = name.trim();

    if (!trimmed) {
      alert("Name cannot be empty");
      return;
    }

    if (containsBadWord(trimmed)) {
      alert("That name contains inappropriate language. Please choose another name.");
      return;
    }

    // ✅ valid name
    onSave(trimmed);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Choose your Twibbit name</h2>
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
}


function UnderConstruction() {
  return (
    <div className="text-center mt-20 text-xl font-bold">
      Oops, This place is still under construction!
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [needsName, setNeedsName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          setCustomName(snap.data().name);
          setNeedsName(false);
        } else {
          setNeedsName(true);
        }
      } else {
        setNeedsName(false);
        setCustomName("");
      }
    });
    return unsub;
  }, []);

  async function handleSaveName(name) {
    try {
      await saveUserProfile(user, name);
      setCustomName(name);
      setNeedsName(false);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen text-gray-900 relative">
        {needsName && <UsernameModal onSave={handleSaveName} />}

        {/* Top bar */}
        <header className="bg-white shadow p-3 md:p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setShowSidebar(true)}
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold text-blue-500">
              Twibbit
            </h1>
          </div>
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

        <div className="grid grid-cols-12">
          <div className="hidden md:block md:col-span-3 border-r min-h-screen">
            <Sidebar />
          </div>

          <main className="col-span-12 md:col-span-6 max-w-2xl mx-auto p-2 md:p-4">
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    <>
                      <TweetForm user={user} customName={customName} />
                      <Feed user={user} />
                    </>
                  ) : (
                    <p className="text-center mt-20">
                      Sign in to post and like tweets.
                    </p>
                  )
                }
              />
              <Route path="/tweet/:tweetId" element={<TweetPage currentUser={user} />} /> {/* 👈 NEW */}
              <Route path="/explore" element={<UnderConstruction />} />
              <Route path="/notifications" element={<UnderConstruction />} />
              <Route path="/messages" element={<UnderConstruction />} />
              <Route path="/bookmarks" element={<UnderConstruction />} />
              <Route path="/profile" element={<UnderConstruction />} />
            </Routes>
          </main>

          <div className="hidden lg:block lg:col-span-3 border-l min-h-screen">
            <Rightbar />
          </div>
        </div>

        {showSidebar && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="bg-white w-64 h-full p-4">
              <button
                className="mb-4 text-red-500"
                onClick={() => setShowSidebar(false)}
              >
                Close ✖
              </button>
              <Sidebar />
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow p-2 flex justify-around md:hidden">
          <a href="/" className="p-2">🏠</a>
          <a href="/explore" className="p-2">🔍</a>
          <a href="/notifications" className="p-2">🔔</a>
          <a href="/profile" className="p-2">👤</a>
        </nav>
      </div>
    </Router>
  );
}
