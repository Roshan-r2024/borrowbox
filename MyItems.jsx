import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "./MyItems.css";

const API_URL = "http://localhost:5000";

function MyItems() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("listed");
  const [items, setItems] = useState([]);
  const [borrowedRequests, setBorrowedRequests] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [loadedTabs, setLoadedTabs] = useState({ listed: false, borrowed: false, requests: false });
  const [toast, setToast] = useState({ message: "", type: "info" });

  const getUser = () => { try { return JSON.parse(localStorage.getItem("borrowBoxUser") || "null"); } catch { return null; } };
  const showToast = (message, type = "info") => setToast({ message, type });

  const loadListedItems = async () => {
    const user = getUser(); if (!user?.email) return navigate("/login");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/items`); const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load items.");
      const allItems = Array.isArray(data) ? data : data.items || [];
      setItems(allItems.filter(item => (item.ownerEmail || "").toLowerCase() === user.email.toLowerCase()));
      setLoadedTabs(prev => ({ ...prev, listed: true }));
    } catch (error) { showToast(error.message || "Network error while loading your items.", "error"); }
    finally { setLoading(false); }
  };

  const loadBorrowedRequests = async () => {
    const user = getUser(); if (!user?.email) return navigate("/login");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/borrower/${encodeURIComponent(user.email)}`); const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load requests.");
      setBorrowedRequests(data.requests || []); setLoadedTabs(prev => ({ ...prev, borrowed: true }));
    } catch (error) { showToast(error.message || "Network error while loading requests.", "error"); }
    finally { setLoading(false); }
  };

  const loadOwnerRequests = async () => {
    const user = getUser(); if (!user?.email) return navigate("/login");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/owner/${encodeURIComponent(user.email)}`); const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load incoming requests.");
      setOwnerRequests(data.requests || []); setLoadedTabs(prev => ({ ...prev, requests: true }));
    } catch (error) { showToast(error.message || "Network error while loading requests.", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadListedItems(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const handleTab = tab => { setActiveTab(tab); if (loadedTabs[tab]) return; if (tab === "borrowed") loadBorrowedRequests(); if (tab === "requests") loadOwnerRequests(); };

  const processRequest = async (requestId, action) => {
    if (actionId) return; setActionId(requestId); showToast(action === "approve" ? "Approving request…" : action === "reject" ? "Rejecting request…" : "Updating request…", "info");
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/${requestId}/${action}`, { method: "PUT" }); const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to process request.");
      setOwnerRequests(prev => prev.map(request => request._id === requestId ? { ...request, ...data.request } : request));
      if (action === "approve") setItems(prev => prev.map(item => item._id === data.request?.item ? { ...item, status: "Borrowed" } : item));
      showToast(data.message || "Request updated successfully.", "success");
    } catch (error) { showToast(error.message || "Network error. Please try again.", "error"); }
    finally { setActionId(""); }
  };

  const statusClass = status => (status || "Pending").toLowerCase().replace(/\s+/g, "-");

  const renderListed = () => <section className="myitems-list">{loading && !loadedTabs.listed ? <div className="myitems-empty">Loading your listed items…</div> : items.length === 0 ? <div className="myitems-empty"><h3>No listed items yet</h3><p>Share your first item with the campus community.</p><button onClick={() => navigate("/list-item")}>+ List an Item</button></div> : items.map(item => <article className="myitem-card" key={item._id}><div className="myitem-image">{item.imageUrl ? <img src={`${API_URL}${item.imageUrl}`} alt={item.title} /> : <span>◇</span>}</div><div className="myitem-content"><div className="myitem-main"><span className="myitem-category">{item.category} · {item.listingType === "sale" ? "SALE" : "RENT"}</span><h2>{item.title}</h2><p>₹{item.price} {item.listingType === "sale" ? "total" : "/ day"}</p></div><span className={`myitem-status ${statusClass(item.status)}`}>● {item.status || "Available"}</span></div><button className="myitem-more" onClick={() => navigate(`/item-details/${item._id}`)}>→</button></article>)}</section>;

  const renderBorrowed = () => <section className="myitems-list">{loading && !loadedTabs.borrowed ? <div className="myitems-empty">Loading your requests…</div> : borrowedRequests.length === 0 ? <div className="myitems-empty"><h3>No requests yet</h3><p>Browse the marketplace and request an item you need.</p><button onClick={() => navigate("/browse")}>Browse Items →</button></div> : borrowedRequests.map(request => <article className="myitem-card" key={request._id}><div className="myitem-image"><span>{request.requestType === "Purchase" ? "$" : "◇"}</span></div><div className="myitem-content"><div className="myitem-main"><span className="myitem-category">{request.requestType === "Purchase" ? "Purchase enquiry" : "Borrow request"}{request.urgency === "Urgent" ? " · Urgent" : ""}</span><h2>{request.itemTitle}</h2><p>{request.requestType === "Purchase" ? `₹${request.itemPrice} total · Owner: ${request.owner}` : `₹${request.itemPrice} / day · ${request.startDate} → ${request.endDate}`}</p></div><span className={`myitem-status ${statusClass(request.status)}`}>● {request.status}</span></div></article>)}</section>;

  const renderRequests = () => <section className="myitems-list">{loading && !loadedTabs.requests ? <div className="myitems-empty">Loading incoming requests…</div> : ownerRequests.length === 0 ? <div className="myitems-empty"><h3>No requests received</h3><p>Requests from students will appear here.</p></div> : ownerRequests.map(request => <article className="myitem-card request-card" key={request._id}><div className="myitem-image"><span>{request.requestType === "Purchase" ? "$" : "◇"}</span></div><div className="myitem-content"><div className="myitem-main"><span className="myitem-category">{request.requestType === "Purchase" ? "Purchase enquiry" : "Borrow request"}{request.urgency === "Urgent" ? " · Urgent" : ""}</span><h2>{request.itemTitle}</h2><p><strong>{request.borrower}</strong> · {request.requestType === "Purchase" ? `₹${request.itemPrice} total` : `${request.startDate} → ${request.endDate}`}</p>{request.message && <p>“{request.message}”</p>}</div><span className={`myitem-status ${statusClass(request.status)}`}>● {request.status}</span></div>{request.status === "Pending" && <div className="request-actions"><button disabled={!!actionId} onClick={() => processRequest(request._id, "reject")} className="request-reject">{actionId === request._id ? "Working…" : "Reject"}</button><button disabled={!!actionId} onClick={() => processRequest(request._id, "approve")} className="request-approve">{actionId === request._id ? "Working…" : "Approve"}</button></div>}{request.requestType === "Borrow" && request.status === "Approved" && <div className="request-actions"><button disabled={!!actionId} onClick={() => processRequest(request._id, "return")} className="request-approve">{actionId === request._id ? "Working…" : "Mark Returned"}</button></div>}</article>)}</section>;

  return <div className="myitems-page"><Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} /><header className="myitems-header"><div className="myitems-brand" onClick={() => navigate("/home")}><div className="myitems-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div><button className="myitems-back" onClick={() => navigate("/home")}>← Back</button></header><main className="myitems-container"><div className="myitems-heading"><span>MY ACTIVITY</span><h1>My Items</h1><p>Manage what you list, request and approve.</p></div><div className="myitems-tabs"><button className={activeTab === "listed" ? "active" : ""} onClick={() => handleTab("listed")}>Listed Items <span>{items.length}</span></button><button className={activeTab === "borrowed" ? "active" : ""} onClick={() => handleTab("borrowed")}>My Requests <span>{borrowedRequests.length}</span></button><button className={activeTab === "requests" ? "active" : ""} onClick={() => handleTab("requests")}>Requests Received <span>{ownerRequests.filter(r => r.status === "Pending").length}</span></button></div>{activeTab === "listed" && renderListed()}{activeTab === "borrowed" && renderBorrowed()}{activeTab === "requests" && renderRequests()}<div className="myitems-add"><div><strong>Have something useful?</strong><p>Share it with students on your campus.</p></div><button onClick={() => navigate("/list-item")}>+ List an Item</button></div></main></div>;
}
export default MyItems;
