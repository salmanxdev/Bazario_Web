import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page-content">
      {/* PINTEREST MASONRY GRID */}

      {loading ? (
        <div className="masonry-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-home">
          <div className="empty-icon">🛍️</div>
          <h2>No Products Yet</h2>
          <p>Be the first seller to post products on Bazario!</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;