import LOGO from "../assets/LOGO.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, MessageCircle, Video, Store, Heart, ShoppingBag } from "lucide-react";
import { useLikes } from "../context/LikesContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLikedCount } = useLikes();
  const isSeller = user?.role === "seller";

  return (
    <div className="navbar">
      <img src={LOGO} alt="Bazario" className="nav-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }} />

      <div className="search-box">
        <input type="text" placeholder="Search Products..." className="search-input" />
      </div>

      <div className="nav-main-menu">
        <button className="nav-menu-item" onClick={() => navigate("/home")} title="Home">
          <Home size={20} /><span>Home</span>
        </button>
        <button className="nav-menu-item" onClick={() => navigate("/chat")} title="Chat">
          <MessageCircle size={20} /><span>Chat</span>
        </button>
        <button className="nav-menu-item" onClick={() => navigate("/live")} title="Live">
          <Video size={20} /><span>Live</span>
        </button>
        <button className="nav-menu-item" onClick={() => navigate("/shops")} title="Shops">
          <ShoppingBag size={20} /><span>Shops</span>
        </button>
        {isSeller && (
          <button className="nav-menu-item" onClick={() => navigate("/seller")} title="Seller Dashboard">
            <Store size={20} /><span>Sell</span>
          </button>
        )}
      </div>

      <div className="nav-actions">
        <button className="liked-btn" onClick={() => navigate("/likes")} title="Wishlist">
          <Heart size={20} /> Liked
          {getLikedCount() > 0 && <span className="badge">{getLikedCount()}</span>}
        </button>

        <button onClick={() => navigate("/cart")} className="cart-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
          Cart
        </button>

        {user ? (
          <button onClick={() => navigate("/profile")} className="profile-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            Profile
          </button>
        ) : (
          <button onClick={() => navigate("/")} className="login-btn">
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;