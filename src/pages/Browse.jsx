import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css";
import "./BrowseActions.css";
import "./BrowseEnhancements.css";

const API_URL = "http://localhost:5000";
const categories = ["All", "Books", "Electronics", "Notes", "Sports", "Others"];

function Browse() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [listingFilter, setListingFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/items`).then(async (r) => {
      const data = await r.json();
      setItems(r.ok ? data.items || [] : []);
    }).catch((e) => { console.error(e); setItems([]); }).finally(() => setLoading(false));
  }, []);

  const getImageUrl = (url) => !url ? "" : url.startsWith("http") ? url : `${API_URL}${url}`;
  const getProfileUrl = (url) => getImageUrl(url);

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = `${item.title || ""} ${item.description || ""}`.toLowerCase().includes(q);
    const matchesCategory = category === "All" || item.category === category;
    const matchesType = listingFilter === "All" || (item.listingType || "rent") === listingFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const contactWhatsApp = (item) => {
    const phone = String(item.ownerPhone || "").replace(/\D/g, "");
    if (!phone) return alert("This item owner has not added a WhatsApp number yet.");
    const message = encodeURIComponent(`Hi ${item.owner || ""}, I found your ${item.title} on Borrow Box. I need it urgently. Is it available?`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="browse-page">
      <header className="browse-navbar"><div className="browse-nav-container">
        <div className="browse-brand" onClick={() => navigate("/home")}><div className="browse-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div>
        <nav><a href="/home">Home</a><a className="active" href="/browse">Browse</a><a href="/my-items">My Items</a></nav>
        <button className="browse-list-btn" onClick={() => navigate("/list-item")}>+ List an Item</button>
      </div></header>

      <main className="browse-container">
        <section className="browse-header"><span className="browse-label">CAMPUS MARKETPLACE</span><h1>Browse Items</h1><p>Find useful items shared by students on your campus.</p></section>
        <section className="browse-search"><div className="browse-search-box"><span>⌕</span><input placeholder="Search for books, electronics, notes..." value={search} onChange={(e) => setSearch(e.target.value)} />{search && <button onClick={() => setSearch("")}>×</button>}</div></section>

        <section className="browse-filters">
          <div className="filter-title">Categories</div>
          <div className="category-buttons">{categories.map((c) => <button key={c} className={category === c ? "selected" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
        </section>
        <div className="listing-filter-row"><span>Type</span><button className={listingFilter === "All" ? "selected" : ""} onClick={() => setListingFilter("All")}>All</button><button className={listingFilter === "rent" ? "selected" : ""} onClick={() => setListingFilter("rent")}>Rent</button><button className={listingFilter === "sale" ? "selected" : ""} onClick={() => setListingFilter("sale")}>Sale</button></div>

        <div className="browse-result"><strong>{filteredItems.length} items</strong><span>Available on campus</span></div>
        {loading ? <div className="no-results"><h2>Loading items...</h2></div> : filteredItems.length ? <section className="browse-grid">
          {filteredItems.map((item) => {
            const type = item.listingType || "rent";
            const sold = item.status === "Sold";
            const unavailable = item.status !== "Available";
            return <article className={`browse-card ${unavailable ? "is-unavailable" : ""}`} key={item._id}>
              <div className={`browse-image ${item.displayStyle || "square"}`}>
                {item.imageUrl ? <img className="browse-product-image" src={getImageUrl(item.imageUrl)} alt={item.title} /> : <div className="browse-no-image">No Image</div>}
                <span className={`listing-badge ${type}`}>{type === "sale" ? "FOR SALE" : "FOR RENT"}</span>
                <span className={`available ${unavailable ? "status-unavailable" : ""}`}>{sold ? "Sold" : item.status || "Available"}</span>
              </div>
              <div className="browse-card-content">
                <span className="card-category">{item.category}</span><h2>{item.title}</h2>
                {item.description && <p className="card-description">{item.description}</p>}
                <div className="owner">
                  {item.ownerProfilePicture ? <img className="owner-avatar owner-photo" src={getProfileUrl(item.ownerProfilePicture)} alt={item.owner || "Student"} /> : <div className="owner-avatar">{(item.owner || "S").charAt(0).toUpperCase()}</div>}
                  <span>Listed by <strong>{item.owner || "Student"}</strong></span>
                </div>
                <div className="card-footer"><div className="price"><strong>₹{item.price}</strong><span>{type === "sale" ? " permanent" : " / day"}</span></div>
                  <div className="browse-actions"><button className="details-btn" onClick={() => navigate(`/item-details/${item._id}`)}>View Details</button><button className="borrow-btn" disabled={unavailable} onClick={() => navigate(`/item-details/${item._id}`)}>{type === "sale" ? "Place Order →" : "Request →"}</button></div>
                </div>
                {type === "rent" && !unavailable && <button className="urgent-whatsapp-btn" onClick={() => contactWhatsApp(item)}>Urgent? Contact on WhatsApp</button>}
              </div>
            </article>;
          })}
        </section> : <div className="no-results"><div className="empty-icon">◇</div><h2>No matching items</h2><p>Try another search or list an item for the campus.</p><button onClick={() => navigate("/list-item")}>List an Item →</button></div>}
      </main>
    </div>
  );
}

export default Browse;
