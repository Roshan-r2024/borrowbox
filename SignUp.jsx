import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const API_URL = "http://localhost:5000";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    const nickname =
      formData.nickname.trim();

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    // =========================
    // VALIDATION
    // =========================

    if (
      !nickname ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setMessage(
        "Please fill all fields."
      );
      return;
    }


    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }


    if (
      password !== confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }


    if (
      !email.endsWith("@vit.ac.in") &&
      !email.endsWith("@vitstudent.ac.in")
    ) {
      setMessage(
        "Please use a VIT college email ending with @vit.ac.in or @vitstudent.ac.in"
      );
      return;
    }


    // =========================
    // START LOADING
    // =========================

    setLoading(true);


    // Prevent request from hanging
    const controller =
      new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);


    try {

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nickname,
            email,
            password,
          }),

          signal:
            controller.signal,
        }
      );


      clearTimeout(timeout);


      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }


      // =========================
      // SIGNUP FAILED
      // =========================

      if (!response.ok) {

        setMessage(
          data.message ||
          "Unable to create account."
        );

        setLoading(false);

        return;
      }


      // =========================
      // SIGNUP SUCCESS
      // =========================

      localStorage.setItem(
        "borrowBoxEmail",
        email
      );


      /*
        IMPORTANT:

        Signup does NOT directly
        enter Home.

        Signup → Login
      */

      navigate("/login", {
        replace: true,
        state: {
          signupSuccess:
            "Account created successfully. Please sign in.",
          email,
        },
      });


    } catch (error) {

      clearTimeout(timeout);

      console.error(
        "Signup error:",
        error
      );


      if (
        error.name === "AbortError"
      ) {

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
    <div className="signup-page">

      <div className="signup-box">


        {/* LOGO */}

        <div className="signup-logo">

          <span className="logo-symbol">
            ◇
          </span>

          <span>
            Borrow Box
          </span>

        </div>


        {/* HEADING */}

        <h1>
          Create Account
        </h1>

        <p className="signup-subtitle">
          Join your campus marketplace
        </p>


        {/* FORM */}

        <form onSubmit={handleSubmit}>


          {/* NICKNAME */}

          <label htmlFor="nickname">
            Nickname
          </label>

          <div className="signup-input-wrapper">

            <span className="signup-input-icon">
              👤
            </span>

            <input
              id="nickname"
              type="text"
              name="nickname"
              placeholder="Enter your nickname"
              value={formData.nickname}
              onChange={handleChange}
              disabled={loading}
              autoComplete="nickname"
            />

          </div>


          {/* EMAIL */}

          <label htmlFor="email">
            College Email ID
          </label>

          <div className="signup-input-wrapper">

            <span className="signup-input-icon">
              @
            </span>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="yourname@vit.ac.in"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />

          </div>

          <small className="email-hint">
            Only @vit.ac.in or @vitstudent.ac.in
          </small>


          {/* PASSWORD */}

          <label htmlFor="password">
            Password
          </label>

          <div className="signup-input-wrapper">

            <span className="signup-input-icon">
              🔒
            </span>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <div className="signup-input-wrapper">

            <span className="signup-input-icon">
              ✓
            </span>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />

          </div>


          {/* MESSAGE */}

          {message && (
            <p className="signup-message">
              {message}
            </p>
          )}


          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="signup-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}

          </button>

        </form>


        {/* LOGIN */}

        <p className="login-text">

          Already have an account?

          <button
            type="button"
            className="login-link"
            disabled={loading}
            onClick={() =>
              navigate("/login")
            }
          >
            Sign In
          </button>

        </p>

      </div>

    </div>
  );
}

export default SignUp;