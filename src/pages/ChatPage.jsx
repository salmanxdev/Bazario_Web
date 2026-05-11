import { useState } from "react";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! How can we help you today?",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    showToast.success("Message sent!");

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: messages.length + 2,
        sender: "support",
        text: "Thanks for your message! We'll get back to you soon.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="chat-header-content">
            <MessageCircle size={24} />
            <h1>Live Chat Support</h1>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`message ${msg.sender === "user" ? "user-message" : "support-message"}`}
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button 
            onClick={handleSendMessage}
            className="send-btn"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
