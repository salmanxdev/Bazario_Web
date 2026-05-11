import { Star, Heart } from "lucide-react";

import { useState } from "react";

import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {

    const { addToCart } = useCart();

    const [liked, setLiked] = useState(false);

    return (

        <div className="product-card">

            {/* LIKE BUTTON */}


            <button
                className="like-btn"
                onClick={() =>
                    setLiked(!liked)
                }
            >

                <Heart
                    size={18}
                    strokeWidth={2}
                    color="black"
                    fill={
                        liked
                            ? "#ff2e63"
                            : "transparent"
                    }
                />

            </button>
            {/* IMAGE */}

            <img
                src={product.image}
                alt=""
            />

            {/* DETAILS */}

            <div className="pc-details">

                <span>

                    {/* TITLE */}

                    <h3>

                        {product.title}

                    </h3>

                    {/* PRICE + RATING */}

                    <p>

                        ₹ {product.price}

                        <span className="product-rating">

                            <Star
                                size={14}
                                fill="gold"
                                color="gold"
                            />

                            {product.rating}

                        </span>

                    </p>

                </span>

                {/* ADD TO CART */}
                <button
                    className="add-to-cart"
                    onClick={(e) => {

                        e.target.classList.add("cart-click");

                        setTimeout(() => {

                            e.target.classList.remove("cart-click");

                        }, 300);

                        addToCart(product);
                    }}
                >

                    Add To Cart

                </button>

            </div>

        </div>
    );
};

export default ProductCard;