import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BBIcon from "../components/BBIcon";
import "./SellerHistory.css";

const API_URL = "http://localhost:5000";

export default function SellerHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { try { setUser(JSON.parse(localStorage.getItem("borrowBoxUser") || "null")); } catch {} }, []);
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/api/borrow-requests/owner/${encodeURIComponent(user.email)}`)
      .then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Unable to load buyers."); return d; })
      .then(d => setOrders((d.requests || []).filter(r => r.requestType === "Purchase" && ["Approved", "Returned"].includes(r.status))))
      .catch(e => setError(e.message || "Unable to load buyer history."))
      .finally(() => setLoading(false));
  }, [user?.email]);
  const buyers = useMemo(() => { const map = {}; orders.forEach(o => { const key = String(o.borrowerEmail || "").toLowerCase(); if (!key) return; if (!map[key]) map[key] = { name: o.borrower || "Student", email: key, orders: [] }; map[key].orders.push(o); }); return Object.values(map); }, [orders]);
  if (!user?.email || loading) return <div className="seller-history-page"><div className="seller-history-loading">Loading buyer history...</div></div>;
  return <div className="seller-history-page"><header className="seller-history-header"><button onClick={() => navigate("/my-items")}><BBIcon name="home" size={17}/> My Items</button><div className="seller-history-brand"><div className="seller-history-logo">◇</div><div><strong>Borrow Box</strong><span>Seller centre</span></div></div><button onClick={() => navigate("/profile")}><BBIcon name="profile" size={18}/> Profile</button></header><main className="seller-history-main"><div className="seller-history-heading"><span>SELLER HISTORY</span><h1>My Buyers</h1><p>Buyer profiles, purchased products and direct transaction chat.</p></div>{error&&<div className="seller-history-error">{error}</div>}{!buyers.length?<section className="seller-history-empty"><BBIcon name="cart" size={30}/><h2>No buyers yet</h2><p>Approved sale orders will appear here.</p></section>:<section className="buyer-grid">{buyers.map(b=><article className="buyer-card" key={b.email}><div className="buyer-card-top"><div className="buyer-avatar"><BBIcon name="profile" size={28}/></div><div className="buyer-identity"><h2>{b.name}</h2><p>{b.email}</p><span>{b.orders.length} purchase{b.orders.length!==1?"s":""}</span></div></div><div className="buyer-history-title"><BBIcon name="receipt" size={17}/> Bought product history</div><div className="buyer-products">{b.orders.map(o=><div className="buyer-product" key={o._id}><div><strong>{o.itemTitle}</strong><small>₹{o.itemPrice} · {o.paymentStatus === "Paid" ? "Paid" : o.status}</small></div><time>{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</time></div>)}</div><button className="buyer-chat-button" onClick={()=>navigate(`/chat/${b.orders[0]._id}`)}><BBIcon name="chat" size={18}/> Chat with {b.name}</button></article>)}</section>}</main></div>;
}
