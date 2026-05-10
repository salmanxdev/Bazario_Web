import { Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import AdminDashboard from "../pages/AdminDashboard";

import HomePage from "../pages/HomePages";
import CategoryPage from "../pages/CategoryPage";
import FilterPage from "../pages/FilterPages";

import MainLayout from "../layout/MainLayout";

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