import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const categories = ["All", "Books", "Electronics", "Notes", "Sports", "Others"];

function readUser() {
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
    <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setDark(v => !v)}>
      {dark ? "☀ Light" : "☾ Dark"}
    </button>
  );
}

function Navbar() {
  const user = readUser();
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("borrowBoxUser");
    localStorage.removeItem("borrowBoxEmail");
    navigate("/get-started", { replace: true });
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top border-bottom bb-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand fw-bold fs-4" to={user ? "/home" : "/get-started"}>
          <span className="text-primary">Borrow</span> Box
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#borrowBoxNav" aria-controls="borrowBoxNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div id="borrowBoxNav" className="collapse navbar-collapse">
          {user && (
            <div className="navbar-nav me-auto">
              <Link className={`nav-link ${location.pathname === "/home" ? "active fw-semibold" : ""}`} to="/home">Home</Link>
              <Link className={`nav-link ${location.pathname === "/browse" ? "active fw-semibold" : ""}`} to="/browse">Browse</Link>
              <Link className="nav-link" to="/list-item">List Item</Link>
              <Link className="nav-link" to="/my-items">My Items</Link>
              <Link className="nav-link" to="/profile">Profile</Link>
            </div>
          )}
          {!user && <div className="me-auto" />}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <ThemeButton />
            {user ? (
              <button type="button" className="btn btn-outline-danger rounded-pill" onClick={logout}>Logout</button>
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
    <main className="bb-page d-flex align-items-center">
      <div className="container py-4 py-lg-5">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-6">
            <span className="badge text-bg-primary rounded-pill px-3 py-2 mb-3">BUY • RENT • SHARE</span>
            <h1 className="display-4 fw-bold">Borrow what you need. Sell what you don't.</h1>
            <p className="lead text-secondary mt-3">
              Borrow Box is a public marketplace where anyone can list, buy or rent useful items.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
              <Link className="btn btn-primary btn-lg rounded-pill px-4" to="/signup">Get Started</Link>
              <Link className="btn btn-outline-secondary btn-lg rounded-pill px-4" to="/login">Login</Link>
            </div>
            <div className="row g-2 mt-4">
              {["Easy listing", "Flexible rental", "Direct contact"].map(item => (
                <div className="col-12 col-sm-4" key={item}>
                  <div className="card border-0 shadow-sm h-100 text-center p-3 fw-semibold">{item}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="hero-card rounded-4 shadow-sm p-3 p-md-4 text-center">
              <img src="/borrow-box-hero.svg" className="img-fluid" alt="Borrow Box marketplace" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ name, label, type = "text", value, onChange, required = false, wide = false }) {
  return (
    <div className={`col-12 ${wide ? "" : "col-md-6"}`}>
      <label className="form-label fw-semibold">{label}{required ? " *" : ""}</label>
      <input className="form-control form-control-lg rounded-3" name={name} type={type} value={value} onChange={onChange} required={required} />
    </div>
  );
}

function Auth({ signup = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", gender: "", address: "", pincode: "", state: "", password: "" });
  const [error, setError] = useState("");

  function update(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || (signup && (!form.name || !form.phone))) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const user = { ...form, name: form.name || form.email.split("@")[0] };
    localStorage.setItem("borrowBoxUser", JSON.stringify(user));
    localStorage.setItem("borrowBoxEmail", user.email);
    navigate("/home", { replace: true });
  }

  return (
    <main className="bb-page d-flex align-items-center py-4">
      <div className="container">
        <div className={`row justify-content-center ${signup ? "" : "my-auto"}`}>
          <div className={`col-12 ${signup ? "col-lg-9" : "col-md-7 col-lg-5"}`}>
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <Link className="text-decoration-none fw-bold fs-3" to="/get-started"><span className="text-primary">Borrow</span> Box</Link>
                  <h2 className="fw-bold mt-3">{signup ? "Create your account" : "Welcome back"}</h2>
                  <p className="text-secondary">{signup ? "Join Borrow Box — no OTP required." : "Login to continue."}</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submit}>
                  {signup && (
                    <div className="row g-3">
                      <Field name="name" label="Full name" value={form.name} onChange={update} required />
                      <Field name="phone" label="Phone number" value={form.phone} onChange={update} required />
                      <Field name="gender" label="Gender" value={form.gender} onChange={update} />
                      <Field name="pincode" label="Pincode" value={form.pincode} onChange={update} />
                      <Field name="state" label="State" value={form.state} onChange={update} />
                      <Field name="address" label="Address" value={form.address} onChange={update} wide />
                    </div>
                  )}
                  <div className="row g-3 mt-0">
                    <Field name="email" label="Email address" type="email" value={form.email} onChange={update} required wide={!signup} />
                    <Field name="password" label="Password" type="password" value={form.password} onChange={update} required wide={!signup} />
                  </div>
                  <button className="btn btn-primary btn-lg w-100 rounded-pill mt-4" type="submit">{signup ? "Sign Up" : "Login"}</button>
                </form>

                <p className="text-center text-secondary mt-4 mb-0">
                  {signup ? "Already have an account? " : "New to Borrow Box? "}
                  <Link to={signup ? "/login" : "/signup"}>{signup ? "Login" : "Create an account"}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Protected({ children }) {
  return readUser() ? children : <Navigate to="/login" replace />;
}

function Home() {
  const user = readUser();
  const icons = { All: "⌂", Books: "📚", Electronics: "💻", Notes: "📝", Sports: "⚽", Others: "＋" };

  return (
    <main className="bb-page">
      <div className="container-fluid px-3 px-lg-5 py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center mb-4">
          <div>
            <span className="text-primary fw-semibold">BORROW BOX</span>
            <h1 className="fw-bold mb-1">Welcome{user?.name ? `, ${user.name}` : ""} 👋</h1>
            <p className="text-secondary mb-0">Find something useful or list something you no longer need.</p>
          </div>
          <Link className="btn btn-primary rounded-pill px-4" to="/list-item">+ List an item</Link>
        </div>

        <div className="row g-3">
          {categories.map(category => (
            <div className="col-6 col-md-4 col-lg-2" key={category}>
              <Link className="card category-card border-0 shadow-sm h-100 text-decoration-none" to="/browse">
                <div className="card-body text-center py-4">
                  <div className="fs-2">{icons[category]}</div>
                  <div className="fw-semibold mt-2">{category}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <section className="hero-panel rounded-4 shadow-sm p-4 p-lg-5 mt-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h2 className="fw-bold">Buy permanently or rent for the dates you need.</h2>
              <p className="text-secondary mb-0">List an item for sale or rental, discover useful products and connect directly with people.</p>
            </div>
            <div className="col-lg-5 text-center">
              <img src="/borrow-box-hero.svg" className="img-fluid hero-small" alt="" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SimplePage({ title, text, action = "Go to Browse" }) {
  return (
    <main className="bb-page">
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-lg-5">
            <h1 className="fw-bold">{title}</h1>
            <p className="lead text-secondary">{text}</p>
            <Link className="btn btn-primary rounded-pill" to="/browse">{action}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function AppRoutes() {
  const user = readUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home" : "/get-started"} replace />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth signup />} />
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/browse" element={<Protected><SimplePage title="Browse Items" text="Explore items available for sale or rent." action="Browse" /></Protected>} />
      <Route path="/list-item" element={<Protected><SimplePage title="List an Item" text="Choose sale for a permanent sale or rental for a date-based request." action="Start Listing" /></Protected>} />
      <Route path="/my-items" element={<Protected><SimplePage title="My Items" text="Your listed items will appear here." /></Protected>} />
      <Route path="/profile" element={<Protected><SimplePage title="Profile" text="Manage your Borrow Box profile." /></Protected>} />
      <Route path="/item-details/:id" element={<Protected><SimplePage title="Item Details" text="View item information and contact the seller." /></Protected>} />
      <Route path="/item-details" element={<Protected><SimplePage title="Item Details" text="View item information and contact the seller." /></Protected>} />
      <Route path="/borrow-request/:id" element={<Protected><SimplePage title="Borrow Request" text="Request an item for your required dates." /></Protected>} />
      <Route path="/borrow-request" element={<Protected><SimplePage title="Borrow Request" text="Request an item for your required dates." /></Protected>} />
      <Route path="/chat/:orderId" element={<Protected><SimplePage title="Chat" text="Connect with buyers and sellers." /></Protected>} />
      <Route path="/chat" element={<Protected><SimplePage title="Chat" text="Connect with buyers and sellers." /></Protected>} />
      <Route path="/seller-history" element={<Protected><SimplePage title="Seller History" text="Review your sales and rental history." /></Protected>} />
      <Route path="*" element={<Navigate to={user ? "/home" : "/get-started"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
