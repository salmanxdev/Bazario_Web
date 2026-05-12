import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  return (
    <div className="cart-page">
      {/* HEADER */}
      <div className="cart-header">
        <div className="cart-header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Shopping Cart</h1>
            <p className="cart-count">{cartItems.length} items</p>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon"><ShoppingBag size={60} /></div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button className="shop-now-btn" onClick={() => navigate("/home")}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-content">
          {/* ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p className="cart-item-price">₹{item.price}</p>
                  <div className="cart-qty">
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <button className="cart-remove-btn" onClick={() => {
                  removeFromCart(item.id);
                  showToast.info(`${item.title} removed`);
                }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row"><span>Items</span><span>{cartItems.length}</span></div>
              <div className="summary-row"><span>Delivery</span><span className="free-text">FREE</span></div>
              <div className="summary-row total"><span>Total</span><span>₹{totalPrice}</span></div>
            </div>
            <button className="checkout-btn" onClick={() => navigate("/payment")}>
              Proceed To Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;