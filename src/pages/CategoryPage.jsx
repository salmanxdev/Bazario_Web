import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("category", "==", categoryName.replace("-", " "))
      );
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
    <div className="category-page">
      {/* CATEGORY TITLE */}
      <h1 className="category-title">
        {categoryName.replace("-", " ").toUpperCase()}
      </h1>

      {/* PRODUCTS */}
      <div className="products-grid">
        {loading ? (
          <div className="skeleton-loader">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No Products Found</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;