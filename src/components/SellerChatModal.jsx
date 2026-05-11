import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { showToast } from '../utils/toast';

const SellerChatModal = ({ product, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      text: `Hi! I'm from ${product.seller.name}. How can I help you with this product?`,
      timestamp: new Date(Date.now() - 2 * 60000),
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'customer',
      text: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate seller response
    setTimeout(() => {
      const sellerResponse = {
        id: messages.length + 2,
        sender: 'seller',
        text: 'Thanks for your message! I will get back to you shortly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, sellerResponse]);
      showToast.success('Message sent to seller!');
    }, 500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="seller-chat-modal-overlay" onClick={onClose}>
      <div className="seller-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="seller-chat-header">
          <div className="seller-info">
            <div>
              <h3>{product.seller.name}</h3>
              <p className="product-title">{product.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="seller-chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`seller-message ${msg.sender === 'customer' ? 'customer-msg' : 'seller-msg'}`}
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="seller-chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask seller about this product..."
            className="seller-chat-input"
          />
          <button 
            onClick={handleSendMessage}
            className="seller-send-btn"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerChatModal;
