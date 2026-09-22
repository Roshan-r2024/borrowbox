import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const API_URL = "http://localhost:5000";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  gender: "",
  address: "",
  pincode: "",
  state: "",
  password: "",
  confirmPassword: "",
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (message) setMessage("");
  };

  // Also capture browser/password-manager autofill and direct input changes.
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim().toLowerCase();
    const gender = formData.gender;
    const address = formData.address.trim();
    const pincode = formData.pincode.trim();
    const state = formData.state.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !phone || !email || !gender || !address || !pincode || !state || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setMessage("Phone number must contain exactly 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setMessage("Pincode must contain exactly 6 digits.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, gender, address, pincode, state, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      let data = {};
      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        setMessage(data.message || "Unable to create account.");
        setLoading(false);
        return;
      }

      localStorage.setItem("borrowBoxEmail", email);
      navigate("/login", {
        replace: true,
        state: { signupSuccess: "Account created successfully. Please sign in.", email },
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("Signup error:", error);
      setMessage(
        error.name === "AbortError"
          ? "Server is taking too long to respond. Please check the backend."
          : "Cannot connect to Borrow Box server. Make sure the backend is running."
      );
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <div className="signup-logo">
          <span className="logo-symbol">◇</span>
          <span>Borrow Box</span>
        </div>

        <h1>Create Account</h1>
        <p className="signup-subtitle">Create your Borrow Box account and start sharing.</p>

        <form onSubmit={handleSubmit}>
          <div className="signup-grid">
            <div className="signup-field signup-field-full">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="name" />
            </div>

            <div className="signup-field">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" name="phone" inputMode="numeric" maxLength="10" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="tel" />
            </div>

            <div className="signup-field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} onInput={handleInput} disabled={loading}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="email">Email ID</label>
              <input id="email" type="email" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="email" />
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" rows="3" placeholder="Enter your complete address" value={formData.address} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="street-address" />
            </div>

            <div className="signup-field">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" type="text" name="pincode" inputMode="numeric" maxLength="6" placeholder="6-digit pincode" value={formData.pincode} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="postal-code" />
            </div>

            <div className="signup-field">
              <label htmlFor="state">State</label>
              <input id="state" type="text" name="state" placeholder="Enter your state" value={formData.state} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="address-level1" />
            </div>

            <div className="signup-field">
              <label htmlFor="password">Create Password</label>
              <input id="password" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="new-password" />
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="new-password" />
            </div>
          </div>

          {message && <p className="signup-message">{message}</p>}

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="signup-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <p className="login-text">
          Already have an account?
          <button type="button" className="login-link" disabled={loading} onClick={() => navigate("/login")}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
