import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import headset from '../assets/headset.jpg'
import products from "../utils/products";

const HomePage = () => {

    return (

        <div className="home-page">

            <div className="home-container">

                {/* NAVBAR */}

                <Navbar />

                {/* SIDEBAR */}

                <Sidebar />

                {/* MAIN CONTENT */}

                <div className="home-content">

                    {/* BANNERS */}

                    <div className="banner-section">
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>
                        <div className="banner-card">
                            <div className="banner-content">
                                <p>50% OFF ON</p>
                                <h2>HEADPHONES</h2>
                            </div>
                            <img
                                src={headset}
                                alt=""
                            />
                        </div>

                    </div>
                    
                    {/* DYNAMIC CONTENT */}

                    <Outlet />

                    {/* DEFAULT PRODUCTS */}

                    <div className="products-grid">

                        {products.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default HomePage;