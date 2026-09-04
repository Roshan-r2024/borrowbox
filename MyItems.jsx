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

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("borrowBoxUser") || "null");
    } catch {
      return null;
    }
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  const loadListedItems = async () => {
    const user = getUser();
    if (!user?.email) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/items`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load items.");

      const allItems = Array.isArray(data) ? data : data.items || [];
      setItems(allItems.filter((item) => (item.ownerEmail || "").toLowerCase() === user.email.toLowerCase()));
      setLoadedTabs((prev) => ({ ...prev, listed: true }));
    } catch (error) {
      showToast(error.message || "Network error while loading your items.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadBorrowedRequests = async () => {
    const user = getUser();
    if (!user?.email) return navigate("/login");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/borrower/${encodeURIComponent(user.email)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load borrowed items.");
      setBorrowedRequests(data.requests || []);
      setLoadedTabs((prev) => ({ ...prev, borrowed: true }));
    } catch (error) {
      showToast(error.message || "Network error while loading borrow requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOwnerRequests = async () => {
    const user = getUser();
    if (!user?.email) return navigate("/login");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/owner/${encodeURIComponent(user.email)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load incoming requests.");
      setOwnerRequests(data.requests || []);
      setLoadedTabs((prev) => ({ ...prev, requests: true }));
    } catch (error) {
      showToast(error.message || "Network error while loading requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListedItems();
    // One initial API call only. Other tabs load only when opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTab = (tab) => {
    setActiveTab(tab);
    if (loadedTabs[tab]) return;
    if (tab === "borrowed") loadBorrowedRequests();
    if (tab === "requests") loadOwnerRequests();
  };

  const processRequest = async (requestId, action) => {
    if (actionId) return;
    setActionId(requestId);
    showToast(action === "approve" ? "Approving request…" : "Rejecting request…", "info");

    const slowTimer = setTimeout(() => showToast("Action is taking longer than usual. Please wait…", "info"), 3500);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(`${API_URL}/api/borrow-requests/${requestId}/${action}`, {
        method: "PUT",
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Unable to ${action} request.`);

      setOwnerRequests((prev) =>
        prev.map((request) => (request._id === requestId ? { ...request, ...data.request } : request))
      );

      showToast(
        action === "approve"
          ? "Request approved. The item is now marked as borrowed."
          : "Borrow request rejected successfully.",
        "success"
      );

      if (action === "approve") {
        setItems((prev) => prev.map((item) => (item._id === data.request?.item ? { ...item, status: "Borrowed" } : item)));
      }
    } catch (error) {
      showToast(
        error.name === "AbortError"
          ? "Action timed out. Please check your connection and try again."
          : error.message || "Network error. Please try again.",
        "error"
      );
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(timeout);
      setActionId("");
    }
  };

  const statusClass = (status) => (status || "Pending").toLowerCase().replace(/\s+/g, "-");

  const renderListed = () => (
    <section className="myitems-list">
      {loading && !loadedTabs.listed ? (
        <div className="myitems-empty">Loading your listed items…</div>
      ) : items.length === 0 ? (
        <div className="myitems-empty">You haven't listed any items yet.</div>
      ) : (
        items.map((item) => (
          <article className="myitem-card" key={item._id}>
            <div className="myitem-image">
              {item.imageUrl ? <img src={`${API_URL}${item.imageUrl}`} alt={item.title} /> : <span>◇</span>}
            </div>
            <div className="myitem-content">
              <div className="myitem-main">
                <span className="myitem-category">{item.category}</span>
                <h2>{item.title}</h2>
                <p>₹{item.price} / day</p>
              </div>
              <span className={`myitem-status ${statusClass(item.status)}`}>● {item.status || "Available"}</span>
            </div>
            <button className="myitem-more" onClick={() => navigate(`/item-details/${item._id}`)} aria-label={`View ${item.title}`}>→</button>
          </article>
        ))
      )}
    </section>
  );

  const renderBorrowed = () => (
    <section className="myitems-list">
      {loading && !loadedTabs.borrowed ? (
        <div className="myitems-empty">Loading your borrow requests…</div>
      ) : borrowedRequests.length === 0 ? (
        <div className="myitems-empty">You haven't requested any items yet.</div>
      ) : (
        borrowedRequests.map((request) => (
          <article className="myitem-card" key={request._id}>
            <div className="myitem-image"><span>◇</span></div>
            <div className="myitem-content">
              <div className="myitem-main">
                <span className="myitem-category">{request.itemTitle}</span>
                <h2>{request.owner}</h2>
                <p>₹{request.itemPrice} / day · {request.startDate} → {request.endDate}</p>
              </div>
              <span className={`myitem-status ${statusClass(request.status)}`}>● {request.status}</span>
            </div>
          </article>
        ))
      )}
    </section>
  );

  const renderRequests = () => (
    <section className="myitems-list">
      {loading && !loadedTabs.requests ? (
        <div className="myitems-empty">Loading incoming requests…</div>
      ) : ownerRequests.length === 0 ? (
        <div className="myitems-empty">No borrow requests received yet.</div>
      ) : (
        ownerRequests.map((request) => (
          <article className="myitem-card request-card" key={request._id}>
            <div className="myitem-image"><span>◇</span></div>
            <div className="myitem-content">
              <div className="myitem-main">
                <span className="myitem-category">Borrow request</span>
                <h2>{request.itemTitle}</h2>
                <p><strong>{request.borrower}</strong> · {request.startDate} → {request.endDate}</p>
                {request.message && <p>“{request.message}”</p>}
              </div>
              <span className={`myitem-status ${statusClass(request.status)}`}>● {request.status}</span>
            </div>
            {request.status === "Pending" && (
              <div className="request-actions">
                <button disabled={!!actionId} onClick={() => processRequest(request._id, "reject")} className="request-reject">
                  {actionId === request._id ? "Working…" : "Reject"}
                </button>
                <button disabled={!!actionId} onClick={() => processRequest(request._id, "approve")} className="request-approve">
                  {actionId === request._id ? "Working…" : "Approve"}
                </button>
              </div>
            )}
          </article>
        ))
      )}
    </section>
  );

  return (
    <div className="myitems-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
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
          <h1>My Items</h1>
          <p>Manage the items you share, borrow and approve.</p>
        </div>

        <div className="myitems-tabs">
          <button className={activeTab === "listed" ? "active" : ""} onClick={() => handleTab("listed")}>Listed Items <span>{items.length}</span></button>
          <button className={activeTab === "borrowed" ? "active" : ""} onClick={() => handleTab("borrowed")}>My Requests <span>{borrowedRequests.length}</span></button>
          <button className={activeTab === "requests" ? "active" : ""} onClick={() => handleTab("requests")}>Requests Received <span>{ownerRequests.filter((r) => r.status === "Pending").length}</span></button>
        </div>

        {activeTab === "listed" && renderListed()}
        {activeTab === "borrowed" && renderBorrowed()}
        {activeTab === "requests" && renderRequests()}

        <div className="myitems-add">
          <div><strong>Have something useful?</strong><p>Share it with students on your campus.</p></div>
          <button onClick={() => navigate("/list-item")}>+ List an Item</button>
        </div>
      </main>
    </div>
  );
}

export default MyItems;
