import { useState } from "react";
import ProductModal from "./ProductModal";

const ProductCard = ({ product }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {/* PINTEREST STYLE GRID - IMAGE ONLY */}
            <div 
                className="product-card-grid"
                onClick={() => setShowModal(true)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setShowModal(true);
                }}
            >
                <img
                    src={product.image}
                    alt={product.title}
                    className="grid-image"
                />
            </div>

            {/* MODAL - OPENS ON CLICK/LONG PRESS/CONTEXT MENU */}
            {showModal && (
                <ProductModal product={product} onClose={() => setShowModal(false)} />
            )}
        </>
    );
};

export default ProductCard;