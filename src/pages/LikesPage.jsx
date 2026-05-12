import { useLikes } from "../context/LikesContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { showToast } from "../utils/toast";

const LikesPage = () => {
  const { likedProducts } = useLikes();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      showToast.error("Please login first");
      navigate("/");
      return;
    }
    addToCart(product);
    showToast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="likes-page">
      <div className="likes-container">
        <div className="likes-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>
            <Heart size={28} className="heart-icon" />
            Liked Products ({likedProducts.length})
          </h1>
        </div>

        {likedProducts.length === 0 ? (
          <div className="empty-likes">
            <Heart size={64} />
            <h2>No Liked Products Yet</h2>
            <p>Start adding products to your likes!</p>
            <button 
              className="continue-btn"
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="likes-grid">
            {likedProducts.map((product) => (
              <div key={product.id} className="like-card">
                <div className="like-image-container">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="like-image"
                  />
                  <span className="like-badge">
                    <Heart size={16} fill="red" stroke="red" />
                  </span>
                </div>
                
                <div className="like-content">
                  <h3>{product.title}</h3>
                  <p className="like-category">{product.category}</p>
                  
                  <div className="like-rating">
                    <span className="stars">⭐ {product.rating}</span>
                  </div>

                  <div className="like-footer">
                    <span className="like-price">₹{product.price}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikesPage;
