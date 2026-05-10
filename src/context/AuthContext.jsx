import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

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

    // NORMAL USER LOGIN

    if (
      data.email === storedUser.email &&
      data.password === storedUser.password
    ) {

      const normalUser = {
        email: data.email,
        role: "user",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(normalUser)
      );

      setUser(normalUser);

      return {
        success: true,
        role: "user",
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