import LOGO from "../assets/LOGO.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    return (

        <div className="navbar">

            {/* LOGO */}

            <img
                src={LOGO}
                alt=""
                className="nav-logo"
            />

            {/* SEARCH */}

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search Products..."
                    className="search-input"
                />

            </div>

            {/* NAV ACTIONS */}

            <div className="nav-actions">

                {/* FILTER */}

                <button className="filter-btn" onClick={() => navigate("/filter")}>


                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"><path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" /></svg>
                    Filter

                </button>

                {/* LIKED */}

                <button className="liked-btn">

                    ❤️ Liked

                </button>

                {/* CART */}

                <button onClick={() => navigate("/cart")} className="cart-btn ">

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                    Cart

                </button>

                {/* LOGIN */}

                <button onClick={() =>
                    navigate("/")
                } className="login-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                    Log In
                </button>

            </div>

        </div>
    );
};

export default Navbar;