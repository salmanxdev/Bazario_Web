import { Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import AdminDashboard from "../pages/AdminDashboard";

import HomePage from "../pages/HomePages";
import CategoryPage from "../pages/CategoryPage";
import FilterPage from "../pages/FilterPages";
import ProfilePage from "../pages/ProfilePage";

import MainLayout from "../layout/MainLayout";
import SellerDashboard from "../pages/SellerDashboard";
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

            </Route>

        </Routes>
    );
};

export default AppRoutes;