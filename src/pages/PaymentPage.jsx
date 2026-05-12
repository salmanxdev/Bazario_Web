import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const { cartItems, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setIsProcessing(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Payment gateway failed to load");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_SeeglKzlUwB5rp",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Bazario",
      description: `Order - ${cartItems.length} items`,
      handler: async function (response) {
        try {
          const order = await placeOrder({
            totalAmount: totalPrice,
            paymentId: response.razorpay_payment_id,
            shippingAddress: "Default Address",
          });
          if (order) {
            toast.success("Payment successful! Order placed.");
            navigate("/orders");
          } else {
            toast.error("Order failed. Please try again.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Order processing failed");
        }
        setIsProcessing(false);
      },
      prefill: {
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#6c5ce7" },
      modal: {
        ondismiss: function () { setIsProcessing(false); },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error("Payment failed: " + response.error.description);
      setIsProcessing(false);
    });
    rzp.open();
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="payment-content">
          {/* ORDER SUMMARY */}
          <div className="payment-summary">
            <h2>Order Summary</h2>
            <div className="payment-items">
              {cartItems.map((item) => (
                <div key={item.id} className="payment-item">
                  <img src={item.image} alt={item.title} />
                  <div className="payment-item-info">
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="payment-item-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="payment-breakdown">
              <div className="payment-row">
                <span>Subtotal</span><span>₹{totalPrice}</span>
              </div>
              <div className="payment-row">
                <span>Delivery</span><span className="free-tag">FREE</span>
              </div>
              <div className="payment-row total">
                <span>Total</span><span>₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* PAY BUTTON */}
          <div className="payment-action">
            <div className="secure-badge">
              <ShieldCheck size={16} /> Secure Payment via Razorpay
            </div>
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing || cartItems.length === 0}
            >
              <CreditCard size={20} />
              {isProcessing ? "Processing..." : `Pay ₹${totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
