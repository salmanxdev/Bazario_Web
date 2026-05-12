import { useState } from "react";
import ProductModal from "./ProductModal";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  // Generate varied heights for Pinterest masonry effect
  const heights = ["250px", "300px", "350px", "280px", "320px", "270px"];
  const randomHeight = heights[product.id?.charCodeAt?.(0) % heights.length] || heights[Math.floor(Math.random() * heights.length)];

  return (
    <>
      {/* PINTEREST STYLE CARD */}
      <div
        className="masonry-card"
        onClick={() => setShowModal(true)}
        style={{ minHeight: randomHeight }}
      >
        <img
          src={product.image}
          alt={product.title}
          className="masonry-image"
          loading="lazy"
        />

        {/* HOVER OVERLAY */}
        <div className="masonry-overlay">
          <div className="masonry-info">
            <h4>{product.title}</h4>
            <p className="masonry-price">₹{product.price}</p>
            {product.sellerName && (
              <p className="masonry-seller">by {product.sellerName}</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL - OPENS ON CLICK */}
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;