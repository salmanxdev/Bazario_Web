import { useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import products from "../utils/products";

const CategoryPage = () => {

    const { categoryName } = useParams();

    // FILTER PRODUCTS

    const filteredProducts = products.filter(

        (product) =>

            product.category
                ?.toLowerCase()
                .replace(/\s+/g, "-")

            ===

            categoryName
    );

    return (

        <div className="category-page">

            {/* CATEGORY TITLE */}

            <h1 className="category-title">

                {categoryName
                    .replace("-", " ")
                    .toUpperCase()}

            </h1>

            {/* PRODUCTS */}

            <div className="products-grid">

                {

                    filteredProducts.length > 0

                        ? (

                            filteredProducts.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            ))
                        )

                        : (

                            <p>
                                No Products Found
                            </p>
                        )
                }

            </div>

        </div>
    );
};

export default CategoryPage;