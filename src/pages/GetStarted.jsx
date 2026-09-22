import React from "react";
import { useNavigate } from "react-router-dom";
import "./GetStarted.css";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="get-started-page">
      <header className="gs-navbar">
        <div className="gs-brand" onClick={() => navigate("/get-started")}>
          <div className="gs-logo">◇</div>
          <div>
            <h2>Borrow Box</h2>
            <span>Share. Borrow. Rent. Sell.</span>
          </div>
        </div>
        <button className="gs-login-top" onClick={() => navigate("/login")}>Log in</button>
      </header>

      <main className="gs-main">
        <section className="gs-hero">
          <div className="gs-badge">OPEN FOR EVERYONE</div>
          <h1>
            Borrow what you need.
            <br />
            <span>Lend, rent or sell what you have.</span>
          </h1>
          <p>
            Borrow Box is a community marketplace where anyone can discover useful items,
            borrow or rent them for a period, or sell items they no longer need.
          </p>
          <div className="gs-buttons">
            <button className="gs-primary" onClick={() => navigate("/login")}>
              Get Started <span>→</span>
            </button>
            <button className="gs-secondary" onClick={() => navigate("/signup")}>
              Create an Account
            </button>
          </div>
        </section>

        <section className="gs-features">
          <div className="gs-feature">
            <div className="gs-feature-icon">🔍</div>
            <h3>Find what you need</h3>
            <p>Discover useful items listed by people in the Borrow Box community.</p>
          </div>
          <div className="gs-feature">
            <div className="gs-feature-icon">🔄</div>
            <h3>Borrow or Rent</h3>
            <p>Request an item for borrowing or choose a rental period when available.</p>
          </div>
          <div className="gs-feature">
            <div className="gs-feature-icon">💰</div>
            <h3>Sell or List Items</h3>
            <p>List items for permanent sale or make them available to rent or borrow.</p>
          </div>
        </section>
      </main>

      <footer className="gs-footer">
        <span>Borrow Box</span>
        <span>•</span>
        <span>Community sharing made simple.</span>
      </footer>
    </div>
  );
}

export default GetStarted;