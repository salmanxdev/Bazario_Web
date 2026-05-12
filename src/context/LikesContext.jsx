import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) { loadLikes(); }
    else { setLikedProducts([]); }
  }, [user]);

  const getUserRef = () => doc(db, "userData", user.uid);

  const loadLikes = async () => {
    try {
      setLoading(true);
      const snap = await getDoc(getUserRef());
      setLikedProducts(snap.exists() ? snap.data().likes || [] : []);
    } catch (e) { console.error("Likes load error:", e); setLikedProducts([]); }
    finally { setLoading(false); }
  };

  const toggleLike = async (product) => {
    if (!user) { alert("Please login first"); return; }
    try {
      const liked = likedProducts.some((i) => i.id === product.id);
      const updated = liked
        ? likedProducts.filter((i) => i.id !== product.id)
        : [...likedProducts, product];
      setLikedProducts(updated);
      const ref = getUserRef();
      await updateDoc(ref, { likes: updated }).catch(async (err) => {
        if (err.code === "not-found") {
          await setDoc(ref, { uid: user.uid, likes: updated });
        } else throw err;
      });
    } catch (e) { console.error("Like toggle error:", e); }
  };

  const isLiked = (productId) => likedProducts.some((i) => i.id === productId);
  const getLikedCount = () => likedProducts.length;

  return (
    <LikesContext.Provider value={{ likedProducts, toggleLike, isLiked, getLikedCount, loading }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);
