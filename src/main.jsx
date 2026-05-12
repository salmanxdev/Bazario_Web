import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./new-styles.css";
import "./seller-styles.css";
import "./chat-styles.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import { LikesProvider } from "./context/LikesContext";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <LikesProvider>
          <App />

          {/* TOAST CONTAINER */}

          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="dark"
          />

        </LikesProvider>

      </CartProvider>


    </AuthProvider>
  </BrowserRouter>
);