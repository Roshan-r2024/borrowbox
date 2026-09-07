import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./HomeProducts.css";
import "./HomeCategoryEnhancements.css";
import "./HomePortalUsers.css";

const API_URL = "http://localhost:5000";
const categories = [
  { name: "All", icon: "⌂" }, { name: "Books", icon: "📚" }, { name: "Electronics", icon: "💻" },
  { name: "Notes", icon: "📝" }, { name: "Sports", icon: "⚽" }, { name: "Others", icon: "＋" },
];

function Home() {
  const navigate = useNavigate(); const [items, setItems] = useState([]);
  const [portalStats, setPortalStats] = useState({ liveUsers: 0, registeredUsers: 0 });
  let user = null; try { user = JSON.parse(localStorage.getItem("borrowBoxUser") || "null"); } catch {}
  const userName = user?.nickname || user?.name || user?.username || user?.email?.split("@")[0] || "Student";
  useEffect(() => { fetch(`${API_URL}/api/items`).then(r => r.json()).then(d => setItems(d.items || [])).catch(console.error); }, []);
  useEffect(() => {
    if (!user?.email) return;
    const updatePresence = () => fetch(`${API_URL}/api/auth/presence`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email }) }).catch(() => {});
    updatePresence(); const timer = setInterval(updatePresence, 30000); return () => clearInterval(timer);
  }, [user?.email]);
  useEffect(() => {
    const loadStats = () => fetch(`${API_URL}/api/auth/stats`).then(r => r.json()).then(d => setPortalStats({ liveUsers: d.liveUsers || 0, registeredUsers: d.registeredUsers || 0 })).catch(() => {});
    loadStats(); const timer = setInterval(loadStats, 30000); return () => clearInterval(timer);
  }, []);
  const img = u => !u ? "" : u.startsWith("http") ? u : `${API_URL}${u}`;
  const available = items.filter(i => i.status === "Available");
  const logout = () => { localStorage.removeItem("borrowBoxUser"); navigate("/login", { replace: true }); };
  const browseCategory = category => navigate(category === "All" ? "/browse" : `/browse?category=${encodeURIComponent(category)}`);

  return <div className="home-page">
    <header className="navbar"><div className="nav-container"><div className="brand" onClick={() => navigate("/home")}><div className="brand-logo">◇</div><div className="brand-text"><h2>Borrow Box</h2><span>Campus sharing</span></div></div><nav className="nav-links"><button className="nav-link active" onClick={() => navigate("/home")}>Home</button><button className="nav-link" onClick={() => navigate("/browse")}>Browse</button><button className="nav-link" onClick={() => navigate("/my-items")}>My Items</button></nav><div className="nav-actions"><div className="portal-users" title="Borrow Box portal activity"><span className="portal-user-icon">♙</span><span><strong>{portalStats.liveUsers}</strong> live <i>•</i> {portalStats.registeredUsers} registered</span></div><button className="list-top-btn" onClick={() => navigate("/list-item")}>+ List an Item</button><button className="profile-btn" onClick={() => navigate("/profile")}>{user?.profilePicture ? <img className="home-profile-avatar" src={img(user.profilePicture)} alt="Profile"/> : <span className="profile-avatar">{userName.charAt(0).toUpperCase()}</span>}<span>Profile</span><span className="profile-arrow">⌄</span></button></div></div></header>
    <main className="home-main">
      <section className="hero-section"><div className="hero-left"><p className="welcome-text">Welcome back 👋</p><h1>Borrow what you need.<br/><span>Lend what you have.</span></h1><p className="hero-description">A simple way for students to share, borrow and lend useful items within the campus community.</p></div><div className="hero-search-area"><div className="search-wrapper"><div className="search-icon">⌕</div><input placeholder="Search books, electronics, notes..." onKeyDown={e => { if (e.key === "Enter") navigate("/browse"); }}/></div><div className="home-category-strip"><div className="home-category-heading"><span>QUICK CATEGORIES</span><button onClick={() => navigate("/browse")}>View all →</button></div><div className="home-category-list">{categories.map(c => <button key={c.name} className="home-category-pill" onClick={() => browseCategory(c.name)}><span>{c.icon}</span>{c.name}</button>)}</div></div></div></section>
      <section className="quick-section"><div className="section-heading center-heading"><h2>What do you want to do?</h2><p>Choose an option to get started.</p></div><div className="action-grid"><div className="action-card"><div className="action-icon books-icon">📚</div><div className="action-content"><h3>Find something you need</h3><p>Discover useful items available from students on your campus.</p><button onClick={() => navigate("/browse")}>Browse Items <span>→</span></button></div></div><div className="action-card"><div className="action-icon box-icon">📦</div><div className="action-content"><h3>Share something you own</h3><p>List your unused books, electronics or other items for fellow students.</p><button onClick={() => navigate("/list-item")}>List an Item <span>→</span></button></div></div></div></section>
      <section className="home-products-section"><div className="home-products-heading"><div><span className="home-products-label">LATEST LISTINGS</span><h2>Available on Campus</h2><p>Products listed by students in Borrow Box.</p></div><button onClick={() => navigate("/browse")}>View all →</button></div>{available.length ? <div className="home-products-grid">{available.slice(0, 6).map(item => <article className="home-product-card" key={item._id} onClick={() => navigate(`/item-details/${item._id}`)}><div className="home-product-image">{item.imageUrl ? <img src={img(item.imageUrl)} alt={item.title}/> : <span>No Image</span>}<b>{item.listingType === "sale" ? "FOR SALE" : "FOR RENT"}</b></div><div className="home-product-body"><small>{item.category}</small><h3>{item.title}</h3><div className="home-product-owner">{item.ownerProfilePicture ? <img src={img(item.ownerProfilePicture)} alt=""/> : <span>{(item.owner || "S").charAt(0).toUpperCase()}</span>}<label>{item.owner || "Student"}</label></div><strong>₹{item.price}<em>{item.listingType === "sale" ? " permanent" : " / day"}</em></strong></div></article>)}</div> : <div className="home-empty-products"><p>No items listed yet.</p><button onClick={() => navigate("/list-item")}>List the first item →</button></div>}</section>
      <section className="bottom-cta"><div><h2>Have something others might need?</h2><p>Share it with students on your campus.</p></div><button onClick={() => navigate("/list-item")}>+ List an Item</button></section>
    </main><footer className="home-footer"><div className="footer-content"><div><strong>Borrow Box</strong><span>Campus sharing made simple.</span></div><button onClick={logout}>Logout</button></div></footer>
  </div>;
}
export default Home;
