import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const API_URL = "http://localhost:5000";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nickname: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = e => setFormData(previous => ({ ...previous, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault(); if (loading) return; setMessage("");
    const nickname = formData.nickname.trim(); const email = formData.email.trim().toLowerCase();
    const password = formData.password; const confirmPassword = formData.confirmPassword;
    if (!nickname || !email || !password || !confirmPassword) return setMessage("Please fill all fields.");
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    if (!email.endsWith("@vitstudent.ac.in")) return setMessage("Only registered VIT student email IDs ending with @vitstudent.ac.in are allowed.");
    setLoading(true);
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname, email, password }), signal: controller.signal });
      clearTimeout(timeout); let data = {}; try { data = await response.json(); } catch {}
      if (!response.ok) { setMessage(data.message || "Unable to create account."); setLoading(false); return; }
      localStorage.setItem("borrowBoxEmail", email);
      navigate("/login", { replace: true, state: { signupSuccess: "Account created successfully. Please sign in.", email } });
    } catch (error) {
      clearTimeout(timeout); console.error("Signup error:", error);
      setMessage(error.name === "AbortError" ? "Server is taking too long to respond. Please check the backend." : "Cannot connect to Borrow Box server. Make sure the backend is running."); setLoading(false);
    }
  };
  return <div className="signup-page"><div className="signup-box">
    <div className="signup-logo"><span className="logo-symbol">◇</span><span>Borrow Box</span></div>
    <h1>Create Account</h1><p className="signup-subtitle">Join your campus marketplace</p>
    <form onSubmit={handleSubmit}>
      <label htmlFor="nickname">Nickname</label><div className="signup-input-wrapper"><span className="signup-input-icon">👤</span><input id="nickname" type="text" name="nickname" placeholder="Enter your nickname" value={formData.nickname} onChange={handleChange} disabled={loading} autoComplete="nickname" /></div>
      <label htmlFor="email">VIT Student Email ID</label><div className="signup-input-wrapper"><span className="signup-input-icon">@</span><input id="email" type="email" name="email" placeholder="yourname@vitstudent.ac.in" value={formData.email} onChange={handleChange} disabled={loading} autoComplete="email" /></div>
      <small className="email-hint">Only @vitstudent.ac.in registered accounts are allowed.</small>
      <label htmlFor="password">Password</label><div className="signup-input-wrapper"><span className="signup-input-icon">🔒</span><input id="password" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} disabled={loading} autoComplete="new-password" /></div>
      <label htmlFor="confirmPassword">Confirm Password</label><div className="signup-input-wrapper"><span className="signup-input-icon">✓</span><input id="confirmPassword" type="password" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} autoComplete="new-password" /></div>
      {message && <p className="signup-message">{message}</p>}
      <button type="submit" className="signup-submit" disabled={loading}>{loading ? <> <span className="signup-spinner"></span>Creating Account...</> : <>Create Account<span>→</span></>}</button>
    </form>
    <p className="login-text">Already have an account? <button type="button" className="login-link" disabled={loading} onClick={() => navigate("/login")}>Sign In</button></p>
  </div></div>;
}
export default SignUp;
