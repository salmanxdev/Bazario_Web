import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import LOGO from '../assets/LOGO.png'

const RegisterForm = () => {
    const { register } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // PHONE VALIDATION
        if (name === "phone") {

            // ONLY NUMBERS
            if (!/^\d*$/.test(value)) {

                toast.error("Only numbers are allowed");

                return;
            }
        }



        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        // EMPTY FIELD VALIDATION

        if (!formData.firstName.trim()) {
            toast.error("First Name is required");
            return;
        }

        if (!formData.lastName.trim()) {

            toast.error("Last Name is required");

            return;
        }

        if (!formData.email.trim()) {

            toast.error("Email is required");

            return;
        }

        if (!formData.phone.trim()) {

            toast.error("Phone Number is required");

            return;
        }

        if (!formData.password.trim()) {

            toast.error("Password is required");

            return;
        }

        // PHONE VALIDATION

        if (formData.phone.length !== 10) {

            toast.error("Phone number must be 10 digits");

            return;
        }

        // PASSWORD VALIDATION

        const passwordRegex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

        if (!passwordRegex.test(formData.password)) {

            toast.error(
                "Password must contain at least 8 characters, one alphabet, one number and one special character"
            );

            return;
        }

        // REGISTER USER

        register(formData);

        toast.success("Registration Successful");

        // CLEAR FORM

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
        });
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit}>
                <h1 className="logo"><img src={LOGO} alt="" /></h1>

                <div className="grid-2">
                    <div className="input-group">
                        <label>First Name <span className="required">*</span> </label>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Last Name <span className="required">*</span> </label>

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Email <span className="required">*</span> </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Phone <span className="required">*</span> </label>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        minLength={10}

                    />
                </div>

                <div className="password-box">
                    <div className="input-group">
                        <label>Password <span className="required">*</span> </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
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

                <button type="submit">REGISTER</button>

                <p className="bottom-link">
                    Already have account ? <Link to="/">Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterForm;