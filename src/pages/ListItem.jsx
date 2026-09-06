import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListItem.css";

function ListItem() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [displayStyle, setDisplayStyle] = useState("square");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    condition: "",
    availability: "",
  });

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setImageFile(file);
    setMessage("");
  };

  // =========================
  // CLEAN IMAGE URL
  // =========================

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Check image
    if (!imageFile) {
      setMessage("Please upload an item photo.");
      return;
    }

    // Check fields
    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.price ||
      !formData.description.trim() ||
      !formData.condition ||
      !formData.availability
    ) {
      setMessage("Please fill in all item details.");
      return;
    }

    setLoading(true);

    try {
      // Get logged-in user
      const storedUser = localStorage.getItem("borrowBoxUser");

      let user = null;

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (error) {
          console.error("Invalid user data");
        }
      }

      // =========================
      // FORM DATA
      // =========================

      const data = new FormData();

      data.append("image", imageFile);

      data.append("title", formData.name.trim());
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append(
        "description",
        formData.description.trim()
      );
      data.append("condition", formData.condition);
      data.append(
        "availability",
        formData.availability
      );

      data.append(
        "displayStyle",
        displayStyle
      );

      data.append(
        "owner",
        user?.nickname || "Student"
      );

      data.append(
        "ownerEmail",
        user?.email || ""
      );

      // =========================
      // SEND TO BACKEND
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/items",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || "Unable to list item."
        );

        setLoading(false);
        return;
      }

      // =========================
      // SUCCESS
      // =========================

      setMessage(
        "✓ Successfully listed your item on the marketplace!"
      );

      // Automatically go to Browse
      setTimeout(() => {
        navigate("/browse", {
          replace: true,
        });
      }, 1500);

    } catch (error) {
      console.error("List item error:", error);

      setMessage(
        "Cannot connect to Borrow Box server. Make sure backend is running."
      );

      setLoading(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    navigate("/browse");
  };

  return (
    <div className="list-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="list-header">

        <div
          className="list-brand"
          onClick={() => navigate("/home")}
        >

          <div className="list-logo">
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
          className="back-btn"
          onClick={handleCancel}
        >
          ← Back
        </button>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="list-container">

        {/* TITLE */}

        <div className="list-title">

          <span>
            SELL / SHARE
          </span>

          <h1>
            List an Item
          </h1>

          <p>
            Share something useful with students on your campus.
          </p>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="list-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              ITEM PHOTO
          ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <div>
                <h2>
                  Item Photo
                </h2>

                <p className="section-desc">
                  Upload a clear photo and choose the best frame.
                </p>
              </div>

              <span className="required-text">
                Required
              </span>

            </div>


            {/* FRAME OPTIONS */}

            <div className="frame-section">

              <label>
                Image Display
              </label>

              <div className="frame-options">

                <button
                  type="button"
                  className={
                    displayStyle === "square"
                      ? "frame-option selected"
                      : "frame-option"
                  }
                  onClick={() =>
                    setDisplayStyle("square")
                  }
                >
                  <strong>
                    Square
                  </strong>

                  <span>
                    1:1
                  </span>

                  <small>
                    General
                  </small>
                </button>


                <button
                  type="button"
                  className={
                    displayStyle === "portrait"
                      ? "frame-option selected"
                      : "frame-option"
                  }
                  onClick={() =>
                    setDisplayStyle("portrait")
                  }
                >
                  <strong>
                    Portrait
                  </strong>

                  <span>
                    4:5
                  </span>

                  <small>
                    Books / Mobile
                  </small>
                </button>


                <button
                  type="button"
                  className={
                    displayStyle === "landscape"
                      ? "frame-option selected"
                      : "frame-option"
                  }
                  onClick={() =>
                    setDisplayStyle("landscape")
                  }
                >
                  <strong>
                    Landscape
                  </strong>

                  <span>
                    16:10
                  </span>

                  <small>
                    Laptop / Monitor
                  </small>
                </button>

              </div>

            </div>


            {/* IMAGE UPLOAD */}

            <label
              className={`image-upload ${displayStyle} ${
                image ? "has-image" : ""
              }`}
            >

              {image ? (

                <div className="image-preview">

                  <img
                    src={image}
                    alt="Item preview"
                  />

                  <div className="image-overlay">
                    <span>
                      Change Image
                    </span>
                  </div>

                </div>

              ) : (

                <div className="upload-placeholder">

                  <div className="upload-icon">
                    +
                  </div>

                  <strong>
                    Upload item image
                  </strong>

                  <span>
                    PNG, JPG or JPEG
                  </span>

                  <small>
                    Maximum size 5 MB
                  </small>

                </div>

              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImage}
              />

            </label>

          </section>


          {/* =========================
              ITEM DETAILS
          ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <div>

                <h2>
                  Item Details
                </h2>

                <p className="section-desc">
                  Provide accurate information about your item.
                </p>

              </div>

            </div>


            <div className="form-grid">

              {/* ITEM NAME */}

              <div className="input-group full">

                <label htmlFor="name">
                  Item name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Eg. Scientific Calculator"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="input-group">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Books">
                    Books
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Notes">
                    Notes
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Others">
                    Others
                  </option>

                </select>

              </div>


              {/* PRICE */}

              <div className="input-group">

                <label htmlFor="price">
                  Price per day
                </label>

                <div className="price-input">

                  <span>
                    ₹
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="input-group full">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  placeholder="Describe your item, its condition and anything the borrower should know..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* CONDITION */}

              <div className="input-group">

                <label htmlFor="condition">
                  Condition
                </label>

                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select condition
                  </option>

                  <option value="New">
                    New
                  </option>

                  <option value="Like New">
                    Like New
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                </select>

              </div>


              {/* AVAILABILITY */}

              <div className="input-group">

                <label htmlFor="availability">
                  Availability
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select availability
                  </option>

                  <option value="Available now">
                    Available now
                  </option>

                  <option value="Available from tomorrow">
                    Available from tomorrow
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* =========================
              MESSAGE
          ========================= */}

          {message && (

            <div
              className={
                message.startsWith("✓")
                  ? "list-message success"
                  : "list-message error"
              }
            >
              {message}
            </div>

          )}


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >

              {loading
                ? "Listing Item..."
                : "List Item"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default ListItem;