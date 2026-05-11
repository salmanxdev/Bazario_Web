import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // LOGIN

  const login = (data) => {

    console.log("Login Data:", data);

    // GET REGISTERED USER

    const storedUser = JSON.parse(
      localStorage.getItem("registeredUser")
    );

    // IF NO USER EXISTS

    if (!storedUser) {

      return {
        success: false,
        message: "No account found",
      };
    }

    // ADMIN LOGIN

    if (
      data.email === "admin@gmail.com" &&
      data.password === "Admin@123"
    ) {

      const adminUser = {
        email: data.email,
        role: "admin",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(adminUser)
      );

      setUser(adminUser);

      return {
        success: true,
        role: "admin",
      };
    }

    // BUYER / SELLER LOGIN

    if (
      data.email === storedUser.email &&
      data.password === storedUser.password
    ) {

      const loggedInUser = {
        email: data.email,
        role: storedUser.role,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        phone: storedUser.phone,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      return {
        success: true,
        role: storedUser.role,
      };
    }

    // INVALID LOGIN

    return {
      success: false,
      message: "Invalid Email or Password",
    };
  };

  // REGISTER

  const register = (data) => {

    console.log("Register Data:", data);

    localStorage.setItem(
      "registeredUser",
      JSON.stringify(data)
    );

    // Set user in context
    const newUser = {
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  return useContext(AuthContext);
};