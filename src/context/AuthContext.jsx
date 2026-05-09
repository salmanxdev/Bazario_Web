import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // LOGIN

  const login = (data) => {

    console.log("Login Data:", data);

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

      return adminUser;
    }

    // NORMAL USER

    const normalUser = {
      email: data.email,
      role: "user",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(normalUser)
    );

    setUser(normalUser);

    return normalUser;
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