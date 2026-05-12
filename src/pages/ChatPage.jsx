import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Phone, Video, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const productData = location.state?.product;
  const sellerData = location.state?.seller || productData?.seller;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Generate a chat ID based on product and user
  const chatId = productData
    ? `${user?.uid}_${productData.sellerId || "seller"}_${productData.id}`
    : `general_${user?.uid}`;

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      console.error("Chat listener error:", error);
      // Fallback for when collection doesn't exist yet
      setMessages([]);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const text = input;
    setInput("");
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        text: text,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Send message error:", error);
      // Show message locally as fallback
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        senderId: user.uid,
        text: text,
        timestamp: { seconds: Date.now() / 1000 },
      }]);
    }
  };

  if (!user) { navigate("/"); return null; }

  const formatTime = (timestamp) => {
    if (!timestamp?.seconds) return "Now";
    return new Date(timestamp.seconds * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="chat-page-full">
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>bazario</h2>
        </div>
        {productData && (
          <div className="chat-contact active">
            <img src={productData.image} alt="" className="chat-contact-img" />
            <div>
              <h4>{sellerData?.name || "Seller"}</h4>
              <p>{productData.title}</p>
            </div>
          </div>
        )}
      </div>

      {/* CHAT AREA */}
      <div className="chat-main">
        {/* HEADER */}
        <div className="chat-main-header">
          <div className="chat-header-left">
            <button onClick={() => navigate(-1)} className="chat-back-btn">
              <ArrowLeft size={22} />
            </button>
            {productData && (
              <img src={productData.image} alt="" className="chat-avatar" />
            )}
            <div>
              <h3>{sellerData?.name || "Seller"}</h3>
              <span className="chat-status">Active now</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <Phone size={20} />
            <Video size={20} />
            <Info size={20} />
          </div>
        </div>

        {/* PRODUCT PREVIEW */}
        {productData && (
          <div className="chat-product-preview">
            <img src={productData.image} alt="" />
            <div>
              <h4>{productData.title}</h4>
              <p className="chat-product-price">₹{productData.price}</p>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Start a conversation about this product</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-wrapper ${
                msg.senderId === user.uid ? "sent" : "received"
              }`}
            >
              <div className={`chat-bubble ${msg.senderId === user.uid ? "sent" : "received"}`}>
                <p>{msg.text}</p>
                <span className="chat-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input-bar">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="chat-send-btn">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;