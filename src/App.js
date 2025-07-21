import React, { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout, saveUserProfile, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import TweetForm from "./TweetForm";
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";

function UsernameModal({ onSave }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Choose your Twibbit name</h2>
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            if (!name.trim()) {
              alert("Name cannot be empty");
              return;
            }
            onSave(name.trim());
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [needsName, setNeedsName] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          setNeedsName(true);
        }
      } else {
        setNeedsName(false);
      }
    });
    return unsub;
  }, []);

  async function handleSaveName(name) {
  try {
    await saveUserProfile(user, name);
    setNeedsName(false); // close the modal if successful
  } catch (err) {
    alert(err.message); // show the error (duplicate name, restricted word, etc.)
  }
}


  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      {needsName && <UsernameModal onSave={handleSaveName} />}
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
            <p className="text-center mt-20">Sign in to post and like tweets.</p>
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



