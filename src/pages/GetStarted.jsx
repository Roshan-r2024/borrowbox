import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GetStarted.css";

function GetStarted() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const syncTheme = () =>
      setDark(document.documentElement.classList.contains("dark"));

    window.addEventListener("borrowbox-theme-change", syncTheme);
    syncTheme();

    return () => window.removeEventListener("borrowbox-theme-change", syncTheme);
  }, []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("color-theme", next ? "dark" : "light");
    setDark(next);
    window.dispatchEvent(new Event("borrowbox-theme-change"));
  };

  return (
    <div className="get-started-page">
      <header className="gs-navbar">
        <button
          className="gs-brand"
          onClick={() => navigate("/get-started")}
          aria-label="Borrow Box"
        >
          <span className="gs-logo">◇</span>
          <span className="gs-brand-copy">
            <strong>Borrow Box</strong>
            <small>Share. Borrow. Rent. Sell.</small>
          </span>
        </button>

        <nav className="gs-nav-links" aria-label="Get Started navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">Purpose</a>
        </nav>

        <div className="gs-nav-actions">
          <button
            className="gs-theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? "☀" : "☾"}
          </button>
          <button className="gs-login-top" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="gs-signup-top" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </header>

      <main>
        <section className="gs-hero">
          <div className="gs-hero-content">
            <div className="gs-badge">BORROW • RENT • BUY • SHARE</div>
            <h1>
              Everything you need,
              <br />
              <span>just a Borrow away.</span>
            </h1>
            <p>
              Borrow Box is a community marketplace that makes it simple to
              find useful items, share what you own, rent for a while, or sell
              things you no longer need.
            </p>

            <div className="gs-buttons">
              <button className="gs-primary" onClick={() => navigate("/login")}>
                Get Started <span>→</span>
              </button>
              <button
                className="gs-secondary"
                onClick={() => navigate("/signup")}
              >
                Create an Account
              </button>
            </div>

            <div className="gs-trust-row">
              <span>✓ Easy to use</span>
              <span>✓ Community sharing</span>
              <span>✓ Built for everyone</span>
            </div>
          </div>

          <div className="gs-hero-visual">
            <div className="gs-visual-glow" />
            <img
              src="/borrow-box-hero.svg"
              alt="Borrow Box sharing and borrowing illustration"
              className="gs-hero-image"
            />
            <div className="gs-floating-card gs-float-one">
              <span>📦</span>
              <div><strong>Borrow</strong><small>When you need it</small></div>
            </div>
            <div className="gs-floating-card gs-float-two">
              <span>♻</span>
              <div><strong>Share & Reuse</strong><small>Give items another life</small></div>
            </div>
          </div>
        </section>

        <section className="gs-section" id="features">
          <div className="gs-section-heading">
            <span>WHY BORROW BOX?</span>
            <h2>Useful features for everyday needs</h2>
            <p>One simple place to discover, share, rent, borrow and sell.</p>
          </div>

          <div className="gs-feature-grid">
            <article className="gs-feature">
              <div className="gs-feature-icon">🔎</div>
              <h3>Find what you need</h3>
              <p>Browse items from the community and discover something useful nearby.</p>
            </article>
            <article className="gs-feature">
              <div className="gs-feature-icon">📦</div>
              <h3>Borrow & Rent</h3>
              <p>Use an item for the period you need instead of buying it unnecessarily.</p>
            </article>
            <article className="gs-feature">
              <div className="gs-feature-icon">🏷</div>
              <h3>Buy & Sell</h3>
              <p>List things you no longer need and find useful pre-owned items.</p>
            </article>
            <article className="gs-feature">
              <div className="gs-feature-icon">🤝</div>
              <h3>Share with others</h3>
              <p>Connect with people and make useful items easier to access.</p>
            </article>
          </div>
        </section>

        <section className="gs-how-section" id="how-it-works">
          <div className="gs-section-heading">
            <span>HOW IT WORKS</span>
            <h2>Simple steps. Less hassle.</h2>
          </div>

          <div className="gs-steps">
            <div className="gs-step">
              <b>01</b>
              <div>
                <h3>Find an item</h3>
                <p>Search or browse the available items.</p>
              </div>
            </div>
            <div className="gs-step">
              <b>02</b>
              <div>
                <h3>Choose your option</h3>
                <p>Borrow, rent or buy based on the listing.</p>
              </div>
            </div>
            <div className="gs-step">
              <b>03</b>
              <div>
                <h3>Connect & share</h3>
                <p>Send a request and complete the exchange.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="gs-purpose" id="about">
          <div>
            <span>OUR PURPOSE</span>
            <h2>Share more. Waste less.</h2>
            <p>
              Borrow Box helps people get more value from the things already
              around them by making sharing, borrowing, renting and reselling
              simple.
            </p>
          </div>
          <button className="gs-primary gs-purpose-button" onClick={() => navigate("/signup")}>
            Join Borrow Box <span>→</span>
          </button>
        </section>
      </main>

      <footer className="gs-footer">
        <strong>Borrow Box</strong>
        <span>Community sharing made simple.</span>
      </footer>
    </div>
  );
}

export default GetStarted;
