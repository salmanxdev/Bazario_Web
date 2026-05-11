import { Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import AdminDashboard from "../pages/AdminDashboard";

import HomePage from "../pages/HomePages";
import CategoryPage from "../pages/CategoryPage";
import FilterPage from "../pages/FilterPages";
import ProfilePage from "../pages/ProfilePage";
import LikesPage from "../pages/LikesPage";
import ChatPage from "../pages/ChatPage";
import LivePage from "../pages/LivePage";
import AddShopPage from "../pages/AddShopPage";
import ShopsPage from "../pages/ShopsPage";

import MainLayout from "../layout/MainLayout";
import SellerDashboard from "../pages/Sellerdashboard";
import CartPage from "../pages/CartPage";

const AppRoutes = () => {

    return (

        <Routes>

            {/* AUTH */}

            <Route
                path="/"
                element={<LoginForm />}
            />

            <Route
                path="/register"
                element={<RegisterForm />}
            />

            {/* ADMIN */}

            <Route
                path="/admin"
                element={<AdminDashboard />}
            />

            <Route
                path="/seller"
                element={<SellerDashboard />}
            />

            <Route
                path="/cart"
                element={<CartPage />}
            />

            <Route
                path="/profile"
                element={<ProfilePage />}
            />

            {/* MAIN LAYOUT */}

            <Route
                element={<MainLayout />}
            >

                <Route
                    path="/home"
                    element={<HomePage />}
                />

                <Route
                    path="/filter"
                    element={<FilterPage />}
                />

                <Route
                    path="/category/:categoryName"
                    element={<CategoryPage />}
                />

                <Route
                    path="/likes"
                    element={<LikesPage />}
                />

                <Route
                    path="/chat"
                    element={<ChatPage />}
                />

                <Route
                    path="/live"
                    element={<LivePage />}
                />

                <Route
                    path="/add-shop"
                    element={<AddShopPage />}
                />

                <Route
                    path="/shops"
                    element={<ShopsPage />}
                />

            </Route>

        </Routes>
    );
};

export default AppRoutes;