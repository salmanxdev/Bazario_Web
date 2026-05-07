import loginPageImg from '../assets/loginPageImg.png'


const AuthLayout = ({ children }) => {
  return (
    <div className="page">
      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="left-section">
          {children}
        </div>

        {/* RIGHT SIDE */}

        <div className="right-section">
          <img
            src = {loginPageImg}
            alt="auth"
          />
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;