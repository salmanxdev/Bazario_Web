import LOGO from "../assets/LOGO.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, MessageCircle, Video, Store, Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import { useLikes } from "../context/LikesContext";

const Navbar = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { getLikedCount } = useLikes();

    return (

        <div className="navbar">

            {/* LOGO */}

            <img
                src={LOGO}
                alt=""
                className="nav-logo"
                onClick={() => navigate("/home")}
                style={{ cursor: "pointer" }}
            />

            {/* SEARCH */}

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search Products..."
                    className="search-input"
                />

            </div>

            {/* MAIN NAVIGATION */}

            <div className="nav-main-menu">

                <button 
                    className="nav-menu-item"
                    onClick={() => navigate("/home")}
                    title="Home"
                >
                    <Home size={20} />
                    <span>Home</span>
                </button>

                <button 
                    className="nav-menu-item"
                    onClick={() => navigate("/chat")}
                    title="Chat Support"
                >
                    <MessageCircle size={20} />
                    <span>Chat</span>
                </button>

                <button 
                    className="nav-menu-item"
                    onClick={() => navigate("/live")}
                    title="Live Shopping"
                >
                    <Video size={20} />
                    <span>Live</span>
                </button>

                <button 
                    className="nav-menu-item"
                    onClick={() => navigate("/shops")}
                    title="Browse Shops"
                >
                    <ShoppingBag size={20} />
                    <span>Shops</span>
                </button>

                <button 
                    className="nav-menu-item"
                    onClick={() => navigate("/add-shop")}
                    title="Add Shop"
                >
                    <Store size={20} />
                    <span>Sell</span>
                </button>

            </div>

            {/* NAV ACTIONS */}

            <div className="nav-actions">

                {/* FILTER */}

                <button className="filter-btn" onClick={() => navigate("/filter")}>


                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" /></svg>
                    Filter

                </button>

                {/* LIKED */}

                <button 
                    className="liked-btn"
                    onClick={() => navigate("/likes")}
                    title="Liked Products"
                >
                    <Heart size={20} />
                    Liked
                    {getLikedCount() > 0 && (
                        <span className="badge">{getLikedCount()}</span>
                    )}
                </button>

                {/* CART */}

                <button onClick={() => navigate("/cart")} className="cart-btn ">

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                    Cart

                </button>

                {/* LOGIN / PROFILE */}

                {user ? (
                    <button onClick={() =>
                        navigate("/profile")
                    } className="profile-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-circle"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                        Profile
                    </button>
                ) : (
                    <button onClick={() =>
                        navigate("/")
                    } className="login-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                        Log In
                    </button>
                )}

            </div>

        </div>
    );
};

export default Navbar;