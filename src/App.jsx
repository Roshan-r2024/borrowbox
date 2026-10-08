import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const categories = ["All", "Books", "Electronics", "Notes", "Sports", "Others"];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("borrowBoxUser") || "null");
  } catch {
    return null;
  }
}

function ThemeButton() {
  const [dark, setDark] = useState(() => localStorage.getItem("color-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("color-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button className="btn btn-outline-secondary rounded-pill" onClick={() => setDark(v => !v)}>
      {dark ? "☀ Light" : "☾ Dark"}
    </button>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("borrowBoxUser");
    localStorage.removeItem("borrowBoxEmail");
    navigate("/get-started", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top bb-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand fw-bold fs-4" to={user ? "/home" : "/get-started"}>
          <span className="text-primary">Borrow</span> Box
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bbNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="bbNav">
          <div className="navbar-nav me-auto gap-lg-2">
            {user && <>
              <Link className={`nav-link ${location.pathname === "/home" ? "active fw-semibold" : ""}`} to="/home">Home</Link>
              <Link className={`nav-link ${location.pathname === "/browse" ? "active fw-semibold" : ""}`} to="/browse">Browse</Link>
              <Link className={`nav-link ${location.pathname === "/list-item" ? "active fw-semibold" : ""}`} to="/list-item">List Item</Link>
              <Link className="nav-link" to="/my-items">My Items</Link>
              <Link className="nav-link" to="/profile">Profile</Link>
            </>}
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <ThemeButton />
            {user ? (
              <button className="btn btn-outline-danger rounded-pill" onClick={logout}>Logout</button>
            ) : (
              <>
                <Link className="btn btn-outline-primary rounded-pill" to="/login">Login</Link>
                <Link className="btn btn-primary rounded-pill" to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function GetStarted() {
  return (
    <div className="bb-page d-flex align-items-center">
      <div className="container py-4 py-lg-5">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-6">
            <span className="badge text-bg-primary rounded-pill px-3 py-2 mb-3">Buy • Rent • Share</span>
            <h1 className="display-4 fw-bold lh-1 mb-3">Borrow what you need. Sell what you don't.</h1>
            <p className="lead text-secondary mb-4">
              Borrow Box is a public marketplace for people to buy, rent and list useful items in one simple place.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Link className="btn btn-primary btn-lg rounded-pill px-4" to="/signup">Get Started</Link>
              <Link className="btn btn-outline-secondary btn-lg rounded-pill px-4" to="/login">I already have an account</Link>
            </div>
            <div className="row row-cols-3 g-2 mt-4">
              {["Easy listing", "Flexible rent", "Direct contact"].map(x => (
                <div className="col" key={x}><div className="card h-100 border-0 shadow-sm p-3 text-center small fw-semibold">{x}</div></div>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="hero-card rounded-4 shadow-sm p-3 p-md-4">
              <img src="/borrow-box-hero.svg" className="img-fluid w-100" alt="Borrow Box marketplace" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Auth({ signup = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", gender: "", address: "", pincode: "", state: "" });
  const [message, setMessage] = useState("");

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    if (!form.email || !form.password || (signup && (!form.name || !form.phone))) {
      setMessage("Please fill the required fields.");
      return;
    }
    const user = { ...form, name: form.name || form.email.split("@")[0], email: form.email };
    localStorage.setItem("borrowBoxUser", JSON.stringify(user));
    localStorage.setItem("borrowBoxEmail", user.email);
    navigate("/home", { replace: true });
  };

  return (
    <div className="bb-page d-flex align-items-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className={`col-12 ${signup ? "col-md-10 col-lg-8" : "col-md-7 col-lg-5"}`}>
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <Link className="text-decoration-none fw-bold fs-3" to="/get-started"><span className="text-primary">Borrow</span> Box</Link>
                  <h2 className="fw-bold mt-3">{signup ? "Create your account" : "Welcome back"}</h2>
                  <p className="text-secondary mb-0">{signup ? "Join the public Borrow Box marketplace." : "Login to continue to Borrow Box."}</p>
                </div>
                {message && <div className="alert alert-danger py-2">{message}</div>}
                <form onSubmit={submit}>
                  {signup && <div className="row g-3">
                    <Field name="name" label="Full name" value={form.name} onChange={update} required />
                    <Field name="phone" label="Phone number" value={form.phone} onChange={update} required />
                    <Field name="gender" label="Gender" value={form.gender} onChange={update} />
                    <Field name="pincode" label="Pincode" value={form.pincode} onChange={update} />
                    <Field name="state" label="State" value={form.state} onChange={update} />
                    <Field name="address" label="Address" value={form.address} onChange={update} wide />
                  </div>}
                  <div className="row g-3 mt-0">
                    <Field name="email" label="Email address" type="email" value={form.email} onChange={update} required wide={!signup} />
                    <Field name="password" label="Create password" type="password" value={form.password} onChange={update} required wide={!signup} />
                  </div>
                  <button className="btn btn-primary btn-lg w-100 rounded-pill mt-4" type="submit">{signup ? "Sign Up" : "Login"}</button>
                </form>
                <p className="text-center text-secondary mt-4 mb-0">
                  {signup ? "Already registered? " : "New to Borrow Box? "}
                  <Link to={signup ? "/login" : "/signup"}>{signup ? "Login" : "Create an account"}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", value, onChange, required = false, wide = false }) {
  return (
    <div className={`col-12 ${wide ? "" : "col-md-6"}`}>
      <label className="form-label fw-semibold">{label}{required && " *"}</label>
      <input className="form-control form-control-lg rounded-3" name={name} type={type} value={value} onChange={onChange} required={required} />
    </div>
  );
}

function Home() {
  const user = getUser();
  return (
    <div className="bb-page">
      <div className="container-fluid px-3 px-lg-5 py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div><span className="text-primary fw-semibold">Borrow Box</span><h1 className="fw-bold mb-1">Welcome{user?.name ? `, ${user.name}` : ""} 👋</h1><p className="text-secondary mb-0">Find something useful or list an item for someone else.</p></div>
          <Link className="btn btn-primary rounded-pill px-4" to="/list-item">+ List an item</Link>
        </div>
        <div className="row g-3 mb-4">
          {categories.map(c => <div className="col-6 col-md-4 col-lg-2" key={c}><Link to={c === "All" ? "/browse" : `/browse?category=${encodeURIComponent(c)}`} className="card category-card border-0 shadow-sm h-100 text-decoration-none"><div className="card-body text-center p-3"><div className="fs-2 mb-2">{c === "Books" ? "📚" : c === "Electronics" ? "💻" : c === "Notes" ? "📝" : c === "Sports" ? "⚽" : c === "Others" ? "＋" : "⌂"}</div><div className="fw-semibold">{c}</div></div></Link></div>)}
        </div>
        <div className="hero-panel rounded-4 p-4 p-lg-5 shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7"><span className="badge text-bg-light text-primary rounded-pill mb-3">One marketplace, many possibilities</span><h2 className="display-6 fw-bold">Buy permanently or rent for exactly the time you need.</h2><p className="text-secondary mb-0">Browse listings, connect with sellers and make better use of things already around you.</p></div>
            <div className="col-12 col-lg-5 text-center"><img src="/borrow-box-hero.svg" className="img-fluid hero-small" alt="" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Browse() {
  return <SimplePage title="Browse items" text="Explore books, electronics, notes, sports equipment and other useful items." action="Start browsing" />;
}
function SimplePage({ title, text, action }) {
  return <div className="bb-page"><div className="container py-5"><div className="card border-0 shadow-sm rounded-4"><div className="card-body p-4 p-lg-5"><h1 className="fw-bold">{title}</h1><p className="lead text-secondary">{text}</p><Link className="btn btn-primary rounded-pill" to="/browse">{action || "Continue"}</Link></div></div></div></div>;
}
function Protected({ children }) {
  return getUser() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={getUser() ? "/home" : "/get-started"} replace />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth signup />} />
        <Route path="/home" element={<Protected><Home /></Protected>} />
        <Route path="/browse" element={<Protected><Browse /></Protected>} />
        <Route path="/list-item" element={<Protected><SimplePage title="List an item" text="Choose whether your item is for permanent sale or rental." /></Protected>} />
        <Route path="/my-items" element={<Protected><SimplePage title="My Items" text="Your listed items will appear here." /></Protected>} />
        <Route path="/profile" element={<Protected><SimplePage title="Profile" text="Manage your Borrow Box profile." /></Protected>} />
        <Route path="/item-details" element={<Protected><SimplePage title="Item details" text="View item information and contact the seller." /></Protected>} />
        <Route path="/borrow-request" element={<Protected><SimplePage title="Borrow request" text="Send and track rental requests." /></Protected>} />
        <Route path="/chat" element={<Protected><SimplePage title="Chat" text="Connect with buyers and sellers." /></Protected>} />
        <Route path="/seller-history" element={<Protected><SimplePage title="Seller history" text="Review your sales and rental history." /></Protected>} />
        <Route path="*" element={<Navigate to={getUser() ? "/home" : "/get-started"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
