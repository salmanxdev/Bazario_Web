import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load likes from Firestore when user logs in
  useEffect(() => {
    if (user && user.email) {
      loadLikesFromDatabase();
    } else {
      setLikedProducts([]);
    }
  }, [user]);

  const loadLikesFromDatabase = async () => {
    try {
      setLoading(true);
      // For now, we'll use email as the key since we're not using Firebase Auth properly
      // In production, use user.uid from Firebase Auth
      const userRef = doc(db, "users", user.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setLikedProducts(data.likes || []);
      } else {
        setLikedProducts([]);
      }
    } catch (error) {
      console.error("Error loading likes:", error);
      setLikedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (product) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const isLiked = likedProducts.some((item) => item.id === product.id);
      let updatedLikes;

      if (isLiked) {
        // Remove from likes
        updatedLikes = likedProducts.filter((item) => item.id !== product.id);
      } else {
        // Add to likes
        updatedLikes = [...likedProducts, product];
      }

      setLikedProducts(updatedLikes);

      // Save to Firestore
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        likes: updatedLikes,
      }).catch(async (error) => {
        if (error.code === "not-found") {
          // Document doesn't exist, create it
          await setDoc(userRef, {
            email: user.email,
            likes: updatedLikes,
          });
        } else {
          throw error;
        }
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const isLiked = (productId) => {
    return likedProducts.some((item) => item.id === productId);
  };

  const getLikedCount = () => {
    return likedProducts.length;
  };

  return (
    <LikesContext.Provider
      value={{
        likedProducts,
        toggleLike,
        isLiked,
        getLikedCount,
        loading,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  return useContext(LikesContext);
};
