import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Upload, Package } from "lucide-react";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  const categories = [
    "electronics",
    "fashion",
    "home-decor",
    "sports",
    "beauty-care",
    "jewelry",
    "toys-games",
    "clothing",
    "groceries",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `products/${user.uid}/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(imageRef);

      // Save product to Firestore
      await addDoc(collection(db, "products"), {
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        description: formData.description,
        image: imageURL,
        rating: 0,
        sellerId: user.uid,
        sellerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Seller",
        seller: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Seller",
          email: user.email,
          phone: user.phone || "",
          verified: true,
          rating: 4.5,
        },
        createdAt: new Date(),
      });

      toast.success("Product added successfully!");
      navigate("/seller");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="add-product-page">
        <div className="access-denied">
          <Package size={80} />
          <h2>Seller Access Required</h2>
          <p>Only sellers can add products</p>
          <button className="continue-btn" onClick={() => navigate("/home")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <div className="add-product-header">
          <button className="back-btn" onClick={() => navigate("/seller")}>
            <ArrowLeft size={20} />
          </button>
          <h1>
            <Package size={28} />
            Add New Product
          </h1>
          <p>List your product on Bazario</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* IMAGE UPLOAD */}
          <div className="image-upload-section">
            <label className="image-upload-area" htmlFor="productImage">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} />
                  <p>Click to upload product image</p>
                  <span>JPG, PNG up to 5MB</span>
                </div>
              )}
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="submit-product-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
