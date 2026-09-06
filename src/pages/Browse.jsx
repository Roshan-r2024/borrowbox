import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css";

const categories = [
  "All",
  "Books",
  "Electronics",
  "Notes",
  "Sports",
  "Others",
];

function Browse() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // =========================
  // GET ITEMS FROM MONGODB
  // =========================

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/items"
      );

      const data = await response.json();

      if (response.ok) {
        setItems(data.items || []);
      } else {
        setItems([]);
      }

    } catch (error) {
      console.error(
        "Error loading items:",
        error
      );

      setItems([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://localhost:5000${imageUrl}`;
  };


  // =========================
  // FILTER
  // =========================

  const filteredItems = items.filter((item) => {

    const title =
      item.title || "";

    const matchesSearch =
      title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });


  return (
    <div className="browse-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="browse-navbar">

        <div className="browse-nav-container">

          {/* BRAND */}

          <div
            className="browse-brand"
            onClick={() =>
              navigate("/home")
            }
          >

            <div className="browse-logo">
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


          {/* NAVIGATION */}

          <nav>

            <a href="/home">
              Home
            </a>

            <a
              className="active"
              href="/browse"
            >
              Browse
            </a>

            <a href="/my-items">
              My Items
            </a>

          </nav>


          {/* LIST BUTTON */}

          <button
            className="browse-list-btn"
            onClick={() =>
              navigate("/list-item")
            }
          >
            + List an Item
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="browse-container">


        {/* =========================
            PAGE HEADER
        ========================= */}

        <section className="browse-header">

          <div>

            <span className="browse-label">
              CAMPUS MARKETPLACE
            </span>

            <h1>
              Browse Items
            </h1>

            <p>
              Find useful items shared by
              students on your campus.
            </p>

          </div>

        </section>


        {/* =========================
            SEARCH
        ========================= */}

        <section className="browse-search">

          <div className="browse-search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search for books, electronics, notes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>

            )}

          </div>

        </section>


        {/* =========================
            CATEGORIES
        ========================= */}

        <section className="browse-filters">

          <div className="filter-title">
            Categories
          </div>

          <div className="category-buttons">

            {categories.map(
              (itemCategory) => (

                <button
                  key={itemCategory}
                  className={
                    category === itemCategory
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setCategory(
                      itemCategory
                    )
                  }
                >
                  {itemCategory}
                </button>

              )
            )}

          </div>

        </section>


        {/* =========================
            RESULT
        ========================= */}

        <div className="browse-result">

          <strong>
            {filteredItems.length} items
          </strong>

          <span>
            Available for borrowing
          </span>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="no-results">

            <h2>
              Loading items...
            </h2>

          </div>

        ) : filteredItems.length > 0 ? (


          /* =========================
             PRODUCT GRID
          ========================= */

          <section className="browse-grid">

            {filteredItems.map(
              (item) => (

                <article
                  className="browse-card"
                  key={item._id}
                >

                  {/* IMAGE */}

                  <div
                    className={`browse-image ${
                      item.displayStyle ||
                      "square"
                    }`}
                  >

                    {item.imageUrl ? (

                      <img
                        className="browse-product-image"
                        src={getImageUrl(
                          item.imageUrl
                        )}
                        alt={item.title}
                      />

                    ) : (

                      <div className="browse-no-image">
                        No Image
                      </div>

                    )}


                    <span className="available">
                      Available
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="browse-card-content">

                    <span className="card-category">
                      {item.category}
                    </span>


                    <h2>
                      {item.title}
                    </h2>


                    {/* OWNER */}

                    <div className="owner">

                      <div className="owner-avatar">

                        {(item.owner ||
                          "S")
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <span>
                        Listed by{" "}
                        <strong>
                          {item.owner ||
                            "Student"}
                        </strong>
                      </span>

                    </div>


                    {/* FOOTER */}

                    <div className="card-footer">

                      <div className="price">

                        <strong>
                          ₹{item.price}
                        </strong>

                        <span>
                          / day
                        </span>

                      </div>


                      <button
                        className="borrow-btn"
                        onClick={() =>
                          alert(
                            `${item.title} selected`
                          )
                        }
                      >
                        Borrow
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </section>


        ) : (


          /* =========================
             EMPTY STATE
          ========================= */

          <div className="no-results">

            <div className="empty-icon">
              ◇
            </div>

            <h2>
              No items available yet
            </h2>

            <p>
              Be the first student to list
              an item on Borrow Box.
            </p>

            <button
              onClick={() =>
                navigate("/list-item")
              }
            >
              List Your First Item →
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default Browse;