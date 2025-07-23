import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { findUserByName, startConversation } from "./conversationHelpers";

export default function Messages({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchName, setSearchName] = useState("");

  // 🔥 Fetch all conversations for this user
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "conversations"), where("participants", "array-contains", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  // 🔥 Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversation) return;
    const q = query(
      collection(db, "conversations", activeConversation, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [activeConversation]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    await addDoc(collection(db, "conversations", activeConversation, "messages"), {
      text: newMessage.trim(),
      senderId: currentUser.uid,
      createdAt: serverTimestamp()
    });
    setNewMessage("");
  }

  async function handleStartChat() {
    if (!searchName.trim()) return;
    const otherUser = await findUserByName(searchName.trim());
    if (!otherUser) {
      alert("User not found");
      return;
    }
    const convId = await startConversation(currentUser.uid, otherUser.uid);
    setActiveConversation(convId);
    setSearchName("");
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar: conversation list and new chat */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Messages</h2>

        <div className="mb-4">
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Search by name to start chat"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleStartChat} className="bg-blue-500 text-white px-3 py-1 rounded">
            Start Chat
          </button>
        </div>

        {conversations.map(c => (
          <div
            key={c.id}
            onClick={() => setActiveConversation(c.id)}
            className={`p-2 mb-2 rounded cursor-pointer ${activeConversation === c.id ? "bg-blue-100" : "hover:bg-gray-200"}`}
          >
            <div className="font-medium">Conversation</div>
            <div className="text-sm text-gray-500">{c.lastMessage}</div>
          </div>
        ))}
      </div>

      {/* Right pane: messages */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`mb-2 ${m.senderId === currentUser.uid ? "text-right" : "text-left"}`}
                >
                  <span className="inline-block bg-gray-200 p-2 rounded">
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex">
              <input
                className="border flex-1 p-2 rounded mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation or start a new one
          </div>
        )}
      </div>
    </div>
  );
}
