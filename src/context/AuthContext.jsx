import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    console.log("Login Data:", data);

    setUser(data);
  };

  const register = (data) => {
    console.log("Register Data:", data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};