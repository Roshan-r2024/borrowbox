import React from "react";
import { useNavigate } from "react-router-dom";
import "./GetStarted.css";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="get-started-page">

      {/* ================= NAVBAR ================= */}
      <header className="gs-navbar">

        <div
          className="gs-brand"
          onClick={() => navigate("/get-started")}
        >
          <div className="gs-logo">◇</div>

          <div>
            <h2>Borrow Box</h2>
            <span>Campus sharing</span>
          </div>
        </div>

        <button
          className="gs-login-top"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="gs-main">

        {/* ================= HERO ================= */}
        <section className="gs-hero">

          <div className="gs-badge">
            VIT CAMPUS SHARING PLATFORM
          </div>

          <h1>
            Borrow what you need.
            <br />
            <span>Lend what you have.</span>
          </h1>

          <p>
            Borrow Box makes it easy for students to share,
            borrow and lend useful items within the campus
            community.
          </p>

          <div className="gs-buttons">

            <button
              className="gs-primary"
              onClick={() => navigate("/login")}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="gs-secondary"
              onClick={() => navigate("/signup")}
            >
              Create an Account
            </button>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section className="gs-features">

          <div className="gs-feature">

            <div className="gs-feature-icon">
              🔍
            </div>

            <h3>Find what you need</h3>

            <p>
              Browse useful items shared by students
              around your campus.
            </p>

          </div>


          <div className="gs-feature">

            <div className="gs-feature-icon">
              📦
            </div>

            <h3>List your items</h3>

            <p>
              Share books, electronics and other
              useful items with fellow students.
            </p>

          </div>


          <div className="gs-feature">

            <div className="gs-feature-icon">
              🤝
            </div>

            <h3>Share with students</h3>

            <p>
              Connect with students and make borrowing
              simple and convenient.
            </p>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="gs-footer">

        <span>Borrow Box</span>

        <span>•</span>

        <span>Campus sharing made simple.</span>

      </footer>

    </div>
  );
}

export default GetStarted;