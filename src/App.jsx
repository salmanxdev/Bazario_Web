import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LoginForm />} />

      <Route path="/register" element={<RegisterForm />} />
    </Routes>

  );
}

export default App;