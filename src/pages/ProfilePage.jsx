// ProfilePage.jsx

import "./ProfilePage.css";

import LOGO from "../assets/LOGO.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db, storage } from "../firebase";

import { doc, getDoc, updateDoc } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuth } from "../context/AuthContext";
import { useLikes } from "../context/LikesContext";
import { useCart } from "../context/CartContext";

import {
  ArrowLeft,
  Settings,
  ChevronRight,
  ShoppingBag,
  Heart,
  Wallet,
  Package,
  MessageCircle,
  Headphones,
  ShieldCheck,
  Camera,
  LogOut,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { getLikedCount } = useLikes();
  const { orders } = useCart();
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) return;

        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", currentUser.uid), {
        photoURL: downloadURL,
      });

      setUserData((prev) => ({
        ...prev,
        photoURL: downloadURL,
      }));

      await refreshUser();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.firstName || user?.firstName || "User";

  const menuItems = [
    {
      icon: <Package size={22} />,
      title: "Your Orders",
      subtitle: `${orders?.length || 0} orders placed`,
      action: () => navigate("/orders"),
    },
    {
      icon: <Heart size={22} />,
      title: "Wishlist",
      subtitle: `${getLikedCount()} items saved`,
      action: () => navigate("/likes"),
    },
    {
      icon: <MessageCircle size={22} />,
      title: "Messages",
      subtitle: "View your conversations",
      action: () => navigate("/chat"),
    },
    {
      icon: <Headphones size={22} />,
      title: "Help & Support",
      subtitle: "Get help and contact support",
      action: () => {},
    },
    {
      icon: <Settings size={22} />,
      title: "Settings",
      subtitle: "Manage app preferences",
      action: () => {},
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <img src={LOGO} alt="Bazario Logo" className="logo" />

        <button className="icon-btn" onClick={handleLogout}>
          <LogOut size={24} />
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image-wrapper">
            <img
              src={
                userData?.photoURL ||
                `https://ui-avatars.com/api/?name=${displayName}&background=6c5ce7&color=fff&size=120`
              }
              alt="profile"
              className="profile-image"
            />

            <label className={`upload-btn ${uploading ? "uploading" : ""}`}>
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="profile-info">
            <h2>{displayName}</h2>
            <p>{userData?.email || user?.email || "No Email"}</p>
            <p>{userData?.phone || user?.phone || ""}</p>

            <div className="verified-badge">
              <ShieldCheck size={16} />
              {userData?.role === "seller" ? "Verified Seller" : "Verified Buyer"}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box" onClick={() => navigate("/orders")}>
            <div className="stat-icon purple">
              <ShoppingBag size={20} />
            </div>
            <h3>{orders?.length || 0}</h3>
            <p>Orders</p>
          </div>

          <div className="stat-box" onClick={() => navigate("/likes")}>
            <div className="stat-icon pink">
              <Heart size={20} />
            </div>
            <h3>{getLikedCount()}</h3>
            <p>Wishlist</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon green">
              <Wallet size={20} />
            </div>
            <h3>₹{userData?.walletBalance || 0}</h3>
            <p>Wallet</p>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h3 className="section-title">My Account</h3>

        {menuItems.map((item, index) => (
          <div
            className="menu-item"
            key={index}
            onClick={item.action}
            style={{ cursor: "pointer" }}
          >
            <div className="menu-left">
              <div className="menu-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
            <ChevronRight size={22} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;