import { useState, useEffect } from "react";
import { Store, Upload, ArrowLeft, Edit3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
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
    try {
      const q = query(collection(db, "shops"), where("sellerId", "==", user.uid));
      const snap = await getDocs(q);
      setMyShops(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName || !formData.location || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields!");
      return;
    }
    setIsSubmitting(true);
    try {
      let shopImageURL = editShop?.shop_image || "";
      if (imageFile) {
        const imageRef = ref(storage, `shops/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        shopImageURL = await getDownloadURL(imageRef);
      }
      const cats = formData.categories.split(",").map((c) => c.trim()).filter((c) => c);
      const shopData = {
        shop_name: formData.shopName, location: formData.location,
        description: formData.description, email: formData.email, phone: formData.phone,
        address: formData.address, categories: cats, shop_image: shopImageURL,
        verified: false, trusted_seller: formData.trusted_seller,
        fast_delivery: formData.fast_delivery, rating: editShop?.rating || 0,
        reviews: editShop?.reviews || 0, sellerId: user.uid,
        sellerName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      };
      if (editShop) {
        await updateDoc(doc(db, "shops", editShop.id), shopData);
        toast.success("Shop updated!");
      } else {
        shopData.createdAt = new Date();
        await addDoc(collection(db, "shops"), shopData);
        toast.success("Shop registered!");
      }
      navigate("/seller");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save shop");
    } finally { setIsSubmitting(false); }
  };

  if (!user) return (
    <div className="add-shop-page"><div className="access-denied">
      <Store size={80} /><h2>Login Required</h2>
      <button className="continue-btn" onClick={() => navigate("/")}>Go to Login</button>
    </div></div>
  );

  if (user.role !== "seller") return (
    <div className="add-shop-page"><div className="access-denied">
      <Store size={80} /><h2>Seller Access Required</h2>
      <button className="continue-btn" onClick={() => navigate("/home")}>Back to Home</button>
    </div></div>
  );

  return (
    <div className="add-shop-page">
      <div className="add-shop-container">
        <div className="shop-header">
          <button className="back-btn" onClick={() => navigate("/seller")}><ArrowLeft size={20} /></button>
          <h1><Store size={28} /> {editShop ? "Edit Shop" : "Add Your Shop"}</h1>
          <p>{editShop ? "Update details" : "Start selling on Bazario"}</p>
        </div>

        {!editShop && myShops.length > 0 && (
          <div className="existing-shops-section">
            <h3>Your Shops</h3>
            <div className="existing-shops-list">
              {myShops.map((shop) => (
                <div key={shop.id} className="existing-shop-item">
                  <img src={shop.shop_image} alt={shop.shop_name} />
                  <div><h4>{shop.shop_name}</h4><p>{shop.location}</p></div>
                  <button className="edit-btn-small" onClick={() => navigate("/add-shop", { state: { editShop: shop } })}>
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="shop-form">
          <div className="form-upload">
            <label>Shop Image</label>
            <div className="upload-area" onClick={() => document.getElementById("shopImage").click()}>
              {imagePreview ? <img src={imagePreview} alt="Preview" className="shop-image-preview" /> : <><Upload size={32} /><p>Click to upload</p></>}
              <input type="file" id="shopImage" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </div>
          </div>
          <div className="form-group"><label>Shop Name *</label><input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop name" required /></div>
          <div className="form-group"><label>Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Area" required /></div>
          <div className="form-group"><label>Categories (comma-separated)</label><input type="text" name="categories" value={formData.categories} onChange={handleChange} placeholder="Electronics, Gadgets" /></div>
          <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} placeholder="About your shop" rows="3" /></div>
          <div className="form-row">
            <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><label>Phone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
          </div>
          <div className="form-group"><label>Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" /></div>
          <div className="form-checkboxes">
            <label className="checkbox-label"><input type="checkbox" name="trusted_seller" checked={formData.trusted_seller} onChange={handleChange} /><span>Trusted Seller</span></label>
            <label className="checkbox-label"><input type="checkbox" name="fast_delivery" checked={formData.fast_delivery} onChange={handleChange} /><span>Fast Delivery</span></label>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? "Saving..." : editShop ? "Update Shop" : "Register Shop"}</button>
        </form>
      </div>
    </div>
  );
};

export default AddShopPage;
