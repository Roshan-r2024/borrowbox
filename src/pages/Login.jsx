import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || localStorage.getItem("borrowBoxEmail") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.signupSuccess || "");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setMessage("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      let data = {};
      try { data = await response.json(); } catch {}
      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }
      if (data.user) localStorage.setItem("borrowBoxUser", JSON.stringify(data.user));
      localStorage.setItem("borrowBoxEmail", cleanEmail);
      navigate("/home", { replace: true });
    } catch (error) {
      clearTimeout(timeout);
      console.error("Login error:", error);
      setMessage(
        error.name === "AbortError"
          ? "Server is taking too long to respond. Please check the backend."
          : "Cannot connect to Borrow Box server. Make sure the backend is running."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">◇</div>
          <h1>Borrow what you<br /><span>need.</span></h1>
          <p>Borrow Box makes it simple for everyone to discover, borrow, rent and sell useful items in their community.</p>
          <div className="feature-list">
            <div className="feature"><div className="feature-icon">🔍</div><div><strong>Find useful items</strong><small>Discover items shared by the community</small></div></div>
            <div className="feature"><div className="feature-icon">🔄</div><div><strong>Borrow or rent</strong><small>Choose an option that fits your needs</small></div></div>
            <div className="feature"><div className="feature-icon">💰</div><div><strong>Sell your items</strong><small>Turn unused items into value</small></div></div>
          </div>
        </div>
        <div className="brand-footer">Borrow Box • Community sharing made simple.</div>
      </section>

      <section className="auth-form-section">
        <div className="mobile-logo"><div className="brand-logo">◇</div><span>Borrow Box</span></div>
        <div className="login-container">
          <div className="login-heading">
            <span className="welcome-tag">Welcome back</span>
            <h2>Sign in to Borrow Box</h2>
            <p>Enter your details to continue.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" disabled={loading} />
              </div>
            </div>

            <div className="field">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <button type="button" disabled={loading} onClick={() => setMessage("Password reset will be available soon.")}>Forgot password?</button>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">•</span>
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" disabled={loading} />
                <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)} disabled={loading}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>

            {message && <div className="login-message">{message}</div>}

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? <><span className="spinner"></span>Signing in...</> : <>Sign In <span>→</span></>}
            </button>
          </form>

          <div className="signup-text">
            Don't have an account?
            <button type="button" disabled={loading} onClick={() => navigate("/signup")}>Sign up</button>
          </div>
          <div className="security-note">Your account information is securely protected.</div>
        </div>
      </section>
    </div>
  );
}

export default Login;