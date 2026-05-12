import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { toast } from "react-toastify";
import LOGO from "../assets/LOGO.png";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain at least 8 characters, one alphabet, one number and one special character"
      );
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        photoURL: "",
        walletBalance: 0,
        createdAt: new Date(),
      });

      toast.success("Registration Successful");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "buyer",
      });

      if (formData.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h1 className="logo">
          <img src={LOGO} alt="" />
        </h1>

        <div className="grid-2">
          <div className="input-group">
            <label>
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>
              Last Name <span className="required">*</span>
            </label>
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
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>
            Phone <span className="required">*</span>
          </label>
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
            <label>
              Password <span className="required">*</span>
            </label>
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

        <div className="input-group">
          <label>
            Select Role
            <span className="required">*</span>
          </label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "REGISTERING..." : "REGISTER"}
        </button>

        <p className="bottom-link">
          Already have account ?
          <Link to="/"> Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;