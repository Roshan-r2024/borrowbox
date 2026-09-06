import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BorrowRequest.css";

const API_URL = "http://localhost:5000";

function BorrowRequest() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No item was selected. Please choose an item from Browse.");
      setLoading(false);
      return;
    }

    const loadItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load item.");
        }

        setItem(data.item);
      } catch (err) {
        console.error("Borrow request item error:", err);
        setError(err.message || "Cannot connect to Borrow Box server.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    return imageUrl.startsWith("http") ? imageUrl : `${API_URL}${imageUrl}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const storedUser = localStorage.getItem("borrowBoxUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      navigate("/login");
      return;
    }

    if (!user?.email) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both borrow and return dates.");
      return;
    }

    if (endDate < startDate) {
      setError("Return date cannot be before the borrow date.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/borrow-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item._id,
          borrower: user.nickname || "Student",
          borrowerEmail: user.email,
          startDate,
          endDate,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send borrow request.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Borrow request error:", err);
      setError("Cannot connect to Borrow Box server.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="borrow-page">
        <main className="borrow-success">
          <h2>Loading item...</h2>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="borrow-page">
        <header className="borrow-header">
          <div className="borrow-brand">
            <div className="borrow-logo">◇</div>
            <div><strong>Borrow Box</strong><span>Campus sharing</span></div>
          </div>
        </header>

        <main className="borrow-success">
          <div className="success-icon">✓</div>
          <span className="success-label">REQUEST SENT</span>
          <h1>Borrow request sent!</h1>
          <p>
            Your request for <strong>{item?.title}</strong> has been sent to the owner.
          </p>
          <button onClick={() => navigate("/browse")} className="success-btn">
            ← Continue Browsing
          </button>
        </main>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="borrow-page">
        <main className="borrow-success">
          <h1>Unable to continue</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/browse")} className="success-btn">
            ← Back to Browse
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="borrow-page">
      <header className="borrow-header">
        <div className="borrow-brand">
          <div className="borrow-logo">◇</div>
          <div><strong>Borrow Box</strong><span>Campus sharing</span></div>
        </div>
        <button className="borrow-back" onClick={() => navigate(`/item-details/${item._id}`)}>
          ← Back to item
        </button>
      </header>

      <main className="borrow-container">
        <div className="borrow-heading">
          <span>BORROW REQUEST</span>
          <h1>Request an item</h1>
          <p>Choose your dates and send a request to the item owner.</p>
        </div>

        <div className="borrow-layout">
          <section className="borrow-item">
            <div className="borrow-item-image">
              {item.imageUrl ? (
                <img src={getImageUrl(item.imageUrl)} alt={item.title} />
              ) : (
                <span>◇</span>
              )}
            </div>
            <div className="borrow-item-info">
              <span>{item.category}</span>
              <h2>{item.title}</h2>
              <p>Listed by {item.owner || "Student"}</p>
              <div className="borrow-item-price">
                <strong>₹{item.price || 0}</strong>
                <small>/ day</small>
              </div>
            </div>
          </section>

          <form className="borrow-form" onSubmit={handleSubmit}>
            <div className="borrow-section">
              <h2>Borrow details</h2>
              <p className="borrow-description">Tell the owner when you need the item.</p>

              {error && <div className="request-error">{error}</div>}

              <div className="borrow-input">
                <label>Borrow from</label>
                <input type="date" required min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="borrow-input">
                <label>Return date</label>
                <input type="date" required min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <div className="borrow-input">
                <label>Message to owner</label>
                <textarea
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I need this item for my upcoming exam..."
                />
              </div>
            </div>

            <div className="borrow-summary">
              <div><span>Item</span><strong>{item.title}</strong></div>
              <div><span>Rate</span><strong>₹{item.price || 0} / day</strong></div>
              <div><span>Status</span><strong>{item.status || "Available"}</strong></div>
            </div>

            <button type="submit" className="borrow-submit" disabled={sending}>
              {sending ? "Sending Request..." : "Send Borrow Request"}
              <span>→</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BorrowRequest;
