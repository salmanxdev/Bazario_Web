import { X, Heart, Star, MessageCircle, Share2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLikes } from "../context/LikesContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showToast } from "../utils/toast";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useLikes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) { showToast.error("Please login first"); navigate("/"); return; }
    for (let i = 0; i < quantity; i++) { addToCart(product); }
    showToast.success(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  const handleLike = () => {
    if (!user) { showToast.error("Please login first"); navigate("/"); return; }
    toggleLike(product);
    if (isLiked(product.id)) { showToast.info("Removed from wishlist"); }
    else { showToast.success("Added to wishlist!"); }
  };

  const handleChat = () => {
    if (!user) { showToast.error("Please login first"); navigate("/"); return; }
    onClose();
    navigate("/chat", { state: { product, seller: product.seller } });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Bazario - ₹${product.price}`,
        url: window.location.href,
      });
    } catch (e) {
      navigator.clipboard.writeText(`${product.title} - ₹${product.price} on Bazario`);
      showToast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        <div className="modal-content">
          <div className="modal-image-section">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="modal-details-section">
            <h2 className="modal-title">{product.title}</h2>
            {product.seller && (
              <div className="seller-section">
                <p className="seller-label">Sold by</p>
                <p className="seller-name">
                  {product.seller.name || product.sellerName}
                  {product.seller.verified && <span className="verified-badge">✓</span>}
                </p>
                {product.seller.rating > 0 && <p className="seller-rating">⭐ {product.seller.rating}</p>}
              </div>
            )}
            <div className="modal-rating">
              <Star size={18} fill="gold" color="gold" />
              <span>{product.rating || "New"}</span>
            </div>
            <div className="modal-price"><span className="price">₹ {product.price}</span></div>
            <div className="modal-description">
              <p>{product.description || "High-quality product with excellent features."}</p>
            </div>
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <div className="modal-actions">
              <button className={`modal-like-btn ${isLiked(product.id) ? "liked" : ""}`} onClick={handleLike}>
                <Heart size={24} fill={isLiked(product.id) ? "white" : "transparent"} color={isLiked(product.id) ? "white" : "black"} />
              </button>
              <button className="modal-cart-btn" onClick={handleAddToCart}>Add To Cart</button>
              <button className="modal-chat-btn" onClick={handleChat} title="Chat with seller">
                <MessageCircle size={20} />
              </button>
              <button className="modal-share-btn" onClick={handleShare} title="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
