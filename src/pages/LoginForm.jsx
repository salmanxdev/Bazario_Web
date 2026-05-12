import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { toast } from "react-toastify";
import LOGO from "../assets/LOGO.png";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User data not found");
        setIsLoading(false);
        return;
      }

      const userData = userSnap.data();

      if (userData.role === "admin") {
        toast.success("Admin Login Successful");
        navigate("/admin");
      } else if (userData.role === "seller") {
        toast.success("Seller Login Successful");
        navigate("/seller");
      } else {
        toast.success("Login Successful");
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

        <div className="input-group">
          <label>
            Email <span className="required">*</span>
          </label>
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
            <label>
              Password <span className="required">*</span>
            </label>
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
          <p className="forgot-password">Forgot Your Password ?</p>
        </div>

        <p className="bottom-link">
          Don't have account ?
          <Link to="/register"> Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;