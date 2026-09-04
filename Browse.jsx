import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css";

const API_URL = "http://localhost:5000";
const categories = ["All", "Books", "Electronics", "Notes", "Sports", "Others"];

function Browse() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/items`);
      const data = await response.json().catch(() => ({}));
      setItems(response.ok ? data.items || [] : []);
    } catch (error) {
      console.error("Error loading items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    return imageUrl.startsWith("http") ? imageUrl : `${API_URL}${imageUrl}`;
  };

  const filteredItems = items.filter((item) => {
    const text = `${item.title || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="browse-page">
      <header className="browse-navbar">
        <div className="browse-nav-container">
          <div className="browse-brand" onClick={() => navigate("/home")}>
            <div className="browse-logo">◇</div>
            <div><strong>Borrow Box</strong><span>Campus sharing</span></div>
          </div>

          <nav>
            <button onClick={() => navigate("/home")}>Home</button>
            <button className="active" onClick={() => navigate("/browse")}>Browse</button>
            <button onClick={() => navigate("/my-items")}>My Items</button>
          </nav>

          <button className="browse-list-btn" onClick={() => navigate("/list-item")}>
            + List an Item
          </button>
        </div>
      </header>

      <main className="browse-container">
        <section className="browse-header">
          <div>
            <span className="browse-label">CAMPUS MARKETPLACE</span>
            <h1>Browse Items</h1>
            <p>Find useful items shared by students on your campus.</p>
          </div>
        </section>

        <section className="browse-search">
          <div className="browse-search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search for books, electronics, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch("")}>×</button>}
          </div>
        </section>

        <section className="browse-filters">
          <div className="filter-title">Categories</div>
          <div className="category-buttons">
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                className={category === itemCategory ? "selected" : ""}
                onClick={() => setCategory(itemCategory)}
              >
                {itemCategory}
              </button>
            ))}
          </div>
        </section>

        <div className="browse-result">
          <strong>{filteredItems.length} items</strong>
          <span>Available for borrowing</span>
        </div>

        {loading ? (
          <div className="no-results"><h2>Loading items...</h2></div>
        ) : filteredItems.length > 0 ? (
          <section className="browse-grid">
            {filteredItems.map((item) => (
              <article className="browse-card" key={item._id}>
                <div className={`browse-image ${item.displayStyle || "square"}`}>
                  {item.imageUrl ? (
                    <img className="browse-product-image" src={getImageUrl(item.imageUrl)} alt={item.title} />
                  ) : (
                    <div className="browse-no-image">No Image</div>
                  )}
                  <span className="available">{item.status || "Available"}</span>
                </div>

                <div className="browse-card-content">
                  <span className="card-category">{item.category}</span>
                  <h2>{item.title}</h2>

                  <div className="owner">
                    <div className="owner-avatar">{(item.owner || "S").charAt(0).toUpperCase()}</div>
                    <span>Listed by <strong>{item.owner || "Student"}</strong></span>
                  </div>

                  <div className="card-footer">
                    <div className="price"><strong>₹{item.price}</strong><span>/ day</span></div>
                    <button className="borrow-btn" onClick={() => navigate(`/item-details/${item._id}`)}>
                      View & Borrow
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="no-results">
            <div className="empty-icon">◇</div>
            <h2>No items available yet</h2>
            <p>Be the first student to list an item on Borrow Box.</p>
            <button onClick={() => navigate("/list-item")}>List Your First Item →</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Browse;
