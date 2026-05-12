import { useState, useEffect } from "react";

import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  Info,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ChatPage = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useAuth();

  const productData = location.state?.product;

  const sellerData = location.state?.seller;

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "seller",
      text: "Hello 👋",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "seller",
      text: "This product is available.",
      time: "10:31 AM",
    },
  ]);

  useEffect(() => {

    if (productData) {

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "seller",
          text: `You are asking about ${productData.title}`,
          time: "Now",
        },
      ]);

    }

  }, []);

  const handleSend = () => {

    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "customer",
      text: input,
      time: "Now",
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    setTimeout(() => {

      const reply = {
        id: Date.now() + 1,
        sender: "seller",
        text: "Thanks for messaging. I'll reply soon.",
        time: "Now",
      };

      setMessages((prev) => [...prev, reply]);

    }, 1000);
  };

  if (!user) {

    navigate("/");

    return null;

  }

  return (

    <div className="w-full h-screen bg-black flex">

      {/* SIDEBAR */}

      <div className="hidden md:flex w-[350px] border-r border-zinc-800 bg-black flex-col">

        <div className="h-[80px] border-b border-zinc-800 flex items-center px-6">

          <h1 className="text-white text-2xl font-bold">
            bazario
          </h1>

        </div>

        <div className="flex-1 overflow-y-auto">

          <div className="p-4 hover:bg-zinc-900 cursor-pointer transition">

            <div className="flex items-center gap-3">

              <img
                src={productData?.image}
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>

                <h2 className="text-white font-semibold">
                  {sellerData?.name || "Seller"}
                </h2>

                <p className="text-zinc-400 text-sm">
                  {productData?.title}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col bg-black">

        {/* HEADER */}

        <div className="h-[80px] border-b border-zinc-800 px-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(-1)}
              className="text-white md:hidden"
            >
              <ArrowLeft size={24} />
            </button>

            <img
              src={productData?.image}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>

              <h2 className="text-white font-semibold">
                {sellerData?.name || "Seller"}
              </h2>

              <p className="text-zinc-400 text-sm">
                Active now
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 text-white">

            <Phone size={22} />

            <Video size={22} />

            <Info size={22} />

          </div>

        </div>

        {/* PRODUCT PREVIEW */}

        <div className="border-b border-zinc-800 p-4 flex items-center gap-4 bg-zinc-950">

          <img
            src={productData?.image}
            alt=""
            className="w-20 h-20 rounded-xl object-cover"
          />

          <div>

            <h2 className="text-white font-semibold">
              {productData?.title}
            </h2>

            <p className="text-green-500 font-bold">
              ₹{productData?.price}
            </p>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "customer"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[75%] px-4 py-3 rounded-3xl text-sm ${
                  msg.sender === "customer"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-zinc-800 text-white rounded-bl-md"
                }`}
              >

                <p>{msg.text}</p>

                <span className="text-[11px] opacity-70 block mt-1">
                  {msg.time}
                </span>

              </div>

            </div>

          ))}

        </div>

        {/* INPUT */}

        <div className="p-4 border-t border-zinc-800 bg-black">

          <div className="flex items-center bg-zinc-900 rounded-full px-4 py-2">

            <input
              type="text"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
              className="
              flex-1
              bg-transparent
              outline-none
              text-white
              placeholder:text-zinc-500
              "
            />

            <button
              onClick={handleSend}
              className="text-blue-500"
            >
              <Send size={22} />
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ChatPage;