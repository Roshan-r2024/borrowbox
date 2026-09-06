import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import Toast from "./Toast";

const API_URL = "http://localhost:5000";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nickname: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const handleChange = (e) => setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");

    const nickname = formData.nickname.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!nickname || !email || !password || !confirmPassword) {
      setToast({ message: "Please fill all fields.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    if (!email.endsWith("@vit.ac.in") && !email.endsWith("@vitstudent.ac.in")) {
      setToast({ message: "Please use a VIT college email ending with @vit.ac.in or @vitstudent.ac.in", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setToast({ message: data.message || "Unable to create account.", type: "error" });
        return;
      }

      localStorage.setItem("borrowBoxEmail", email);
      navigate("/login", {
        replace: true,
        state: {
          signupSuccess: true,
          email,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      setToast({ message: "Unable to connect to the Borrow Box server. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
      <div className="signup-box">
        <div className="signup-logo"><span className="logo-symbol">◇</span><span>Borrow Box</span></div>
        <h1>Create Account</h1>
        <p className="signup-subtitle">Join your campus marketplace</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nickname">Nickname</label>
          <div className="signup-input-wrapper"><span className="signup-input-icon">👤</span><input id="nickname" type="text" name="nickname" placeholder="Enter your nickname" value={formData.nickname} onChange={handleChange} disabled={loading} autoComplete="nickname" /></div>

          <label htmlFor="email">College Email ID</label>
          <div className="signup-input-wrapper"><span className="signup-input-icon">@</span><input id="email" type="email" name="email" placeholder="yourname@vit.ac.in" value={formData.email} onChange={handleChange} disabled={loading} autoComplete="email" /></div>
          <small className="email-hint">Only @vit.ac.in or @vitstudent.ac.in</small>

          <label htmlFor="password">Password</label>
          <div className="signup-input-wrapper"><span className="signup-input-icon">🔒</span><input id="password" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} disabled={loading} autoComplete="new-password" /></div>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="signup-input-wrapper"><span className="signup-input-icon">✓</span><input id="confirmPassword" type="password" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} autoComplete="new-password" /></div>

          {message && <p className="signup-message">{message}</p>}

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? <><span className="signup-spinner"></span>Creating Account...</> : <>Create Account <span>→</span></>}
          </button>
        </form>

        <p className="login-text">Already have an account? <button type="button" className="login-link" disabled={loading} onClick={() => navigate("/login")}>Sign In</button></p>
      </div>
    </div>
  );
}

export default SignUp;
