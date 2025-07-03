
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { Bot } from "lucide-react"; // Bot iconnpm


const ChatBot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);   // to scroll to the latest message
  const inputRef = useRef(null);         // to keep our curson on input text by default

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSend = async () => {
    if (userInput.trim() === "") return;

    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    inputRef.current?.focus();    //auto focus on input after user finishes typing
    setLoading(true);

    try {
      const token = localStorage.getItem("synapto_token");
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      const botReply = {
        sender: "bot",
        text: data.reply || "Sorry, I didn’t get that.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Error sending message:", err);
      const botReply = {
        sender: "bot",
        text: "Something went wrong. Try again.",
      };
      setMessages((prev) => [...prev, botReply]);
    } finally {
        setLoading(false); 
    }
  };

  const handleClearChat = async () => {
    try {
      const token = localStorage.getItem("synapto_token");
      await fetch("http://localhost:5050/api/chat", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([]);
    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("synapto_token");
        const res = await fetch("http://localhost:5050/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const allMessages = data.flatMap((chat) => chat.messages);
        setMessages(allMessages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatHistory();
  }, []);

  //to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);    

  return (
    <div className="flex h-screen text-white bg-[#0a0a0a]">
      
      {/* Left Panel: Bot Info + Nav */}
      <aside className="w-72 bg-[#101010] border-r border-cyan-600 p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Bot 3D model */}
            <div className="w-72 h-72 mx-auto transition-transform duration-300 hover:scale-105">
              <Spline scene="https://prod.spline.design/IC0J9SyOs87x75Eo/scene.splinecode" />
            </div>
            <h3 className="text-lg font-bold text-cyan-400">SynaptoBot</h3>
            <p className="text-xs text-gray-400 px-2">Hi! I'm your smart study buddy 🤖 — here to guide, track, and assist you!</p>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-[#1c1c1c] hover:bg-[#2b2b2b] px-4 py-2 rounded-md text-left text-sm transition"
            >
              🧭 Dashboard
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="w-full bg-[#1c1c1c] hover:bg-[#2b2b2b] px-4 py-2 rounded-md text-left text-sm transition"
            >
              📅 Attendance
            </button>
            <button
              onClick={() => navigate("/notes")}
              className="w-full bg-[#1c1c1c] hover:bg-[#2b2b2b] px-4 py-2 rounded-md text-left text-sm transition"
            >
              📓 Notes
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full bg-[#1c1c1c] hover:bg-[#2b2b2b] px-4 py-2 rounded-md text-left text-sm transition"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
        >
          Clear Chat
        </button>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
          <Bot size={28} className="text-cyan-400" />
          <h1 className="text-xl font-semibold text-white">SynaptoBot</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >          
              {/* //checks when it's user msg or the bots to decide its location left or right */}
              <div
                className={`p-3 rounded-xl max-w-xs transition duration-300 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-right shadow-md"
                    : "bg-[#222] text-left border border-gray-600"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.time && (
                    <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
              </div>
            </div>
          ))}

          {/* Show typing indicator if loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-gray-700 rounded-xl italic animate-pulse">
                Bot is typing...
              </div>
            </div>
          )}

          {/* This ref is now inside the scroll container */}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="flex gap-3 p-4 border-t border-gray-700"
          onSubmit={(e) => {
            e.preventDefault();     //handles when enter is clicked
            handleSend();
          }}
        >
          <input
            type="text"
            value={userInput}
            ref={inputRef}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-md bg-[#1e1e1e]/60 border border-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm placeholder-gray-400 transition duration-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-md font-semibold transition duration-300"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatBot;