// import star from 'lucide-react'
import { Star } from "lucide-react";

const ProductCard = ({ product }) => {

    return (

        <div className="product-card">

            <img
                src={product.image}
                alt=""
            />

            <div className="pc-details">
                <span>
                    <h3>{product.title}</h3>
                    <p>₹ {product.price} <span> {product.rating}⭐  </span></p>
                </span>

                <button className="add-to-cart">
                    Add To Cart
                </button>
            </div>

        </div>
    );
};

export default ProductCard;