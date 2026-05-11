import { X, Heart, Star, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLikes } from "../context/LikesContext";
import { useState } from "react";
import { showToast } from "../utils/toast";
import SellerChatModal from "./SellerChatModal";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useLikes();
  const [quantity, setQuantity] = useState(1);
  const [showSellerChat, setShowSellerChat] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
    setQuantity(1);
  };

  const handleLike = () => {
    toggleLike(product);
    if (isLiked(product.id)) {
      showToast.info(`Removed from likes`);
    } else {
      showToast.success(`Added to likes!`);
    }
  };

  return (
    <>
      <div className="product-modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          {/* CLOSE BUTTON */}
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>

          {/* MODAL CONTENT */}
          <div className="modal-content">
            {/* IMAGE SECTION */}
            <div className="modal-image-section">
              <img src={product.image} alt={product.title} />
            </div>

            {/* DETAILS SECTION */}
            <div className="modal-details-section">
              {/* TITLE */}
              <h2 className="modal-title">{product.title}</h2>

              {/* SELLER INFO */}
              <div className="seller-section">
                <p className="seller-label">Sold by</p>
                <p className="seller-name">
                  {product.seller.name}
                  {product.seller.verified && <span className="verified-badge">✓</span>}
                </p>
                <p className="seller-rating">⭐ {product.seller.rating}</p>
              </div>

              {/* RATING */}
              <div className="modal-rating">
                <Star size={18} fill="gold" color="gold" />
                <span>{product.rating}</span>
              </div>

              {/* PRICE */}
              <div className="modal-price">
                <span className="price">₹ {product.price}</span>
              </div>

              {/* DESCRIPTION */}
              <div className="modal-description">
                <p>
                  {product.description ||
                    "High-quality product with excellent features. Perfect for your needs."}
                </p>
              </div>

              {/* QUANTITY SELECTOR */}
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    −
                  </button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="modal-actions">
                {/* LIKE BUTTON */}
                <button
                  className={`modal-like-btn ${isLiked(product.id) ? "liked" : ""}`}
                  onClick={handleLike}
                  title="Like this product"
                >
                  <Heart
                    size={28}
                    fill={isLiked(product.id) ? "white" : "transparent"}
                    color={isLiked(product.id) ? "white" : "black"}
                  />
                </button>

                {/* ADD TO CART */}
                <button className="modal-cart-btn" onClick={handleAddToCart}>
                  Add To Cart
                </button>

                {/* SELLER CHAT */}
                <button 
                  className="modal-seller-chat-btn"
                  onClick={() => setShowSellerChat(true)}
                  title="Chat with seller"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SELLER CHAT MODAL */}
      {showSellerChat && (
        <SellerChatModal 
          product={product}
          onClose={() => setShowSellerChat(false)}
        />
      )}
    </>
  );
};

export default ProductModal;
