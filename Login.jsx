import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import Toast from "./Toast";

const API_URL = "http://127.0.0.1:5000";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || localStorage.getItem("borrowBoxEmail") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setToast({ message: "Account created successfully. Please sign in.", type: "success" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setToast({ message: "Please enter your email and password.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setToast({ message: data.message || "Invalid email or password.", type: "error" });
        return;
      }

      if (data.user) {
        localStorage.setItem("borrowBoxUser", JSON.stringify(data.user));
      }

      localStorage.setItem("borrowBoxEmail", cleanEmail);

      navigate("/home", {
        replace: true,
        state: {
          toast: "Login successful.",
          toastType: "success",
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      setToast({
        message: "Unable to connect to the Borrow Box server. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />

      <section className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">◇</div>
          <h1>Borrow what you<br /><span>need.</span></h1>
          <p>Borrow Box makes it simple for students to share, borrow and lend useful items within the campus community.</p>
        </div>
        <div className="brand-footer">Borrow Box • Campus sharing made simple.</div>
      </section>

      <section className="auth-form-section">
        <div className="mobile-logo"><div className="brand-logo">◇</div><span>Borrow Box</span></div>

        <div className="login-container">
          <div className="login-heading">
            <span className="welcome-tag">Welcome back</span>
            <h2>Sign in to Borrow Box</h2>
            <p>Enter your VIT email and password to continue sharing with your campus community.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input id="email" type="email" placeholder="yourname@vit.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="field">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <button type="button" disabled={loading} onClick={() => setToast({ message: "Password reset will be available soon.", type: "info" })}>Forgot password?</button>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">•</span>
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" disabled={loading} />
                <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)} disabled={loading}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>

            {message && <div className="login-message">{message}</div>}

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? <><span className="spinner"></span>Signing in…</> : <>Sign In <span>→</span></>}
            </button>
          </form>

          <div className="signup-text">Don't have an account? <button type="button" disabled={loading} onClick={() => navigate("/signup")}>Sign up</button></div>
          <div className="security-note">Your account information is securely protected.</div>
        </div>
      </section>
    </div>
  );
}

export default Login;
