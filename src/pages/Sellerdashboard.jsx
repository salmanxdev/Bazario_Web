import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  LayoutDashboard,
  PlusCircle,
  Store,
  Video,
  Package,
  ShoppingBag,
  TrendingUp,
  ArrowLeft,
  LogOut,
} from "lucide-react";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    totalOrders: 0,
  });
  const [myProducts, setMyProducts] = useState([]);
  const [myShops, setMyShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);

      // Fetch seller's products
      const productsRef = collection(db, "products");
      const productsQ = query(productsRef, where("sellerId", "==", user.uid));
      const productsSnap = await getDocs(productsQ);
      const products = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyProducts(products);

      // Fetch seller's shops
      const shopsRef = collection(db, "shops");
      const shopsQ = query(shopsRef, where("sellerId", "==", user.uid));
      const shopsSnap = await getDocs(shopsQ);
      const shops = shopsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyShops(shops);

      setStats({
        totalProducts: products.length,
        totalShops: shops.length,
        totalOrders: 0,
      });
    } catch (error) {
      console.error("Error fetching seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "add-product", label: "Add Product", icon: <PlusCircle size={20} /> },
    { id: "add-shop", label: "Add Shop", icon: <Store size={20} /> },
    { id: "go-live", label: "Go Live", icon: <Video size={20} /> },
  ];

  return (
    <div className="seller-dashboard">
      {/* SIDEBAR */}
      <div className="seller-sidebar">
        <div className="seller-sidebar-header">
          <button className="back-btn-seller" onClick={() => navigate("/home")}>
            <ArrowLeft size={18} />
          </button>
          <h2>Seller Panel</h2>
        </div>

        <div className="seller-profile-mini">
          <div className="seller-avatar">
            {user?.firstName?.charAt(0) || "S"}
          </div>
          <div>
            <p className="seller-name-mini">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="seller-role-tag">Seller</span>
          </div>
        </div>

        <nav className="seller-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`seller-nav-item ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => {
                if (tab.id === "add-product") {
                  navigate("/seller/add-product");
                } else if (tab.id === "add-shop") {
                  navigate("/add-shop");
                } else if (tab.id === "go-live") {
                  navigate("/live");
                } else {
                  setActiveTab(tab.id);
                }
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <button className="seller-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="seller-main">
        {activeTab === "dashboard" && (
          <div className="seller-dashboard-content">
            <h1>Welcome, {user?.firstName || "Seller"}!</h1>
            <p className="seller-subtitle">Here's your store overview</p>

            {/* STATS CARDS */}
            <div className="seller-stats-grid">
              <div className="seller-stat-card purple-grad">
                <div className="stat-card-icon">
                  <Package size={28} />
                </div>
                <div className="stat-card-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Products</p>
                </div>
              </div>

              <div className="seller-stat-card blue-grad">
                <div className="stat-card-icon">
                  <Store size={28} />
                </div>
                <div className="stat-card-info">
                  <h3>{stats.totalShops}</h3>
                  <p>Shops</p>
                </div>
              </div>

              <div className="seller-stat-card green-grad">
                <div className="stat-card-icon">
                  <ShoppingBag size={28} />
                </div>
                <div className="stat-card-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Orders</p>
                </div>
              </div>

              <div className="seller-stat-card orange-grad">
                <div className="stat-card-icon">
                  <TrendingUp size={28} />
                </div>
                <div className="stat-card-info">
                  <h3>₹0</h3>
                  <p>Revenue</p>
                </div>
              </div>
            </div>

            {/* MY PRODUCTS */}
            <div className="seller-section">
              <div className="seller-section-header">
                <h2>My Products</h2>
                <button
                  className="add-new-btn"
                  onClick={() => navigate("/seller/add-product")}
                >
                  <PlusCircle size={16} /> Add New
                </button>
              </div>

              {loading ? (
                <p className="loading-text">Loading...</p>
              ) : myProducts.length === 0 ? (
                <div className="empty-section">
                  <Package size={48} />
                  <p>No products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="seller-products-grid">
                  {myProducts.map((product) => (
                    <div key={product.id} className="seller-product-card">
                      <img src={product.image} alt={product.title} />
                      <div className="seller-product-info">
                        <h4>{product.title}</h4>
                        <p className="seller-product-price">
                          ₹{product.price}
                        </p>
                        <span className="seller-product-category">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MY SHOPS */}
            <div className="seller-section">
              <div className="seller-section-header">
                <h2>My Shops</h2>
                <button
                  className="add-new-btn"
                  onClick={() => navigate("/add-shop")}
                >
                  <Store size={16} /> Add Shop
                </button>
              </div>

              {loading ? (
                <p className="loading-text">Loading...</p>
              ) : myShops.length === 0 ? (
                <div className="empty-section">
                  <Store size={48} />
                  <p>No shops yet. Register your first shop!</p>
                </div>
              ) : (
                <div className="seller-shops-grid">
                  {myShops.map((shop) => (
                    <div key={shop.id} className="seller-shop-card">
                      <img src={shop.shop_image} alt={shop.shop_name} />
                      <div className="seller-shop-info">
                        <h4>{shop.shop_name}</h4>
                        <p>{shop.location}</p>
                        <button
                          className="edit-shop-btn"
                          onClick={() =>
                            navigate("/add-shop", {
                              state: { editShop: shop },
                            })
                          }
                        >
                          Edit Shop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;