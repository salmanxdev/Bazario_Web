import { Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import AdminDashboard from "../pages/AdminDashboard";

import HomePage from "../pages/HomePages";
import CategoryPage from "../pages/CategoryPage";

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

            {/* HOME LAYOUT */}

            <Route
                path="/home"
                element={<HomePage />}
            >

                {/* CATEGORY ROUTES */}

                <Route
                    path="category/:categoryName"
                    element={<CategoryPage />}
                />

            </Route>

        </Routes>
    );
};

export default AppRoutes;