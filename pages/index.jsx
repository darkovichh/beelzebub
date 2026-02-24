"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Anonymous");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // scroll en alta otomatik
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // login user
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUsername(parsed.username);
      }
    } catch {
      setUsername("Anonymous");
    }

    // Socket başlat
    fetch("/api/socket");
    socketRef.current = io();

    // Mesajları DB’den çekmiyoruz, sayfa başında boş
    setMessages([]);

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  // Mesaj değişince scroll en alta
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        text: message,
        username: username || "Anonymous",
      });
      setMessage("");
    }
  };

  return (
    <>
      <Navbar />

      <div className="home">
        <div className="home-shadow">
          <div className="home-main">
            <div className="chat">
              <h2>Live Chat</h2>

              <div
                className="chat-messages"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                {messages.map((msg, index) => (
                  <div key={index} className="chat-message">
                    <div className="chat-header">
                      <span className="chat-username">{msg.username}</span>
                      <span className="chat-time">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="chat-text">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* scroll için */}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>

            <div className="posts"></div>
          </div>
        </div>
      </div>
    </>
  );
}