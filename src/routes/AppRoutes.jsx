import { Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {

    return (

        <Routes>

            <Route
                path="/"
                element={<LoginForm />}
            />

            <Route
                path="/register"
                element={<RegisterForm />}
            />

            <Route
                path="/admin"
                element={<AdminDashboard />}
            />

        </Routes>
    );
};

export default AppRoutes;