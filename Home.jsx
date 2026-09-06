import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import Toast from "./Toast";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ message: location.state?.toast || "", type: location.state?.toastType || "success" });
  const user = JSON.parse(localStorage.getItem("borrowBoxUser") || "null");
  const userName = user?.nickname || user?.name || user?.username || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    if (location.state?.toast) {
      setToast({ message: location.state.toast, type: location.state.toastType || "success" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("borrowBoxUser");
    localStorage.removeItem("borrowBoxEmail");
    navigate("/login", { replace: true, state: { toast: "Logged out successfully.", toastType: "success" } });
  };

  return (
    <div className="home-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
      <header className="navbar"><div className="nav-container">
        <div className="brand" onClick={() => navigate("/home")}><div className="brand-logo">◇</div><div className="brand-text"><h2>Borrow Box</h2><span>Campus sharing</span></div></div>
        <nav className="nav-links"><button className="nav-link active" onClick={() => navigate("/home")}>Home</button><button className="nav-link" onClick={() => navigate("/browse")}>Browse</button><button className="nav-link" onClick={() => navigate("/my-items")}>My Items</button></nav>
        <div className="nav-actions"><button className="list-top-btn" onClick={() => navigate("/list-item")}>+ List an Item</button><button className="profile-btn" onClick={() => navigate("/profile")}><span className="profile-avatar">{userName.charAt(0).toUpperCase()}</span><span>Profile</span><span className="profile-arrow">⌄</span></button></div>
      </div></header>

      <main className="home-main">
        <section className="hero-section"><div className="hero-left"><p className="welcome-text">Welcome back 👋</p><h1>Borrow what you need.<br /><span>Lend what you have.</span></h1><p className="hero-description">A simple way for students to share, borrow and lend useful items within the campus community.</p></div><div className="search-wrapper"><div className="search-icon">⌕</div><input type="text" placeholder="Search books, electronics, notes..." onKeyDown={(e) => { if (e.key === "Enter") navigate("/browse"); }} /></div></section>
        <section className="quick-section"><div className="section-heading center-heading"><h2>What do you want to do?</h2><p>Choose an option to get started.</p></div><div className="action-grid">
          <div className="action-card"><div className="action-icon books-icon">📚</div><div className="action-content"><h3>Find something you need</h3><p>Discover useful items available from students on your campus.</p><button onClick={() => navigate("/browse")}>Browse Items <span>→</span></button></div></div>
          <div className="action-card"><div className="action-icon box-icon">📦</div><div className="action-content"><h3>Share something you own</h3><p>List your unused books, electronics or other items for fellow students.</p><button onClick={() => navigate("/list-item")}>List an Item <span>→</span></button></div></div>
        </div></section>
        <section className="categories-section"><div className="category-header"><div><h2>Browse Categories</h2><p>Find items quickly by category</p></div><button className="view-all" onClick={() => navigate("/browse")}>View all →</button></div><div className="category-grid"><button className="category-card" onClick={() => navigate("/browse")}><div className="category-icon">📚</div><h3>Books</h3><span>Textbooks & study books</span></button><button className="category-card" onClick={() => navigate("/browse")}><div className="category-icon">💻</div><h3>Electronics</h3><span>Gadgets & devices</span></button><button className="category-card" onClick={() => navigate("/browse")}><div className="category-icon">📝</div><h3>Notes</h3><span>Notes & study material</span></button><button className="category-card" onClick={() => navigate("/browse")}><div className="category-icon">🎒</div><h3>Others</h3><span>Everything else</span></button></div></section>
        <section className="bottom-cta"><div><h2>Have something others might need?</h2><p>Share it with students on your campus.</p></div><button onClick={() => navigate("/list-item")}>+ List an Item</button></section>
      </main>
      <footer className="home-footer"><div className="footer-content"><div><strong>Borrow Box</strong><span>Campus sharing made simple.</span></div><button onClick={handleLogout}>Logout</button></div></footer>
    </div>
  );
}
export default Home;
