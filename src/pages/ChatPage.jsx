import { useState, useEffect, useRef } from "react";
import {
  Send, ArrowLeft, Phone, Video, Info, X, Mic, MicOff,
  Video as VideoIcon, VideoOff, PhoneOff, ShoppingCart,
  ChevronDown, ChevronUp, HelpCircle, MessageCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import {
  collection, addDoc, query, orderBy, onSnapshot,
  serverTimestamp, doc, setDoc, deleteDoc, getDoc
} from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";
import { toast } from "react-toastify";

const AGORA_APP_ID = "5492309418244c9a873bb0a2f417dbfd";

const FAQ_ITEMS = [
  { q: "How do I place an order?", a: "Click the 'Buy Now' button on the product preview or add it to your cart. Then proceed to checkout and complete payment via Razorpay." },
  { q: "What payment methods are accepted?", a: "We accept UPI, debit/credit cards, net banking, and popular wallets through our Razorpay integration." },
  { q: "How can I track my order?", a: "Go to the Orders page from the navigation bar. You'll see real-time status updates for all your orders." },
  { q: "What is the return policy?", a: "You can request a return within 7 days of delivery. Contact the seller through this chat to initiate the return process." },
  { q: "Is my payment secure?", a: "Yes! All payments are processed through Razorpay's secure gateway with 256-bit SSL encryption." },
  { q: "How do I contact the seller?", a: "You're already in the chat! Type your message below and the seller will respond. You can also call them using the phone/video icons above." },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const productData = location.state?.product;
  const sellerData = location.state?.seller || productData?.seller;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Call state
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" | "video"
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);

  // Agora refs
  const agoraClientRef = useRef(null);
  const localTracksRef = useRef({ videoTrack: null, audioTrack: null });
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callTimerRef = useRef(null);

  // FAQ state
  const [showFaq, setShowFaq] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Generate a chat ID based on product and user
  const chatId = productData
    ? `${user?.uid}_${productData.sellerId || "seller"}_${productData.id}`
    : `general_${user?.uid}`;

  const callChannelName = `call_${chatId}`;

  // Listen to messages
  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      console.error("Chat listener error:", error);
      setMessages([]);
    });
    return () => unsubscribe();
  }, [chatId]);

  // Listen for incoming calls
  useEffect(() => {
    if (!chatId || !user?.uid) return;
    const callDocRef = doc(db, "calls", chatId);
    const unsubscribe = onSnapshot(callDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const callData = snapshot.data();
        if (callData.callerId !== user.uid && callData.status === "ringing") {
          setIncomingCall(callData);
        }
        if (callData.status === "ended") {
          endCall(true);
          setIncomingCall(null);
        }
      } else {
        if (incomingCall) setIncomingCall(null);
      }
    });
    return () => unsubscribe();
  }, [chatId, user?.uid]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    if (inCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [inCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  const cleanupTracks = () => {
    if (localTracksRef.current.videoTrack) {
      localTracksRef.current.videoTrack.stop();
      localTracksRef.current.videoTrack.close();
    }
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.stop();
      localTracksRef.current.audioTrack.close();
    }
    localTracksRef.current = { videoTrack: null, audioTrack: null };
  };

  const cleanupCall = () => {
    if (agoraClientRef.current) {
      agoraClientRef.current.leave().catch(() => {});
      agoraClientRef.current.removeAllListeners();
      agoraClientRef.current = null;
    }
    cleanupTracks();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
  };

  const startCall = async (type) => {
    if (!user?.uid) { toast.error("Please login first"); return; }
    setIsCallConnecting(true);
    setCallType(type);

    try {
      // Create Agora client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      agoraClientRef.current = client;

      // Listen for remote user
      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "video" && remoteVideoRef.current) {
          remoteUser.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack.play();
        }
      });

      client.on("user-left", () => {
        endCall(false);
      });

      // Create tracks
      if (type === "video") {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { videoTrack, audioTrack };
      } else {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracksRef.current = { videoTrack: null, audioTrack };
      }

      // Join channel
      await client.join(AGORA_APP_ID, callChannelName, null, user.uid);

      // Publish tracks
      const tracksToPublish = Object.values(localTracksRef.current).filter(Boolean);
      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
      }

      // Play local video
      if (type === "video" && localTracksRef.current.videoTrack && localVideoRef.current) {
        setTimeout(() => {
          if (localVideoRef.current) {
            localTracksRef.current.videoTrack.play(localVideoRef.current);
          }
        }, 300);
      }

      // Signal call via Firestore
      await setDoc(doc(db, "calls", chatId), {
        callerId: user.uid,
        callerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        callType: type,
        channelName: callChannelName,
        status: "ringing",
        startedAt: serverTimestamp(),
      });

      setInCall(true);
      setCallDuration(0);
      toast.success(`${type === "video" ? "Video" : "Audio"} call started`);
    } catch (error) {
      console.error("Start call error:", error);
      toast.error("Failed to start call. Check camera/mic permissions.");
      cleanupCall();
    } finally {
      setIsCallConnecting(false);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    setIsCallConnecting(true);
    setCallType(incomingCall.callType);

    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      agoraClientRef.current = client;

      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "video" && remoteVideoRef.current) {
          remoteUser.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack.play();
        }
      });

      client.on("user-left", () => {
        endCall(false);
      });

      if (incomingCall.callType === "video") {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { videoTrack, audioTrack };
      } else {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracksRef.current = { videoTrack: null, audioTrack };
      }

      await client.join(AGORA_APP_ID, incomingCall.channelName, null, user.uid);

      const tracksToPublish = Object.values(localTracksRef.current).filter(Boolean);
      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
      }

      if (incomingCall.callType === "video" && localTracksRef.current.videoTrack && localVideoRef.current) {
        setTimeout(() => {
          if (localVideoRef.current) {
            localTracksRef.current.videoTrack.play(localVideoRef.current);
          }
        }, 300);
      }

      // Update call status
      await setDoc(doc(db, "calls", chatId), { ...incomingCall, status: "active" }, { merge: true });

      setInCall(true);
      setCallDuration(0);
      setIncomingCall(null);
      toast.success("Call connected!");
    } catch (error) {
      console.error("Accept call error:", error);
      toast.error("Failed to join call");
      cleanupCall();
    } finally {
      setIsCallConnecting(false);
    }
  };

  const declineCall = async () => {
    try {
      await deleteDoc(doc(db, "calls", chatId));
    } catch (e) { console.error(e); }
    setIncomingCall(null);
    toast.info("Call declined");
  };

  const endCall = async (silent = false) => {
    cleanupCall();
    setInCall(false);
    setCallType(null);
    setCallDuration(0);
    setCameraOn(true);
    setIsMuted(false);

    try {
      await setDoc(doc(db, "calls", chatId), { status: "ended" }, { merge: true });
      setTimeout(async () => {
        try { await deleteDoc(doc(db, "calls", chatId)); } catch (e) {}
      }, 2000);
    } catch (e) { console.error(e); }

    if (!silent) toast.info("Call ended");
  };

  const toggleMute = () => {
    if (localTracksRef.current.audioTrack) {
      const newState = !isMuted;
      localTracksRef.current.audioTrack.setEnabled(!newState);
      setIsMuted(newState);
    }
  };

  const toggleCamera = () => {
    if (localTracksRef.current.videoTrack) {
      const newState = !cameraOn;
      localTracksRef.current.videoTrack.setEnabled(newState);
      setCameraOn(newState);
    }
  };

  const formatCallDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        senderId: user.uid,
        text: text,
        timestamp: { seconds: Date.now() / 1000 },
      }]);
    }
  };

  const handleBuyNow = () => {
    if (!user) { toast.error("Please login first"); navigate("/"); return; }
    if (!productData) return;
    addToCart(productData);
    toast.success("Added to cart!");
    navigate("/payment");
  };

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login first"); navigate("/"); return; }
    if (!productData) return;
    addToCart(productData);
    toast.success("Added to cart!");
  };

  const sendFaqAsMessage = (faqItem) => {
    if (!user) return;
    const text = `❓ ${faqItem.q}\n\n${faqItem.a}`;
    const messagesRef = collection(db, "chats", chatId, "messages");
    addDoc(messagesRef, {
      senderId: user.uid,
      senderName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
      text: text,
      timestamp: serverTimestamp(),
    }).catch(console.error);
    setShowFaq(false);
    toast.success("FAQ sent to chat");
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
      {/* INCOMING CALL OVERLAY */}
      {incomingCall && !inCall && (
        <div className="call-incoming-overlay">
          <div className="call-incoming-card">
            <div className="call-incoming-pulse"></div>
            <div className="call-incoming-avatar">
              {incomingCall.callerName?.charAt(0) || "?"}
            </div>
            <h3>{incomingCall.callerName || "Someone"}</h3>
            <p className="call-incoming-type">
              Incoming {incomingCall.callType === "video" ? "Video" : "Audio"} Call...
            </p>
            <div className="call-incoming-actions">
              <button className="call-decline-btn" onClick={declineCall}>
                <PhoneOff size={24} />
              </button>
              <button className="call-accept-btn" onClick={acceptCall}>
                <Phone size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-CALL OVERLAY */}
      {(inCall || isCallConnecting) && (
        <div className="call-overlay">
          <div className="call-overlay-bg"></div>
          <div className="call-content">
            {callType === "video" ? (
              <div className="call-video-grid">
                <div className="call-remote-video" ref={remoteVideoRef}>
                  <div className="call-remote-placeholder">
                    <div className="call-avatar-lg">
                      {sellerData?.name?.charAt(0) || "S"}
                    </div>
                    <p>Waiting for connection...</p>
                  </div>
                </div>
                <div className="call-local-video" ref={localVideoRef}></div>
              </div>
            ) : (
              <div className="call-audio-view">
                <div className="call-audio-waves">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div className="call-avatar-lg">
                  {sellerData?.name?.charAt(0) || "S"}
                </div>
                <h3>{sellerData?.name || "Seller"}</h3>
                <p className="call-status-text">
                  {isCallConnecting ? "Connecting..." : "On call"}
                </p>
              </div>
            )}

            <div className="call-info-bar">
              <span className="call-timer">{formatCallDuration(callDuration)}</span>
            </div>

            <div className="call-controls">
              <button
                className={`call-ctrl-btn ${isMuted ? "active-danger" : ""}`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>

              <button className="call-ctrl-btn end-call" onClick={() => endCall(false)}>
                <PhoneOff size={26} />
                <span>End</span>
              </button>

              {callType === "video" && (
                <button
                  className={`call-ctrl-btn ${!cameraOn ? "active-danger" : ""}`}
                  onClick={toggleCamera}
                >
                  {cameraOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
                  <span>{cameraOn ? "Cam Off" : "Cam On"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

        {/* SIDEBAR FAQ */}
        <div className="chat-sidebar-faq">
          <div className="chat-sidebar-faq-header" onClick={() => setShowFaq(!showFaq)}>
            <HelpCircle size={18} />
            <span>Frequently Asked Questions</span>
            {showFaq ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {showFaq && (
            <div className="chat-sidebar-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="chat-faq-item">
                  <div
                    className="chat-faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    {expandedFaq === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                  {expandedFaq === i && (
                    <div className="chat-faq-answer">
                      <p>{item.a}</p>
                      <button className="faq-send-btn" onClick={() => sendFaqAsMessage(item)}>
                        <Send size={12} /> Send to Chat
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
            <button
              className="chat-action-btn"
              onClick={() => startCall("audio")}
              title="Audio Call"
              disabled={inCall || isCallConnecting}
            >
              <Phone size={20} />
            </button>
            <button
              className="chat-action-btn"
              onClick={() => startCall("video")}
              title="Video Call"
              disabled={inCall || isCallConnecting}
            >
              <Video size={20} />
            </button>
            <button
              className="chat-action-btn"
              onClick={() => setShowFaq(!showFaq)}
              title="FAQ"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* PRODUCT PREVIEW WITH BUY */}
        {productData && (
          <div className="chat-product-preview-enhanced">
            <img src={productData.image} alt="" />
            <div className="chat-product-info">
              <h4>{productData.title}</h4>
              <p className="chat-product-price">₹{productData.price}</p>
            </div>
            <div className="chat-product-actions">
              <button className="chat-add-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={16} />
              </button>
              <button className="chat-buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: 10 }} />
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
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                <span className="chat-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* FAQ PANEL (MOBILE / INLINE) */}
        {showFaq && (
          <div className="chat-faq-panel">
            <div className="chat-faq-panel-header">
              <HelpCircle size={20} />
              <h4>Frequently Asked Questions</h4>
              <button onClick={() => setShowFaq(false)}><X size={18} /></button>
            </div>
            <div className="chat-faq-panel-list">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="chat-faq-item">
                  <div
                    className="chat-faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    {expandedFaq === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                  {expandedFaq === i && (
                    <div className="chat-faq-answer">
                      <p>{item.a}</p>
                      <button className="faq-send-btn" onClick={() => sendFaqAsMessage(item)}>
                        <Send size={12} /> Send to Chat
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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