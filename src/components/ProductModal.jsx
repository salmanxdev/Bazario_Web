import { X, Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLikes } from "../context/LikesContext";
import { useState } from "react";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useLikes();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
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
                onClick={() => toggleLike(product)}
              >
                <Heart
                  size={20}
                  fill={isLiked(product.id) ? "#ff2e63" : "transparent"}
                  color={isLiked(product.id) ? "#ff2e63" : "black"}
                />
              </button>

              {/* ADD TO CART */}
              <button className="modal-cart-btn" onClick={handleAddToCart}>
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
