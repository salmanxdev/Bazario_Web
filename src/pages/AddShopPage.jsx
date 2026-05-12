import { useState, useEffect } from "react";
import { Store, Upload, ArrowLeft, Edit3, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc, updateDoc, doc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const editShop = location.state?.editShop || null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(editShop?.shop_image || null);
  const [imageFile, setImageFile] = useState(null);
  const [myShops, setMyShops] = useState([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);

  const [formData, setFormData] = useState({
    shopName: editShop?.shop_name || "",
    location: editShop?.location || "",
    description: editShop?.description || "",
    email: editShop?.email || "",
    phone: editShop?.phone || "",
    address: editShop?.address || "",
    categories: editShop?.categories?.join(", ") || "",
    trusted_seller: editShop?.trusted_seller || false,
    fast_delivery: editShop?.fast_delivery || false,
  });

  useEffect(() => {
    if (user?.uid) fetchMyShops();
  }, [user]);

  const fetchMyShops = async () => {
    setIsLoadingShops(true);
    try {
      const q = query(collection(db, "shops"), where("sellerId", "==", user.uid));
      const snap = await getDocs(q);
      setMyShops(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Error fetching shops:", e);
    } finally {
      setIsLoadingShops(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      showToast.error("Please login to continue");
      return;
    }

    if (!formData.shopName.trim() || !formData.location.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast.error("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      let shopImageURL = imagePreview;

      if (imageFile) {
        const imageRef = ref(storage, `shops/${user.uid}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        shopImageURL = await getDownloadURL(uploadResult.ref);
      }

      if (!shopImageURL) {
        showToast.error("Please upload a shop image");
        setIsSubmitting(false);
        return;
      }

      const cats = formData.categories.split(",").map((c) => c.trim().toLowerCase()).filter((c) => c);

      const shopData = {
        shop_name: formData.shopName.trim(),
        location: formData.location.trim(),
        description: (formData.description || "").trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: (formData.address || "").trim(),
        categories: cats,
        shop_image: shopImageURL,
        verified: editShop?.verified || false,
        trusted_seller: !!formData.trusted_seller,
        fast_delivery: !!formData.fast_delivery,
        rating: editShop?.rating || 4.5,
        reviews: editShop?.reviews || 0,
        sellerId: user.uid,
        sellerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Seller",
        updatedAt: serverTimestamp()
      };

      if (editShop) {
        await updateDoc(doc(db, "shops", editShop.id), shopData);
        showToast.success("Shop updated successfully!");
      } else {
        shopData.createdAt = serverTimestamp();
        await addDoc(collection(db, "shops"), shopData);
        showToast.success("Shop registered successfully!");
      }
      navigate("/seller");
    } catch (error) {
      console.error("Error saving shop:", error);
      showToast.error(`Unable to add shop: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <div className="add-shop-page">
      <div className="access-denied" style={{ textAlign: 'center', padding: '100px' }}>
        <Store size={80} color="#ccc" />
        <h2>Login Required</h2>
        <button className="continue-btn" onClick={() => navigate("/")} style={{ marginTop: '20px' }}>Go to Login</button>
      </div>
    </div>
  );

  if (user.role !== "seller") return (
    <div className="add-shop-page">
      <div className="access-denied" style={{ textAlign: 'center', padding: '100px' }}>
        <Store size={80} color="#ccc" />
        <h2>Seller Access Required</h2>
        <button className="continue-btn" onClick={() => navigate("/home")} style={{ marginTop: '20px' }}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="add-shop-page" style={{ padding: "40px 20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="add-shop-container" style={{ maxWidth: "700px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <div className="shop-header" style={{ textAlign: "center", marginBottom: "30px", position: "relative" }}>
          <button className="back-btn" onClick={() => navigate("/seller")} style={{ position: "absolute", left: "0", top: "0", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Store size={28} color="#6c5ce7" />
            {editShop ? "Edit Shop" : "Add Your Shop"}
          </h1>
          <p style={{ color: "#666" }}>{editShop ? "Update your shop details" : "Start selling on Bazario today"}</p>
        </div>

        {!editShop && myShops.length > 0 && (
          <div className="existing-shops-section" style={{ marginBottom: "30px", padding: "15px", background: "#f9f9f9", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "15px", color: "#333" }}>Your Registered Shops</h3>
            <div className="existing-shops-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {myShops.map((shop) => (
                <div key={shop.id} className="existing-shop-item" style={{ display: "flex", align_items: "center", gap: "15px", background: "white", padding: "10px", borderRadius: "8px", border: "1px solid #eee" }}>
                  <img src={shop.shop_image || "https://via.placeholder.com/50"} alt={shop.shop_name} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "14px" }}>{shop.shop_name}</h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{shop.location}</p>
                  </div>
                  <button onClick={() => navigate("/add-shop", { state: { editShop: shop } })} style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", background: "#f0f2f5", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="shop-form" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-upload">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shop Logo/Image</label>
            <div className="upload-area" onClick={() => document.getElementById("shopImage").click()} style={{ width: "100%", height: "200px", border: "2px dashed #ddd", borderRadius: "12px", display: "flex", flex_direction: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#fcfcfc" }}>
              {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <><Upload size={32} color="#888" /><p style={{ color: "#888", marginTop: "10px" }}>Click to upload image</p></>}
              <input type="file" id="shopImage" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shop Name *</label>
            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Enter shop name" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Area" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Categories (comma-separated, e.g., Vegetable, Fruit, Kirana)</label>
            <input type="text" name="categories" value={formData.categories} onChange={handleChange} placeholder="Vegetable, Fruit, Kirana, Furniture, Medical" style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell customers about your shop" rows="3" style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", resize: "vertical" }} />
          </div>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Contact email" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact phone" required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px" }} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Full Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Complete shop address" rows="2" style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", resize: "vertical" }} />
          </div>

          <div className="form-checkboxes" style={{ display: "flex", gap: "20px", margin: "10px 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
              <input type="checkbox" name="trusted_seller" checked={formData.trusted_seller} onChange={handleChange} />
              <span>Trusted Seller</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
              <input type="checkbox" name="fast_delivery" checked={formData.fast_delivery} onChange={handleChange} />
              <span>Fast Delivery</span>
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ background: "#6c5ce7", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.3s", marginTop: "10px" }}>
            {isSubmitting ? <><Loader2 className="animate-spin" /> Saving...</> : editShop ? "Update Shop" : "Register Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShopPage;
