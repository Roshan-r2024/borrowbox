import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ListItem from "./pages/ListItem";
import ItemDetails from "./pages/ItemDetails";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import BorrowRequest from "./pages/BorrowRequest";
import "./AppGuard.css";

const protectedPaths = ["/home", "/browse", "/list-item", "/item-details", "/my-items", "/profile", "/borrow-request"];

function isLoggedIn() {
  try {
    const user = JSON.parse(localStorage.getItem("borrowBoxUser") || "null");
    return Boolean(user?.email);
  } catch { return false; }
}

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function NavigationHelper() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const isHome = location.pathname === "/home";
  const isProtected = protectedPaths.some(path => location.pathname === path || location.pathname.startsWith(`${path}/`));
  if (!loggedIn || isHome || !isProtected) return null;
  return <button className="global-home-back" onClick={() => navigate("/home", { replace: true })} aria-label="Back to Home">← Home</button>;
}

function HomeAwareness() {
  const location = useLocation();
  if (location.pathname !== "/home") return null;
  return <div className="home-awareness"><span className="home-awareness-icon">⚠</span><div><strong>SAFETY AWARENESS</strong><p><b>No drugs or controlled substances can be sold, bought, rented or listed on Borrow Box.</b> Any prohibited listing will be removed.</p></div></div>;
}

function App() {
  return <BrowserRouter>
    <NavigationHelper />
    <HomeAwareness />
    <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn() ? "/home" : "/get-started"} replace />} />
      <Route path="/get-started" element={isLoggedIn() ? <Navigate to="/home" replace /> : <GetStarted />} />
      <Route path="/login" element={isLoggedIn() ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={isLoggedIn() ? <Navigate to="/home" replace /> : <SignUp />} />
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/browse" element={<Protected><Browse /></Protected>} />
      <Route path="/list-item" element={<Protected><ListItem /></Protected>} />
      <Route path="/item-details/:id" element={<Protected><ItemDetails /></Protected>} />
      <Route path="/my-items" element={<Protected><MyItems /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/borrow-request/:id" element={<Protected><BorrowRequest /></Protected>} />
      <Route path="/borrow-request" element={<Protected><BorrowRequest /></Protected>} />
      <Route path="*" element={<Navigate to={isLoggedIn() ? "/home" : "/get-started"} replace />} />
    </Routes>
  </BrowserRouter>;
}
export default App;
