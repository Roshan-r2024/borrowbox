import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "./Toast";
import "./BorrowRequest.css";

const API_URL = "http://localhost:5000";

function BorrowRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items/${id}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to load item.");
        setItem(data.item);
      } catch (error) {
        setToast({ message: error.message || "Cannot connect to server.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("borrowBoxUser") || "null"); }
    catch { return null; }
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    if (sending) return;
    const user = getUser();
    if (!user?.email) return navigate("/login");
    const isSale = item.listingType === "sale";
    if (!isSale && (!startDate || !endDate)) return setToast({ message: "Please select both dates.", type: "error" });
    if (!isSale && endDate < startDate) return setToast({ message: "Return date cannot be before borrow date.", type: "error" });

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/borrow-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item._id,
          borrower: user.nickname || "Student",
          borrowerEmail: user.email,
          startDate: isSale ? null : startDate,
          endDate: isSale ? null : endDate,
          message,
          urgency,
          requestType: isSale ? "Purchase" : "Borrow",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to send request.");
      setSubmitted(true);
      setToast({ message: isSale ? "Purchase enquiry sent successfully." : "Borrow request sent successfully.", type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Network error. Please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="borrow-page"><main className="borrow-success"><h1>Loading item...</h1></main></div>;
  if (!item) return <div className="borrow-page"><main className="borrow-success"><h1>Item unavailable</h1><button className="success-btn" onClick={() => navigate("/browse")}>← Back to Browse</button></main></div>;

  const isSale = item.listingType === "sale";
  const today = new Date().toISOString().split("T")[0];

  if (submitted) return (
    <div className="borrow-page">
      <header className="borrow-header"><div className="borrow-brand"><div className="borrow-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div></header>
      <main className="borrow-success">
        <div className="success-icon">✓</div>
        <span className="success-label">REQUEST SENT</span>
        <h1>{isSale ? "Purchase enquiry sent!" : "Borrow request sent!"}</h1>
        <p>Your request for <strong>{item.title}</strong> has been sent to {item.owner || "the owner"}.</p>
        <div className="borrow-success-actions"><button onClick={() => navigate(`/item-details/${item._id}`)} className="success-btn">← Back to item</button><button onClick={() => navigate("/my-items")} className="success-btn">View My Requests →</button></div>
      </main>
    </div>
  );

  return (
    <div className="borrow-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
      <header className="borrow-header"><div className="borrow-brand"><div className="borrow-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div><button className="borrow-back" onClick={() => navigate(`/item-details/${item._id}`)}>← Back to item</button></header>
      <main className="borrow-container">
        <div className="borrow-heading"><span>{isSale ? "PURCHASE ENQUIRY" : "BORROW REQUEST"}</span><h1>{isSale ? "Place an order" : "Request this item"}</h1><p>{isSale ? "Send the owner a purchase enquiry." : "Choose when you need the item and send a request to the owner."}</p></div>
        <div className="borrow-layout">
          <section className="borrow-item">
            <div className="borrow-item-image">{item.imageUrl ? <img src={`${API_URL}${item.imageUrl}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "◇"}</div>
            <div className="borrow-item-info"><span>{item.category}</span><h2>{item.title}</h2><p>Listed by {item.owner || "Student"}</p><div className="borrow-item-price"><strong>₹{item.price}</strong><small>{isSale ? " total" : " / day"}</small></div></div>
          </section>
          <form className="borrow-form" onSubmit={submitRequest}>
            <div className="borrow-section"><h2>{isSale ? "Order details" : "Borrow details"}</h2><p className="borrow-description">{isSale ? "Add an optional message for the owner." : "Tell the owner when you need the item."}</p>
              {!isSale && <><div className="borrow-input"><label>Borrow from</label><input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)} required /></div><div className="borrow-input"><label>Return date</label><input type="date" min={startDate || today} value={endDate} onChange={e => setEndDate(e.target.value)} required /></div><div className="borrow-input"><label>Urgency</label><select value={urgency} onChange={e => setUrgency(e.target.value)}><option>Normal</option><option>Urgent</option></select></div></>}
              <div className="borrow-input"><label>Message to owner</label><textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder={isSale ? "Hi, I am interested in buying this item. When can I collect it?" : "Hi, I need this item for my upcoming exam..."} /></div>
            </div>
            <div className="borrow-summary"><div><span>Item</span><strong>{item.title}</strong></div><div><span>Price</span><strong>₹{item.price}{isSale ? " total" : " / day"}</strong></div><div><span>Owner</span><strong>{item.owner || "Student"}</strong></div></div>
            <button type="submit" className="borrow-submit" disabled={sending}>{sending ? "Sending…" : isSale ? "Send Purchase Enquiry →" : "Send Borrow Request →"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BorrowRequest;
