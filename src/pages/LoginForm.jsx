import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import LOGO from '../assets/LOGO.png'

const LoginForm = () => {
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        login(formData);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit}>
                <h1 className="logo"><img src={LOGO} alt="" /></h1>

                <div className="input-group">
                    <label>Email <span className="required">*</span></label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="password-box">
                    <div className="input-group">
                        <label>Password <span className="required">*</span> </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Your Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <span
                        className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        👁
                    </span>
                </div>

                <div className="login-actions">

                    <button type="submit">
                        LOGIN
                    </button>

                    <p className="forgot-password">
                        Forgot Your Password ?
                    </p>

                </div>

                <p className="bottom-link">
                    Don't have account ? <Link to="/register">Register</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginForm;