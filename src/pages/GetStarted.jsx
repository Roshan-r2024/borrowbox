import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lightHero from "../assets/borrow-box-hero-light.svg";
import darkHero from "../assets/borrow-box-hero-dark.svg";
import "./GetStarted.css";

const features = [
  { icon: "◇", title: "Borrow & Rent", text: "Get the items you need, when you need them. Use them for a while and return them." },
  { icon: "◆", title: "Buy & Sell", text: "List items you no longer need and find great deals from other people." },
  { icon: "♧", title: "Community Sharing", text: "Connect with people and make useful items easier to access." },
  { icon: "♻", title: "Save Money & Waste Less", text: "Reuse more, spend less, and give everyday items another life." },
  { icon: "▯", title: "Easy & Convenient", text: "Browse listings, send requests, and manage exchanges in one place." },
];

export default function GetStarted() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("borrowbox-theme-change", sync);
    sync();
    return () => window.removeEventListener("borrowbox-theme-change", sync);
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
        <button className="gs-brand" onClick={() => navigate("/get-started")} aria-label="Borrow Box home">
          <span className="gs-logo">◇</span>
          <span className="gs-brand-copy"><strong>Borrow <i>Box</i></strong><small>Share · Rent · Buy</small></span>
        </button>
        <nav className="gs-nav-links" aria-label="Main navigation">
          <a className="active" href="#home">Home</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a>
        </nav>
        <div className="gs-nav-actions">
          <button className="gs-theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title="Switch theme">{dark ? "☀" : "☾"}</button>
          <button className="gs-login-top" onClick={() => navigate("/login")}>Login</button>
          <button className="gs-signup-top" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </header>

      <main>
        <section className="gs-hero" id="home">
          <div className="gs-hero-content">
            <div className="gs-badge">Borrow&nbsp; • &nbsp;Rent&nbsp; • &nbsp;Buy</div>
            <h1>Everything You Need,<br />Just a <span>Borrow Away</span></h1>
            <p>Borrow Box is a community marketplace where everyone can borrow, rent, buy, or sell useful items. Save money, reuse more, and help each other.</p>
            <div className="gs-buttons">
              <button className="gs-primary" onClick={() => navigate("/signup")}>Get Started <span>→</span></button>
              <a className="gs-secondary" href="#how-it-works">Learn More</a>
            </div>
          </div>
          <div className="gs-hero-visual">
            <div className="gs-visual-glow" />
            <img src={dark ? darkHero : lightHero} alt="Borrow Box marketplace for borrowing, renting, buying and sharing" className="gs-hero-image" />
          </div>
        </section>

        <section className="gs-section" id="features">
          <div className="gs-section-heading"><span>WHY CHOOSE BORROW BOX?</span><h2>Smart Features for Everyday Life</h2></div>
          <div className="gs-feature-grid">
            {features.map((feature, index) => <article className="gs-feature" key={feature.title}>
              <div className={"gs-feature-icon gs-icon-" + index}>{feature.icon}</div>
              <h3>{feature.title}</h3><p>{feature.text}</p>
            </article>)}
          </div>
        </section>

        <section className="gs-purpose" id="how-it-works">
          <div className="gs-purpose-art" aria-hidden="true">♧</div>
          <div className="gs-purpose-copy"><h2>Ready to start sharing?</h2><p>Join the Borrow Box community. List an item, find something useful, and make more of what you already have.</p></div>
          <button className="gs-primary gs-purpose-button" onClick={() => navigate("/signup")}>Get Started <span>→</span></button>
        </section>
      </main>
      <footer className="gs-footer"><strong>Borrow Box</strong><span>Share more. Waste less.</span></footer>
    </div>
  );
}
