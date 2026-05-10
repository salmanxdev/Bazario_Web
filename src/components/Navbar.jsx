import LOGO from "../assets/LOGO.png";

const Navbar = () => {

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

                <button className="filter-btn">

                    Filter

                </button>

                {/* LIKED */}

                <button className="liked-btn">

                    ❤️ Liked

                </button>

                {/* CART */}

                <button className="cart-btn ">

                    Cart

                </button>

                {/* LOGIN */}

                <button className="login-btn">
                    Log In
                </button>

            </div>

        </div>
    );
};

export default Navbar;