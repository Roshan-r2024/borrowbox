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

const getPasswordChecks = (password) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

const getPasswordStrength = (password) => {
  const checks = getPasswordChecks(password);
  const score = Object.values(checks).filter(Boolean).length;
  if (!password) return { label: "", score: 0 };
  if (score <= 2) return { label: "Weak", score };
  if (score <= 4) return { label: "Medium", score };
  return { label: "Strong", score };
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = getPasswordChecks(formData.password);
  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (message) setMessage("");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (message) setMessage("");
  };

  const suggestStrongPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
    const random = (length) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const password = `Borrow@${random(10)}9`;
    setFormData((previous) => ({ ...previous, password, confirmPassword: password }));
    setMessage("");
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
      setMessage("Please fill all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setMessage("Please enter a valid email address.");
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

    const checks = getPasswordChecks(password);
    if (!Object.values(checks).every(Boolean)) {
      setMessage("Please use a strong password: 8+ characters with uppercase, lowercase, number and special character.");
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="signup-grid">
            <div className="signup-field signup-field-full">
              <label htmlFor="name">Full Name <span className="required-mark">*</span></label>
              <input id="name" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="name" />
            </div>

            <div className="signup-field">
              <label htmlFor="phone">Phone Number <span className="required-mark">*</span></label>
              <input id="phone" type="tel" name="phone" inputMode="numeric" maxLength="10" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="tel" />
            </div>

            <div className="signup-field">
              <label htmlFor="gender">Gender <span className="required-mark">*</span></label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} onInput={handleInput} disabled={loading}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="email">Email ID <span className="required-mark">*</span></label>
              <input id="email" type="email" name="email" placeholder="Enter a valid email address" value={formData.email} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="email" />
              <p className="field-hint">Any valid email address can be used. No nickname is required.</p>
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="address">Address <span className="required-mark">*</span></label>
              <textarea id="address" name="address" rows="3" placeholder="Enter your complete address" value={formData.address} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="street-address" />
            </div>

            <div className="signup-field">
              <label htmlFor="pincode">Pincode <span className="required-mark">*</span></label>
              <input id="pincode" type="text" name="pincode" inputMode="numeric" maxLength="6" placeholder="6-digit pincode" value={formData.pincode} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="postal-code" />
            </div>

            <div className="signup-field">
              <label htmlFor="state">State <span className="required-mark">*</span></label>
              <input id="state" type="text" name="state" placeholder="Enter your state" value={formData.state} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="address-level1" />
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="password">Create Password <span className="required-mark">*</span></label>
              <div className="password-input-wrap">
                <input id="password" type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} onInput={handleInput} disabled={loading} autoComplete="new-password" />
                <button type="button" className="suggest-password" onClick={suggestStrongPassword} disabled={loading}>Suggest strong password</button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className={`strength-label ${passwordStrength.label.toLowerCase()}`}>
                    Password strength: <strong>{passwordStrength.label}</strong>
                  </div>
                  <div className="strength-rules">
                    <span className={passwordChecks.length ? "valid" : ""}>✓ 8+ characters</span>
                    <span className={passwordChecks.upper ? "valid" : ""}>✓ Uppercase</span>
                    <span className={passwordChecks.lower ? "valid" : ""}>✓ Lowercase</span>
                    <span className={passwordChecks.number ? "valid" : ""}>✓ Number</span>
                    <span className={passwordChecks.special ? "valid" : ""}>✓ Special character</span>
                  </div>
                </div>
              )}
            </div>

            <div className="signup-field signup-field-full">
              <label htmlFor="confirmPassword">Confirm Password <span className="required-mark">*</span></label>
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
