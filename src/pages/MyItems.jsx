import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyItems.css";

const API_URL = "http://localhost:5000";

function MyItems() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("borrowBoxUser") || "null"); }
    catch { return null; }
  })();
  const email = storedUser?.email || "";

  const loadData = async () => {
    if (!email) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [itemsRes, requestsRes, borrowedRes] = await Promise.all([
        fetch(`${API_URL}/api/items`),
        fetch(`${API_URL}/api/borrow-requests/owner/${encodeURIComponent(email)}`),
        fetch(`${API_URL}/api/borrow-requests/borrower/${encodeURIComponent(email)}`),
      ]);

      const itemsData = await itemsRes.json();
      const requestsData = await requestsRes.json();
      const borrowedData = await borrowedRes.json();

      if (!itemsRes.ok) throw new Error(itemsData.message || "Unable to load products.");
      if (!requestsRes.ok) throw new Error(requestsData.message || "Unable to load requests.");
      if (!borrowedRes.ok) throw new Error(borrowedData.message || "Unable to load borrowed items.");

      const myItems = (itemsData.items || []).filter(
        (item) => String(item.ownerEmail || "").toLowerCase() === email.toLowerCase()
      );

      setItems(myItems);
      setRequests(requestsData.requests || []);
      setBorrowed((borrowedData.requests || []).filter(r => ["Pending", "Approved"].includes(r.status)));
    } catch (err) {
      console.error("My Items loading error:", err);
      setError(err.message || "Unable to load My Products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const processRequest = async (requestId, action) => {
    try {
      setActionLoading(`${requestId}-${action}`);
      setError("");
      const response = await fetch(`${API_URL}/api/borrow-requests/${requestId}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to process request.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to process request.");
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const imageUrl = (item) => {
    if (!item?.imageUrl) return "";
    return item.imageUrl.startsWith("http") ? item.imageUrl : `${API_URL}${item.imageUrl}`;
  };

  const listingLabel = (item) => item.listingType === "sale" ? "SALE" : "RENT";
  const priceLabel = (item) => item.listingType === "sale" ? `₹${item.price} • Permanent` : `₹${item.price} / day`;

  if (loading) {
    return <div className="myitems-page"><div className="myitems-loading">Loading My Products...</div></div>;
  }

  return (
    <div className="myitems-page">
      <header className="myitems-header">
        <div className="myitems-brand" onClick={() => navigate("/home")}>
          <div className="myitems-logo">◇</div>
          <div><strong>Borrow Box</strong><span>Campus sharing</span></div>
        </div>
        <button className="myitems-back" onClick={() => navigate("/home")}>← Back</button>
      </header>

      <main className="myitems-container">
        <div className="myitems-heading">
          <span>MY ACTIVITY</span>
          <h1>My Products</h1>
          <p>Manage your listed products, incoming requests and active borrowing.</p>
        </div>

        {error && <div className="myitems-error">{error}</div>}

        <div className="myitems-tabs">
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            My Products <span>{items.length}</span>
          </button>
          <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
            Requests <span>{requests.filter(r => r.status === "Pending").length}</span>
          </button>
          <button className={activeTab === "borrowed" ? "active" : ""} onClick={() => setActiveTab("borrowed")}>
            My Borrowing <span>{borrowed.length}</span>
          </button>
        </div>

        {activeTab === "products" && (
          <section className="myitems-list">
            {items.length === 0 ? (
              <div className="myitems-empty"><strong>No products listed yet</strong><p>List something useful for students on your campus.</p></div>
            ) : items.map((item) => (
              <article className="myitem-card" key={item._id}>
                <div className="myitem-image">{imageUrl(item) ? <img src={imageUrl(item)} alt={item.title} /> : "◇"}</div>
                <div className="myitem-content">
                  <div className="myitem-main">
                    <div className="myitem-meta"><span className="myitem-category">{item.category}</span><span className="listing-badge">{listingLabel(item)}</span></div>
                    <h2>{item.title}</h2>
                    <p>{priceLabel(item)}</p>
                  </div>
                  <span className={`myitem-status ${String(item.status || "Available").toLowerCase()}`}>● {item.status}</span>
                </div>
                <button className="myitem-more" onClick={() => navigate(`/item-details/${item._id}`)}>→</button>
              </article>
            ))}
          </section>
        )}

        {activeTab === "requests" && (
          <section className="request-list">
            {requests.length === 0 ? (
              <div className="myitems-empty"><strong>No requests yet</strong><p>Requests for your products will appear here.</p></div>
            ) : requests.map((request) => (
              <article className="request-card" key={request._id}>
                <div className="request-card-top">
                  <div><span className="myitem-category">{request.requestType === "Purchase" ? "SALE REQUEST" : "RENT REQUEST"}</span><h2>{request.itemTitle}</h2></div>
                  <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                </div>
                <div className="request-info">
                  <div><span>REQUESTED BY</span><strong>{request.borrower}</strong><small>{request.borrowerEmail}</small></div>
                  <div><span>TYPE</span><strong>{request.requestType === "Purchase" ? "Permanent purchase" : "Rental"}</strong></div>
                  {request.requestType !== "Purchase" && <div><span>DATES</span><strong>{formatDate(request.startDate)} → {formatDate(request.endDate)}</strong></div>}
                  <div><span>PRICE</span><strong>{request.requestType === "Purchase" ? `₹${request.itemPrice}` : `₹${request.itemPrice} / day`}</strong></div>
                </div>
                {request.message && <p className="request-message">“{request.message}”</p>}
                {request.status === "Pending" && (
                  <div className="request-actions">
                    <button className="request-reject" disabled={!!actionLoading} onClick={() => processRequest(request._id, "reject")}>Reject</button>
                    <button className="request-approve" disabled={!!actionLoading} onClick={() => processRequest(request._id, "approve")}>{actionLoading === `${request._id}-approve` ? "Approving..." : request.requestType === "Purchase" ? "Approve Sale" : "Approve Rent"}</button>
                  </div>
                )}
                {request.status === "Approved" && request.requestType === "Borrow" && (
                  <div className="request-actions"><button className="request-approve" disabled={!!actionLoading} onClick={() => processRequest(request._id, "return")}>Mark as Returned</button></div>
                )}
              </article>
            ))}
          </section>
        )}

        {activeTab === "borrowed" && (
          <section className="request-list">
            {borrowed.length === 0 ? (
              <div className="myitems-empty"><strong>No active borrowing</strong><p>Items you request will appear here.</p></div>
            ) : borrowed.map((request) => (
              <article className="request-card" key={request._id}>
                <div className="request-card-top"><div><span className="myitem-category">{request.requestType === "Purchase" ? "PURCHASE" : "BORROWED"}</span><h2>{request.itemTitle}</h2></div><span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span></div>
                <div className="request-info"><div><span>OWNER</span><strong>{request.owner}</strong></div><div><span>PRICE</span><strong>₹{request.itemPrice}{request.requestType === "Borrow" ? " / day" : ""}</strong></div>{request.requestType === "Borrow" && <div><span>DATES</span><strong>{formatDate(request.startDate)} → {formatDate(request.endDate)}</strong></div>}</div>
              </article>
            ))}
          </section>
        )}

        <div className="myitems-add"><div><strong>Have something useful?</strong><p>Share it with students on your campus.</p></div><button onClick={() => navigate("/list-item")}>+ List an Item</button></div>
      </main>
    </div>
  );
}

export default MyItems;
