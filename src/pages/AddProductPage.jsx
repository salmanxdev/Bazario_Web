import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Upload, Package, Loader2, Film } from "lucide-react";
import { showToast } from "../utils/toast";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

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
    "vegetable",
    "fruit",
    "medical",
    "furniture",
    "kirana"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showToast.error("Video size should be less than 20MB");
      return;
    }

    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      showToast.error("Authentication error. Please login again.");
      return;
    }

    if (!formData.title.trim() || !formData.price || !formData.category) {
      showToast.error("Please fill in all required fields");
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast.error("Please enter a valid price");
      return;
    }

    if (!imageFile) {
      showToast.error("Please upload a product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `products/${user.uid}/images/${Date.now()}_${imageFile.name}`
      );

      const uploadResult = await uploadBytes(imageRef, imageFile);
      const imageURL = await getDownloadURL(uploadResult.ref);

      // 2. Upload video to Firebase Storage if exists
      let videoURL = "";
      if (videoFile) {
        const videoRef = ref(
          storage,
          `products/${user.uid}/videos/${Date.now()}_${videoFile.name}`
        );
        const videoUploadResult = await uploadBytes(videoRef, videoFile);
        videoURL = await getDownloadURL(videoUploadResult.ref);
      }

      const sellerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Seller";

      // 3. Save product to Firestore
      const productData = {
        title: formData.title.trim(),
        price: priceNum,
        category: formData.category,
        description: (formData.description || "").trim(),
        image: imageURL,
        video: videoURL,
        rating: 0,
        sellerId: user.uid,
        sellerName: sellerName,
        seller: {
          name: sellerName,
          email: user.email || "",
          phone: user.phone || "",
          verified: true,
          rating: 4.5,
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), productData);

      showToast.success("Product added successfully!");
      navigate("/seller");
    } catch (error) {
      console.error("Detailed error adding product:", error);
      showToast.error(`Unable to add product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="add-product-page">
        <div className="access-denied" style={{ textAlign: "center", padding: "100px 20px" }}>
          <Package size={80} color="#ccc" style={{ marginBottom: "20px" }} />
          <h2>Seller Access Required</h2>
          <p>Only sellers can add products</p>
          <button className="continue-btn" onClick={() => navigate("/home")} style={{ marginTop: "20px" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page" style={{ padding: "40px 20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="add-product-container" style={{ maxWidth: "700px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <div className="add-product-header" style={{ textAlign: "center", marginBottom: "30px" }}>
          <button className="back-btn" onClick={() => navigate("/seller")} style={{ position: "absolute", left: "20px", top: "20px", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Package size={28} color="#6c5ce7" />
            Add New Product
          </h1>
          <p style={{ color: "#666" }}>List your product on Bazario</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
            <div className="image-upload-section">
              <label htmlFor="productImage" style={{ width: "100%", height: "200px", border: "2px dashed #ddd", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#fcfcfc" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div className="upload-placeholder" style={{ textAlign: "center", color: "#888" }}>
                    <Upload size={40} style={{ marginBottom: "10px" }} />
                    <p>Product Image *</p>
                    <span style={{ fontSize: "12px" }}>JPG, PNG up to 5MB</span>
                  </div>
                )}
                <input type="file" id="productImage" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>

            <div className="video-upload-section">
              <label htmlFor="productVideo" style={{ width: "100%", height: "200px", border: "2px dashed #ddd", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#fcfcfc" }}>
                {videoPreview ? (
                  <video src={videoPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} controls onClick={(e) => e.preventDefault()} />
                ) : (
                  <div className="upload-placeholder" style={{ textAlign: "center", color: "#888" }}>
                    <Film size={40} style={{ marginBottom: "10px" }} />
                    <p>Product Video (Optional)</p>
                    <span style={{ fontSize: "12px" }}>MP4 up to 20MB</span>
                  </div>
                )}
                <input type="file" id="productVideo" accept="video/*" onChange={handleVideoChange} hidden />
              </label>
            </div>
          </div>

          <div className="form-fields" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label htmlFor="title" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Product Title *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter product title" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
            </div>

            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label htmlFor="price" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Price (₹) *</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="1" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
              </div>

              <div className="form-group">
                <label htmlFor="category" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Category *</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", background: "white" }}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your product..." rows="4" style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", resize: "vertical" }} />
            </div>

            <button type="submit" className="submit-product-btn" disabled={isSubmitting} style={{ background: "#6c5ce7", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.3s", marginTop: "10px" }}>
              {isSubmitting ? <><Loader2 className="animate-spin" /> Publishing...</> : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
