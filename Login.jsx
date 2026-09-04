import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://127.0.0.1:5000";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    // Stop the request from hanging forever
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setMessage(
          data.message || "Invalid email or password."
        );
        setLoading(false);
        return;
      }

      // Save logged-in user
      if (data.user) {
        localStorage.setItem(
          "borrowBoxUser",
          JSON.stringify(data.user)
        );
      }

      // Save email for profile
      localStorage.setItem(
        "borrowBoxEmail",
        cleanEmail
      );

      // Login successful → Home
      navigate("/home", {
        replace: true,
      });

    } catch (error) {
      clearTimeout(timeout);

      console.error("Login error:", error);

      if (error.name === "AbortError") {
        setMessage(
          "Server is taking too long to respond. Please check the backend."
        );
      } else {
        setMessage(
          "Cannot connect to Borrow Box server. Make sure the backend is running."
        );
      }

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT BRAND */}

      <section className="auth-brand">

        <div className="brand-content">

          <div className="brand-logo">
            ◇
          </div>

          <h1>
            Borrow what you
            <br />
            <span>need.</span>
          </h1>

          <p>
            Borrow Box makes it simple for students
            to share, borrow and lend useful items
            within the campus community.
          </p>

          <div className="feature-list">

            <div className="feature">

              <div className="feature-icon">
                🔍
              </div>

              <div>
                <strong>
                  Find useful items
                </strong>

                <small>
                  Browse items shared by students
                </small>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                📦
              </div>

              <div>
                <strong>
                  List your items
                </strong>

                <small>
                  Share things you no longer need
                </small>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                🤝
              </div>

              <div>
                <strong>
                  Share with students
                </strong>

                <small>
                  Make campus sharing simple
                </small>
              </div>

            </div>

          </div>

        </div>

        <div className="brand-footer">
          Borrow Box • Campus sharing made simple.
        </div>

      </section>


      {/* RIGHT LOGIN */}

      <section className="auth-form-section">

        <div className="mobile-logo">

          <div className="brand-logo">
            ◇
          </div>

          <span>
            Borrow Box
          </span>

        </div>


        <div className="login-container">

          <div className="login-heading">

            <span className="welcome-tag">
              Welcome back
            </span>

            <h2>
              Sign in to Borrow Box
            </h2>

            <p>
              Enter your details to continue sharing
              with your campus community.
            </p>

          </div>


          {/* GOOGLE */}

          <button
            type="button"
            className="google-button"
            onClick={() =>
              setMessage(
                "Google login will be available soon."
              )
            }
            disabled={loading}
          >
            <span className="google-g">
              G
            </span>

            Continue with Google

          </button>


          {/* DIVIDER */}

          <div className="divider">
            <span>
              OR
            </span>
          </div>


          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="yourname@vit.ac.in"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="field">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setMessage(
                      "Password reset will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  •
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* MESSAGE */}

            {message && (
              <div className="login-message">
                {message}
              </div>
            )}


            {/* SIGN IN */}

            <button
              type="submit"
              className="signin-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* SIGN UP */}

          <div className="signup-text">

            Don't have an account?

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign up
            </button>

          </div>


          {/* SECURITY */}

          <div className="security-note">
            Your account information is securely protected.
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;