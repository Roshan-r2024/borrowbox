import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BBIcon from "../components/BBIcon";
import "./SellerHistory.css";

const API_URL = "http://localhost:5000";

export default function SellerHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("borrowBoxUser") || "null")); } catch {}
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    const load = async () => {
      try {
        setLoading(true); setError("");
        const response = await fetch(`${API_URL}/api/borrow-requests/seller-history/${encodeURIComponent(user.email)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load buyer history.");
        setOrders(data.orders || []);
        const map = {};
        (data.buyers || []).forEach(b => { map[b.email] = b; });
        setUsers(map);
      } catch (e) { setError(e.message || "Unable to load buyer history."); }
      finally { setLoading(false); }
    };
    load();
  }, [user?.email]);

  const buyers = useMemo(() => {
    const map = {};
    orders.forEach(order => {
      const email = String(order.borrowerEmail || "").toLowerCase();
      if (!email) return;
      if (!map[email]) map[email] = { email, name: order.borrower || "Student", orders: [] };
      map[email].orders.push(order);
    });
    return Object.values(map).sort((a, b) => b.orders.length - a.orders.length);
  }, [orders]);

  const profileImage = buyer => {
    const value = users[buyer.email]?.profilePicture || "";
    return value ? (value.startsWith("http") ? value : `${API_URL}${value}`) : "";
  };

  if (!user?.email || loading) return <div className="seller-history-page"><div className="seller-history-loading">Loading buyer history...</div></div>;

  return (
    <div className="seller-history-page">
      <header className="seller-history-header">
        <button className="seller-history-back" onClick={() => navigate("/my-items")}><BBIcon name="home" size={17}/> My Items</button>
        <div className="seller-history-brand"><div className="seller-history-logo">◇</div><div><strong>Borrow Box</strong><span>Seller centre</span></div></div>
        <button className="seller-history-profile" onClick={() => navigate("/profile")}><BBIcon name="profile" size={18}/> Profile</button>
      </header>

      <main className="seller-history-main">
        <div className="seller-history-heading">
          <span>SELLER HISTORY</span>
          <h1>My Buyers</h1>
          <p>See the students who bought your products, their purchase history and start a chat.</p>
        </div>

        {error && <div className="seller-history-error">{error}</div>}

        {!buyers.length ? (
          <section className="seller-history-empty"><BBIcon name="cart" size={30}/><h2>No buyers yet</h2><p>Approved sale orders will appear here.</p></section>
        ) : (
          <section className="buyer-grid">
            {buyers.map(buyer => {
              const image = profileImage(buyer);
              return (
                <article className="buyer-card" key={buyer.email}>
                  <div className="buyer-card-top">
                    <div className="buyer-avatar">{image ? <img src={image} alt={buyer.name}/> : <BBIcon name="profile" size={29}/>}</div>
                    <div className="buyer-identity"><h2>{buyer.name}</h2><p>{buyer.email}</p><span>{buyer.orders.length} purchase{buyer.orders.length !== 1 ? "s" : ""}</span></div>
                  </div>
                  <div className="buyer-history-title"><BBIcon name="receipt" size={17}/> Bought product history</div>
                  <div className="buyer-products">
                    {buyer.orders.map(order => (
                      <div className="buyer-product" key={order._id}>
                        <div><strong>{order.itemTitle}</strong><small>₹{order.itemPrice} · {order.paymentStatus === "Paid" ? "Paid" : order.status}</small></div>
                        <time>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</time>
                      </div>
                    ))}
                  </div>
                  <button className="buyer-chat-button" onClick={() => navigate(`/chat/${buyer.orders[0]._id}`)}><BBIcon name="chat" size={18}/> Chat with {buyer.name}</button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
