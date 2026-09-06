import React, { useState } from "react";
import "./BorrowRequest.css";

function BorrowRequest() {
  const [submitted, setSubmitted] = useState(false);

  const item = {
    title: "Scientific Calculator",
    category: "Electronics",
    price: 20,
    owner: "Karthik",
    icon: "🧮",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="borrow-page">
        <header className="borrow-header">
          <div className="borrow-brand">
            <div className="borrow-logo">◇</div>
            <div>
              <strong>Borrow Box</strong>
              <span>Campus sharing</span>
            </div>
          </div>
        </header>

        <main className="borrow-success">

          <div className="success-icon">✓</div>

          <span className="success-label">
            REQUEST SENT
          </span>

          <h1>Borrow request sent!</h1>

          <p>
            Your request for <strong>{item.title}</strong> has
            been sent to {item.owner}.
          </p>

          <button
            onClick={() => window.history.back()}
            className="success-btn"
          >
            ← Back to item
          </button>

        </main>
      </div>
    );
  }

  return (
    <div className="borrow-page">

      {/* HEADER */}

      <header className="borrow-header">

        <div className="borrow-brand">

          <div className="borrow-logo">
            ◇
          </div>

          <div>
            <strong>Borrow Box</strong>
            <span>Campus sharing</span>
          </div>

        </div>

        <button
          className="borrow-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

      </header>


      {/* MAIN */}

      <main className="borrow-container">

        <div className="borrow-heading">

          <span>BORROW REQUEST</span>

          <h1>Request an item</h1>

          <p>
            Send a request to the item owner.
          </p>

        </div>


        <div className="borrow-layout">

          {/* ITEM SUMMARY */}

          <section className="borrow-item">

            <div className="borrow-item-image">
              {item.icon}
            </div>

            <div className="borrow-item-info">

              <span>{item.category}</span>

              <h2>{item.title}</h2>

              <p>
                Listed by {item.owner}
              </p>

              <div className="borrow-item-price">
                <strong>₹{item.price}</strong>
                <small>/ day</small>
              </div>

            </div>

          </section>


          {/* FORM */}

          <form
            className="borrow-form"
            onSubmit={handleSubmit}
          >

            <div className="borrow-section">

              <h2>Borrow details</h2>

              <p className="borrow-description">
                Tell the owner when you need the item.
              </p>


              <div className="borrow-input">

                <label>Borrow from</label>

                <input
                  type="date"
                  required
                />

              </div>


              <div className="borrow-input">

                <label>Return date</label>

                <input
                  type="date"
                  required
                />

              </div>


              <div className="borrow-input">

                <label>Message to owner</label>

                <textarea
                  rows="5"
                  placeholder="Hi, I need this item for my upcoming exam..."
                />

              </div>

            </div>


            {/* SUMMARY */}

            <div className="borrow-summary">

              <div>
                <span>Item</span>
                <strong>{item.title}</strong>
              </div>

              <div>
                <span>Rate</span>
                <strong>₹{item.price} / day</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Request pending</strong>
              </div>

            </div>


            <button
              type="submit"
              className="borrow-submit"
            >
              Send Borrow Request
              <span>→</span>
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default BorrowRequest;