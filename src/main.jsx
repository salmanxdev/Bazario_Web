import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>

        <App />

        {/* TOAST CONTAINER */}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark"
        />

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);