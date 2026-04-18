import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("priya@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password, role });

      if (user.role === "STUDENT") {
        navigate("/student");
      } else if (user.role === "WARDEN") {
        navigate("/warden");
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .login-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 30% 20%, rgba(123,104,255,0.18), transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(255,111,167,0.14), transparent 25%),
            #05060d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }

        .login-container {
          width: 100%;
          max-width: 460px;
          background: rgba(13, 15, 26, 0.95);
          padding: 40px 30px;
          border-radius: 28px;
          border: 1px solid #1f2234;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          box-sizing: border-box;
        }

        .logo {
          text-align: center;
          font-size: 48px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, #c9beff, #6d5cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tagline {
          text-align: center;
          color: #9a9db3;
          margin: 12px 0 28px;
          font-size: 18px;
        }

        .role-toggle {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }

        .role-card {
          flex: 1;
          background: #161927;
          padding: 22px;
          border-radius: 18px;
          text-align: center;
          cursor: pointer;
          border: 1px solid #2a2d40;
          color: white;
          font-weight: 700;
          font-size: 18px;
          transition: 0.2s ease;
          user-select: none;
        }

        .role-card.active {
          border: 2px solid #6f60ff;
          background: #1b1d30;
          box-shadow: 0 0 0 3px rgba(111,96,255,0.12) inset;
        }

        form label {
          color: #8b8ea4;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        form input {
          width: 100%;
          padding: 16px;
          margin: 0 0 18px;
          border-radius: 14px;
          border: 1px solid #2a2d40;
          background: #141722;
          color: white;
          font-size: 16px;
          box-sizing: border-box;
          outline: none;
        }

        form input:focus {
          border-color: #6f60ff;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: none;
          font-weight: 800;
          font-size: 20px;
          background: linear-gradient(90deg, #7b68ff, #ff6fa7);
          color: white;
          cursor: pointer;
          margin-top: 8px;
        }

        .error {
          color: #ff7f9c;
          font-size: 14px;
          margin: 4px 0 12px;
        }

        .demo-text {
          text-align: center;
          color: #8b8ea4;
          margin-top: 20px;
          font-size: 14px;
        }
      `}</style>

      <div className="login-page">
        <div className="login-container">
          <h1 className="logo">HostelHub</h1>
          <p className="tagline">Your hostel, digitized 🏠</p>

          <div className="role-toggle">
            <div
              className={`role-card ${role === "STUDENT" ? "active" : ""}`}
              onClick={() => setRole("STUDENT")}
            >
              🎓 Student
            </div>

            <div
              className={`role-card ${role === "WARDEN" ? "active" : ""}`}
              onClick={() => setRole("WARDEN")}
            >
              👩‍💼 Warden
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit-btn">
              Sign In →
            </button>
          </form>

          <p className="demo-text">Demo: select role and tap Sign In</p>
        </div>
      </div>
    </>
  );
}