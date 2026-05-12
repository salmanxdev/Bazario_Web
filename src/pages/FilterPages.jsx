import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";

const FilterPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(null);

    const categoriesList = [
        "Electronics", "Clothing", "Sports", "Beauty", "Home Decor", "Toys",
        "Vegetable", "Fruit", "Medical", "Furniture", "Kirana"
    ];

    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            let q = collection(db, "products");
            const querySnapshot = await getDocs(q);
            let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Apply categories filter
            if (selectedCategories.length > 0) {
                results = results.filter(p => selectedCategories.includes(p.category?.toLowerCase()));
            }

            // Apply price filter
            if (priceRange) {
                if (priceRange === "under500") results = results.filter(p => p.price < 500);
                else if (priceRange === "under1000") results = results.filter(p => p.price < 1000);
                else if (priceRange === "under5000") results = results.filter(p => p.price < 5000);
                else if (priceRange === "above10000") results = results.filter(p => p.price > 10000);
            }

            setProducts(results);
        } catch (error) {
            console.error("Error filtering products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredProducts();
    }, []);

    const handleCategoryToggle = (cat) => {
        const lowerCat = cat.toLowerCase();
        setSelectedCategories(prev =>
            prev.includes(lowerCat) ? prev.filter(c => c !== lowerCat) : [...prev, lowerCat]
        );
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setPriceRange(null);
        fetchFilteredProducts();
    };

    return (
        <div className="w-full min-h-screen bg-[#EAEDED] p-5 flex justify-center">
            <div className="w-full flex gap-5 max-w-7xl">
                {/* LEFT FILTER SIDEBAR */}
                <div className="w-[280px] bg-white p-5 rounded-md shadow-sm h-fit sticky top-5">
                    <h1 className="text-2xl font-bold mb-6">Filters</h1>

                    {/* CATEGORY */}
                    <div className="mb-6">
                        <h2 className="font-bold mb-3">Category</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {categoriesList.map(cat => (
                                <label key={cat} className="flex gap-2 cursor-pointer hover:text-purple-600">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.toLowerCase())}
                                        onChange={() => handleCategoryToggle(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PRICE */}
                    <div className="mb-6">
                        <h2 className="font-bold mb-3">Price</h2>
                        <div className="space-y-2">
                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="price" checked={priceRange === "under500"} onChange={() => setPriceRange("under500")} />
                                Under ₹500
                            </label>
                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="price" checked={priceRange === "under1000"} onChange={() => setPriceRange("under1000")} />
                                Under ₹1000
                            </label>
                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="price" checked={priceRange === "under5000"} onChange={() => setPriceRange("under5000")} />
                                Under ₹5000
                            </label>
                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="price" checked={priceRange === "above10000"} onChange={() => setPriceRange("above10000")} />
                                Above ₹10000
                            </label>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={fetchFilteredProducts}
                            className="bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md font-semibold transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 hover:bg-gray-300 py-2 rounded-md transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 bg-white rounded-md p-5 min-h-[500px]">
                    <h1 className="text-2xl font-bold mb-6">
                        {loading ? "Filtering..." : "Filtered Products"}
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl">No products found matching your filters.</p>
                                    <button
                                        onClick={handleReset}
                                        className="mt-4 text-purple-600 hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPage;
