import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./ItemDetails.css";

const API_URL =
  "http://localhost:5000";


function ItemDetails() {

  const navigate = useNavigate();

  const { id } = useParams();


  const [item, setItem] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");


  /* =========================
     LOAD ITEM
  ========================= */

  useEffect(() => {

    const fetchItem = async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            `${API_URL}/api/items/${id}`
          );

        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
              "Unable to load item."
          );

          return;
        }


        setItem(data.item);

      } catch (err) {

        console.error(
          "Item loading error:",
          err
        );

        setError(
          "Cannot connect to Borrow Box server."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchItem();

  }, [id]);


  /* =========================
     IMAGE URL
  ========================= */

  const getImageUrl = (
    imageUrl
  ) => {

    if (!imageUrl) {
      return "";
    }

    if (
      imageUrl.startsWith("http")
    ) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };


  /* =========================
     SEND REQUEST
  ========================= */

  const handleBorrowRequest =
    async (e) => {

      e.preventDefault();

      setError("");
      setSuccess(false);


      if (
        !startDate ||
        !endDate
      ) {

        setError(
          "Please select both start and end dates."
        );

        return;
      }


      const storedUser =
        localStorage.getItem(
          "borrowBoxUser"
        );


      if (!storedUser) {

        navigate("/login");
        return;
      }


      let user;

      try {

        user =
          JSON.parse(storedUser);

      } catch {

        navigate("/login");
        return;
      }


      if (!user?.email) {

        navigate("/login");
        return;
      }


      const start =
        new Date(startDate);

      const end =
        new Date(endDate);


      if (end < start) {

        setError(
          "End date cannot be before start date."
        );

        return;
      }


      setSending(true);


      try {

        const response =
          await fetch(
            `${API_URL}/api/borrow-requests`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                itemId: item._id,

                borrower:
                  user.nickname ||
                  "Student",

                borrowerEmail:
                  user.email,

                startDate,

                endDate,

                message,
              }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
              "Unable to send borrow request."
          );

          return;
        }


        setSuccessMessage(
          "Borrow request sent successfully. The owner will review your request."
        );

        setSuccess(true);

        setStartDate("");
        setEndDate("");
        setMessage("");

      } catch (err) {

        console.error(
          "Borrow request error:",
          err
        );

        setError(
          "Cannot connect to Borrow Box server."
        );

      } finally {

        setSending(false);

      }
    };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <div className="item-details-page">

        <div className="item-details-loading">

          <div className="details-spinner"></div>

          <p>
            Loading item...
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error && !item) {

    return (
      <div className="item-details-page">

        <div className="item-details-error">

          <h2>
            Unable to load item
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/browse")
            }
          >
            ← Back to Browse
          </button>

        </div>

      </div>
    );
  }


  if (!item) {
    return null;
  }


  return (
    <div className="item-details-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="details-navbar">

        <div className="details-nav-container">

          <div
            className="details-brand"
            onClick={() =>
              navigate("/home")
            }
          >

            <div className="details-logo">
              ◇
            </div>

            <div>
              <strong>
                Borrow Box
              </strong>

              <span>
                Campus sharing
              </span>
            </div>

          </div>


          <button
            onClick={() =>
              navigate("/browse")
            }
            className="back-browse"
          >
            ← Browse Items
          </button>

        </div>

      </header>


      {/* =========================
          CONTENT
      ========================= */}

      <main className="item-details-container">

        <div className="details-layout">


          {/* =========================
              IMAGE
          ========================= */}

          <section className="details-image-section">

            <div
              className={`details-image ${
                item.displayStyle ||
                "square"
              }`}
            >

              {item.imageUrl ? (

                <img
                  src={getImageUrl(
                    item.imageUrl
                  )}
                  alt={item.title}
                />

              ) : (

                <div>
                  No Image
                </div>

              )}

            </div>

          </section>


          {/* =========================
              INFO
          ========================= */}

          <section className="details-info">

            <span className="details-category">
              {item.category}
            </span>


            <h1>
              {item.title}
            </h1>


            <div className="details-price">

              <strong>
                ₹{item.price}
              </strong>

              <span>
                / day
              </span>

            </div>


            <div className="details-status">
              <span>
                ●
              </span>

              {item.status ||
                "Available"}
            </div>


            <div className="details-divider"></div>


            <div className="details-description">

              <h3>
                About this item
              </h3>

              <p>
                {item.description}
              </p>

            </div>


            {/* OWNER */}

            <div className="details-owner">

              <div className="details-owner-avatar">
                {(item.owner ||
                  "S")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <span>
                  Listed by
                </span>

                <strong>
                  {item.owner ||
                    "Student"}
                </strong>

              </div>

            </div>


            {/* =========================
                BORROW BOX
            ========================= */}

            <div className="borrow-request-box">

              <div className="borrow-request-heading">

                <h2>
                  Request to Borrow
                </h2>

                <p>
                  Choose how long you
                  need this item.
                </p>

              </div>


              {success && (

                <div className="request-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Request Sent
                    </strong>

                    <p>
                      {successMessage}
                    </p>

                  </div>

                </div>

              )}


              {error && (

                <div className="request-error">
                  {error}
                </div>

              )}


              {!success && (

                <form
                  onSubmit={
                    handleBorrowRequest
                  }
                >

                  <div className="date-row">

                    <div className="date-field">

                      <label>
                        Borrow From
                      </label>

                      <input
                        type="date"
                        value={
                          startDate
                        }
                        onChange={(e) =>
                          setStartDate(
                            e.target.value
                          )
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                      />

                    </div>


                    <div className="date-field">

                      <label>
                        Return By
                      </label>

                      <input
                        type="date"
                        value={
                          endDate
                        }
                        onChange={(e) =>
                          setEndDate(
                            e.target.value
                          )
                        }
                        min={
                          startDate ||
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                      />

                    </div>

                  </div>


                  <div className="message-field">

                    <label>
                      Message
                      <span>
                        Optional
                      </span>
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) =>
                        setMessage(
                          e.target.value
                        )
                      }
                      placeholder="Tell the owner why you need this item..."
                      rows="4"
                    />

                  </div>


                  <button
                    type="submit"
                    className="send-request-btn"
                    disabled={sending}
                  >

                    {sending
                      ? "Sending Request..."
                      : "Send Borrow Request →"}

                  </button>


                  <p className="request-note">
                    Your request will be
                    sent to the item owner
                    for approval.
                  </p>

                </form>

              )}


              {success && (

                <button
                  className="back-after-success"
                  onClick={() =>
                    navigate("/browse")
                  }
                >
                  ← Continue Browsing
                </button>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default ItemDetails;