import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemDetails.css";
import Toast from "./Toast";

const API_URL = "http://localhost:5000";

function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items/${id}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to load item.");
        setItem(data.item);
      } catch (error) {
        setToast({ message: error.message || "Cannot connect to server.", type: "error" });
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const imageUrl = (url) => !url ? "" : url.startsWith("http") ? url : `${API_URL}${url}`;

  const sendBorrowRequest = async (e) => {
    e.preventDefault();
    if (sending) return;
    const stored = localStorage.getItem("borrowBoxUser");
    let user = null;
    try { user = stored ? JSON.parse(stored) : null; } catch {}
    if (!user?.email) { navigate("/login"); return; }
    if (!startDate || !endDate) { setToast({ message: "Please select both dates.", type: "error" }); return; }
    if (endDate < startDate) { setToast({ message: "Return date cannot be before borrow date.", type: "error" }); return; }

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item._id, borrower: user.nickname || "Student", borrowerEmail: user.email, startDate, endDate, message, urgency }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to send request.");
      setSuccess(true);
      setToast({ message: `Borrow request sent (${urgency}).`, type: "success" });
    } catch (error) { setToast({ message: error.message || "Network error. Please try again.", type: "error" }); }
    finally { setSending(false); }
  };

  const handleSaleRequest = async () => {
    const stored = localStorage.getItem("borrowBoxUser");
    let user = null;
    try { user = stored ? JSON.parse(stored) : null; } catch {}
    if (!user?.email) { navigate("/login"); return; }
    setToast({ message: "Sale enquiries are not available yet.", type: "info" });
  };

  if (loading) return <div className="item-details-page"><div className="item-details-loading"><div className="details-spinner"></div><p>Loading item...</p></div></div>;
  if (!item) return <div className="item-details-page"><div className="item-details-error"><h2>Item unavailable</h2><button onClick={() => navigate("/browse")}>← Back to Browse</button></div></div>;

  const isSale = item.listingType === "sale";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="item-details-page">
      <header className="details-navbar"><div className="details-nav-container"><div className="details-brand" onClick={() => navigate("/home")}><div className="details-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div><button onClick={() => navigate("/browse")} className="back-browse">← Browse Items</button></div></header>
      <main className="item-details-container"><div className="details-layout">
        <section className="details-image-section"><div className={`details-image ${item.displayStyle || "square"}`}>{item.imageUrl ? <img src={imageUrl(item.imageUrl)} alt={item.title} /> : <div>No Image</div>}</div></section>
        <section className="details-info">
          <div className="details-topline"><span className="details-category">{item.category}</span><span className="details-type">{isSale ? "SALE" : "RENT"}</span></div>
          <h1>{item.title}</h1>
          <div className="details-price"><strong>₹{item.price}</strong><span>{isSale ? "total" : "/ day"}</span></div>
          <div className="details-status"><span>●</span>{item.status || "Available"}</div>
          <div className="details-divider"></div>
          <div className="details-description"><h3>Description</h3><p>{item.description}</p></div>
          <div className="details-owner"><div className="details-owner-avatar">{(item.owner || "S").charAt(0).toUpperCase()}</div><div><span>Owned by</span><strong>{item.owner || "Student"}</strong></div></div>

          {isSale ? (
            <div className="borrow-request-box"><div className="borrow-request-heading"><h2>Interested in this item?</h2><p>Send the owner an enquiry about purchasing this item.</p></div><button className="send-request-btn" onClick={handleSaleRequest}>Contact Owner →</button><p className="request-note">Sale listings are displayed with the owner's contact flow.</p></div>
          ) : (
            <div className="borrow-request-box"><div className="borrow-request-heading"><h2>Borrow this item</h2><p>Select dates, urgency and an optional message.</p></div>
              {success ? <div className="request-success"><div className="success-icon">✓</div><div><strong>Request Sent</strong><p>The owner will review your {urgency.toLowerCase()} request.</p></div></div> : <form onSubmit={sendBorrowRequest}>
                <div className="date-row"><div className="date-field"><label>Borrow From</label><input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} required /></div><div className="date-field"><label>Return By</label><input type="date" value={endDate} min={startDate || today} onChange={e => setEndDate(e.target.value)} required /></div></div>
                <div className="urgency-field"><label>Choose an option you need</label><div className="urgency-options"><button type="button" className={urgency === "Normal" ? "urgency-option selected" : "urgency-option"} onClick={() => setUrgency("Normal")}><strong>Normal</strong><span>Regular request</span></button><button type="button" className={urgency === "Urgent" ? "urgency-option selected urgent" : "urgency-option"} onClick={() => setUrgency("Urgent")}><strong>Urgent</strong><span>Need it quickly</span></button></div></div>
                <div className="message-field"><label>Message <span>Optional</span></label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell the owner why you need this item..." rows="4" /></div>
                <button type="submit" className="send-request-btn" disabled={sending}>{sending ? "Sending Request..." : "Borrow Item →"}</button><p className="request-note">Your request will be sent to the item owner for approval.</p>
              </form>}
            </div>
          )}
        </section>
      </div></main>
    </div>
  );
}
export default ItemDetails;
