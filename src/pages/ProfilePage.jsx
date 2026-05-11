// ProfilePage.jsx

import "./ProfilePage.css";

import LOGO from "../assets/LOGO.png";

import {
    X,
    Settings,
    ChevronRight,
    ShoppingBag,
    Heart,
    Ticket,
    Wallet,
    Package,
    MapPin,
    CreditCard,
    RotateCcw,
    MessageCircle,
    Headphones,
    BadgePercent,
    ShieldCheck,
} from "lucide-react";

const ProfilePage = () => {

    const menuItems = [
        {
            icon: <Package size={22} />,
            title: "Your Orders",
            subtitle: "Track, return or reorder items",
        },

        {
            icon: <Heart size={22} />,
            title: "Wishlist",
            subtitle: "View items you have saved",
        },

        {
            icon: <MapPin size={22} />,
            title: "Addresses",
            subtitle: "Manage your delivery addresses",
        },

        {
            icon: <CreditCard size={22} />,
            title: "Payments",
            subtitle: "View saved cards and payment methods",
        },

        {
            icon: <BadgePercent size={22} />,
            title: "Coupons & Offers",
            subtitle: "View available coupons and offers",
        },

        {
            icon: <RotateCcw size={22} />,
            title: "Returns & Refunds",
            subtitle: "Track return and refund status",
        },

        {
            icon: <MessageCircle size={22} />,
            title: "Messages",
            subtitle: "View your conversations",
        },

        {
            icon: <Headphones size={22} />,
            title: "Help & Support",
            subtitle: "Get help and contact support",
        },

        {
            icon: <Settings size={22} />,
            title: "Settings",
            subtitle: "Manage app preferences",
        },
    ];

    return (

        <div className="profile-page">

            {/* TOPBAR */}

            <div className="profile-topbar">

                <button className="icon-btn">
                    <X size={30} />
                </button>

                <img src={LOGO} alt="Bazario Logo" className="logo" />

                <button className="icon-btn">
                    <Settings size={30} />
                </button>

            </div>

            {/* PROFILE CARD */}

            <div className="profile-card">

                <div className="profile-header">

                    <img
                        src="https://i.pravatar.cc/150?img=12"
                        alt="profile"
                        className="profile-image"
                    />

                    <div className="profile-info">

                        <h2>Rohan Verma</h2>

                        <p>rohan.verma@email.com</p>

                        <div className="verified-badge">

                            <ShieldCheck size={16} />

                            Verified Buyer

                        </div>

                    </div>

                    <ChevronRight className="arrow-icon" />

                </div>

                {/* STATS */}

                <div className="stats-grid">

                    <div className="stat-box">

                        <div className="stat-icon purple">
                            <ShoppingBag size={20} />
                        </div>

                        <h3>12</h3>

                        <p>Orders</p>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon pink">
                            <Heart size={20} />
                        </div>

                        <h3>8</h3>

                        <p>Wishlist</p>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon orange">
                            <Ticket size={20} />
                        </div>

                        <h3>5</h3>

                        <p>Coupons</p>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon green">
                            <Wallet size={20} />
                        </div>

                        <h3>₹1,250</h3>

                        <p>Wallet</p>

                    </div>

                </div>

            </div>

            {/* MENU */}

            <div className="menu-section">

                <h3 className="section-title">
                    My Account
                </h3>

                {
                    menuItems.map((item, index) => (

                        <div className="menu-item" key={index}>

                            <div className="menu-left">

                                <div className="menu-icon">
                                    {item.icon}
                                </div>

                                <div>

                                    <h4>{item.title}</h4>

                                    <p>{item.subtitle}</p>

                                </div>

                            </div>

                            <ChevronRight size={22} />

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default ProfilePage;