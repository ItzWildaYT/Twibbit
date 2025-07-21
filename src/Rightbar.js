import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function Rightbar() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(doc => doc.data()));
    }
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-3">Who to follow</h2>
        {users.map((u) => (
          <div key={u.uid} className="flex items-center gap-3 mb-3">
            <img
              src={u.photo}
              alt={u.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

