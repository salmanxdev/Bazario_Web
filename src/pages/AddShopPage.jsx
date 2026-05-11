import { useState } from "react";
import { Store, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const AddShopPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: "",
    shopCategory: "",
    description: "",
    email: "",
    phone: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Check if user is a seller
  const isSeller = user && user.role === "seller";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.shopName ||
      !formData.shopCategory ||
      !formData.email ||
      !formData.phone
    ) {
      showToast.error("Please fill in all required fields!");
      return;
    }

    console.log("Shop submission:", formData);
    setSubmitted(true);
    showToast.success("Shop registration submitted successfully!");

    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="add-shop-page">
        <div className="access-denied">
          <Store size={80} />
          <h2>Authentication Required</h2>
          <p>Please log in to register a shop</p>
          <button 
            className="continue-btn"
            onClick={() => navigate("/")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If user is not a seller
  if (!isSeller) {
    return (
      <div className="add-shop-page">
        <div className="access-denied">
          <Store size={80} />
          <h2>Seller Access Required</h2>
          <p>This feature is available only for sellers. Switch to seller mode to register your shop.</p>
          <div className="access-actions">
            <button 
              className="continue-btn"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
            <p className="info-text">Contact support to upgrade your account to a seller account</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="add-shop-page">
        <div className="success-container">
          <div className="success-card">
            <Store size={64} className="success-icon" />
            <h2>Shop Registration Submitted!</h2>
            <p>Thank you for registering your shop.</p>
            <p>We'll review your information and get back to you soon.</p>
            <button 
              className="continue-btn"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-shop-page">
      <div className="add-shop-container">
        <div className="shop-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1>
            <Store size={28} />
            Add Your Shop
          </h1>
          <p>Start selling on Bazario today</p>
        </div>

        <form onSubmit={handleSubmit} className="shop-form">
          <div className="form-group">
            <label htmlFor="shopName">Shop Name *</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter your shop name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="shopCategory">Category *</label>
            <select
              id="shopCategory"
              name="shopCategory"
              value={formData.shopCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-decor">Home Decor</option>
              <option value="sports">Sports</option>
              <option value="beauty-care">Beauty Care</option>
              <option value="jewelry">Jewelry</option>
              <option value="toys-games">Toys & Games</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your shop"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Shop Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your shop address"
              rows="3"
            />
          </div>

          <div className="form-upload">
            <label htmlFor="shopImage">Shop Logo</label>
            <div className="upload-area">
              <Upload size={32} />
              <p>Drag and drop your logo or click to select</p>
              <input
                type="file"
                id="shopImage"
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Register Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShopPage;
