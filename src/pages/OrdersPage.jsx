import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  ShoppingBag,
} from "lucide-react";

const OrdersPage = () => {
  const { orders } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} className="status-delivered" />;
      case "shipped":
        return <Truck size={16} className="status-shipped" />;
      case "confirmed":
        return <Clock size={16} className="status-confirmed" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status-tag delivered";
      case "shipped":
        return "status-tag shipped";
      case "confirmed":
        return "status-tag confirmed";
      default:
        return "status-tag";
    }
  };

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Your Orders</h1>
          <p>{orders.length} orders placed</p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <div className="empty-orders">
          <ShoppingBag size={80} />
          <h2>No Orders Yet</h2>
          <p>Your orders will appear here after you make a purchase</p>
          <button className="shop-now-btn" onClick={() => navigate("/home")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {[...orders].reverse().map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-card-header">
                <div className="order-number">
                  <Package size={18} />
                  <span>{order.orderNumber || `ORD-${index + 1}`}</span>
                </div>
                <span className={getStatusClass(order.status)}>
                  {getStatusIcon(order.status)}
                  {order.status || "Processing"}
                </span>
              </div>

              <div className="order-items">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <h4>{item.title}</h4>
                      <p>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-meta">
                  <p>
                    <strong>Date:</strong>{" "}
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {order.estimatedDelivery && (
                    <p>
                      <strong>Est. Delivery:</strong> {order.estimatedDelivery}
                    </p>
                  )}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <strong>₹{order.totalAmount || 0}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
