import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css";
import "./BrowseActions.css";

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
      const allItems = response.ok ? (Array.isArray(data) ? data : data.items || []) : [];
      setItems(allItems.filter(item => item.ownerEmail && item.ownerEmail.trim()));
    } catch (error) {
      console.error("Error loading items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const getImageUrl = (url) => !url ? "" : url.startsWith("http") ? url : `${API_URL}${url}`;
  const openDetails = (id) => id && navigate(`/item-details/${id}`);
  const placeOrder = (id) => id && navigate(`/borrow-request/${id}`);

  const contactWhatsApp = (item) => {
    const phone = item.ownerPhone || item.phone || item.whatsapp || "";
    if (!phone) {
      window.alert("This owner has not added a WhatsApp number yet. Please use View Details to contact them another way.");
      return;
    }
    const digits = String(phone).replace(/\D/g, "");
    if (digits.length < 10) {
      window.alert("The owner's saved phone number is not valid for WhatsApp.");
      return;
    }
    const message = encodeURIComponent(`Hi ${item.owner || ""}, I found your ${item.title} on Borrow Box. I need it urgently. Is it available?`);
    window.open(`https://wa.me/${digits}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const filteredItems = items.filter(item => {
    const text = `${item.title || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (category === "All" || item.category === category);
  });

  return (
    <div className="browse-page">
      <header className="browse-navbar"><div className="browse-nav-container">
        <div className="browse-brand" onClick={() => navigate("/home")}><div className="browse-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div>
        <nav><button onClick={() => navigate("/home")}>Home</button><button className="active" onClick={() => navigate("/browse")}>Browse</button><button onClick={() => navigate("/my-items")}>My Items</button></nav>
        <button className="browse-list-btn" onClick={() => navigate("/list-item")}>+ List an Item</button>
      </div></header>

      <main className="browse-container">
        <section className="browse-header"><div><span className="browse-label">CAMPUS MARKETPLACE</span><h1>Browse Items</h1><p>Find useful items shared by students on your campus.</p></div></section>
        <section className="browse-search"><div className="browse-search-box"><span>⌕</span><input type="text" placeholder="Search for books, electronics, notes..." value={search} onChange={e => setSearch(e.target.value)} />{search && <button onClick={() => setSearch("")}>×</button>}</div></section>
        <section className="browse-filters"><div className="filter-title">Categories</div><div className="category-buttons">{categories.map(c => <button key={c} className={category === c ? "selected" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div></section>
        <div className="browse-result"><strong>{filteredItems.length} items</strong><span>Available for borrowing</span></div>

        {loading ? <div className="no-results"><div className="loading-spinner"></div><h2>Loading items...</h2></div> : filteredItems.length ? (
          <section className="browse-grid">
            {filteredItems.map(item => (
              <article className="browse-card" key={item._id}>
                <div className={`browse-image ${item.displayStyle || "square"}`}>
                  {item.imageUrl ? <img className="browse-product-image" src={getImageUrl(item.imageUrl)} alt={item.title} /> : <div className="browse-no-image">No Image</div>}
                  <span className="available">{item.status || "Available"}</span>
                </div>
                <div className="browse-card-content">
                  <div className="card-topline"><span className="card-category">{item.category}</span><span className="card-type">{item.listingType === "sale" ? "SALE" : "RENT"}</span></div>
                  <h2>{item.title}</h2><p className="card-description">{item.description || "No description provided."}</p>
                  <div className="owner"><div className="owner-avatar">{(item.owner || "S").charAt(0).toUpperCase()}</div><span>Owned by <strong>{item.owner || "Student"}</strong></span></div>
                  <div className="card-footer"><div className="price"><strong>₹{item.price}</strong><span>{item.listingType === "sale" ? "total" : "/ day"}</span></div><div className="browse-actions"><button className="details-btn" onClick={() => openDetails(item._id)}>View Details</button><button className="borrow-btn" onClick={() => placeOrder(item._id)}>Place Order →</button></div></div>
                  <button className="urgent-whatsapp-btn" onClick={() => contactWhatsApp(item)}>Urgent? Contact on WhatsApp</button>
                </div>
              </article>
            ))}
          </section>
        ) : <div className="no-results"><div className="empty-icon">◇</div><h2>No items available yet</h2><p>No student has listed an item yet. Be the first to share something.</p><button onClick={() => navigate("/list-item")}>List Your First Item →</button></div>}
      </main>
    </div>
  );
}

export default Browse;
