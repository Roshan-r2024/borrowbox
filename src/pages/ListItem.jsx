import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListItem.css";

const API_URL = "http://localhost:5000";
const prohibitedPattern = /\b(drug|drugs|cocaine|heroin|meth|methamphetamine|marijuana|cannabis|weed|ganja|hashish|hash|opioid|fentanyl|lsd|mdma|ecstasy|ketamine|amphetamine|narcotic|steroid|steroids|prescription\s+medicine|controlled\s+substance)\b/i;

function ListItem() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [displayStyle, setDisplayStyle] = useState("square");
  const [listingType, setListingType] = useState("rent");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "", price: "", description: "", condition: "", availability: "" });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage("Please select a valid image file.");
    if (file.size > 5 * 1024 * 1024) return setMessage("Image size must be less than 5 MB.");
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setMessage("");
  };

  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!imageFile) return setMessage("Please upload an item photo.");
    if (!formData.name.trim() || !formData.category || !formData.price || !formData.description.trim() || !formData.condition || !formData.availability) return setMessage("Please fill in all item details.");
    if (prohibitedPattern.test(`${formData.name} ${formData.category} ${formData.description}`)) return setMessage("Drugs and controlled substances are strictly prohibited on Borrow Box.");

    const storedUser = localStorage.getItem("borrowBoxUser");
    let user = null;
    try { user = storedUser ? JSON.parse(storedUser) : null; } catch { user = null; }
    if (!user?.email) return navigate("/login");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("image", imageFile);
      data.append("title", formData.name.trim());
      data.append("category", formData.category);
      data.append("listingType", listingType);
      data.append("price", formData.price);
      data.append("description", formData.description.trim());
      data.append("condition", formData.condition);
      data.append("availability", formData.availability);
      data.append("displayStyle", displayStyle);
      data.append("owner", user.nickname || "Student");
      data.append("ownerEmail", user.email);

      const response = await fetch(`${API_URL}/api/items`, { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) return setMessage(result.message || "Unable to list item.");
      setMessage("✓ Successfully listed your item on Borrow Box!");
      setTimeout(() => navigate("/browse", { replace: true }), 1000);
    } catch (error) {
      console.error("List item error:", error);
      setMessage("Cannot connect to Borrow Box server. Make sure backend is running.");
    } finally { setLoading(false); }
  };

  return (
    <div className="list-page">
      <header className="list-header">
        <div className="list-brand" onClick={() => navigate("/home")}><div className="list-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div>
        <button className="back-btn" onClick={() => navigate("/browse")}>← Back</button>
      </header>

      <main className="list-container">
        <div className="list-title"><span>SELL / SHARE</span><h1>List an Item</h1><p>Choose whether your item is available to rent or sell.</p></div>

        <form className="list-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="section-heading"><div><h2>Listing Type</h2><p className="section-desc">Select how another student can get your item.</p></div><span className="required-text">Required</span></div>
            <div className="listing-type-options">
              <button type="button" className={`listing-type-card ${listingType === "rent" ? "selected" : ""}`} onClick={() => setListingType("rent")}><strong>Rent</strong><span>Student returns the item after the selected period.</span></button>
              <button type="button" className={`listing-type-card ${listingType === "sale" ? "selected" : ""}`} onClick={() => setListingType("sale")}><strong>Sale</strong><span>One-time purchase. Approved order marks the item Sold.</span></button>
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading"><div><h2>Item Photo</h2><p className="section-desc">Upload a clear photo and choose the best frame.</p></div><span className="required-text">Required</span></div>
            <div className="frame-section"><label>Image Display</label><div className="frame-options">
              {[['square','Square','1:1','General'],['portrait','Portrait','4:5','Books / Mobile'],['landscape','Landscape','16:10','Laptop / Monitor']].map(([value,title,ratio,note]) => <button key={value} type="button" className={`frame-option ${displayStyle === value ? "selected" : ""}`} onClick={() => setDisplayStyle(value)}><strong>{title}</strong><span>{ratio}</span><small>{note}</small></button>)}
            </div></div>
            <label className={`image-upload ${displayStyle} ${image ? "has-image" : ""}`}>
              {image ? <div className="image-preview"><img src={image} alt="Item preview" /><div className="image-overlay"><span>Change Image</span></div></div> : <div className="upload-placeholder"><div className="upload-icon">+</div><strong>Upload item image</strong><span>PNG, JPG or JPEG</span><small>Maximum size 5 MB</small></div>}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImage} />
            </label>
          </section>

          <section className="form-section">
            <div className="section-heading"><div><h2>Item Details</h2><p className="section-desc">Provide accurate information about your item.</p></div></div>
            <div className="form-grid">
              <div className="input-group full"><label htmlFor="name">Item name</label><input id="name" name="name" type="text" placeholder="Eg. Scientific Calculator" value={formData.name} onChange={handleChange} required /></div>
              <div className="input-group"><label htmlFor="category">Category</label><select id="category" name="category" value={formData.category} onChange={handleChange} required><option value="">Select category</option><option>Books</option><option>Electronics</option><option>Notes</option><option>Sports</option><option>Others</option></select></div>
              <div className="input-group"><label htmlFor="price">{listingType === "rent" ? "Price per day" : "Sale price"}</label><div className="price-input"><span>₹</span><input id="price" name="price" type="number" min="0" placeholder={listingType === "rent" ? "50" : "500"} value={formData.price} onChange={handleChange} required /></div></div>
              <div className="input-group full"><label htmlFor="description">Description</label><textarea id="description" name="description" rows="5" placeholder="Describe your item, its condition and anything the buyer/borrower should know..." value={formData.description} onChange={handleChange} required /></div>
              <div className="input-group"><label htmlFor="condition">Condition</label><select id="condition" name="condition" value={formData.condition} onChange={handleChange} required><option value="">Select condition</option><option>New</option><option>Like New</option><option>Good</option><option>Fair</option></select></div>
              <div className="input-group"><label htmlFor="availability">Availability</label><select id="availability" name="availability" value={formData.availability} onChange={handleChange} required><option value="">Select availability</option><option>Available now</option><option>Available from tomorrow</option></select></div>
            </div>
          </section>

          <div className="prohibited-notice"><strong>Strictly prohibited</strong><span>Drugs, controlled substances and illegal drug-related products cannot be sold, rented or listed on Borrow Box.</span></div>
          {message && <div className={message.startsWith("✓") ? "list-message success" : "list-message error"}>{message}</div>}
          <div className="form-actions"><button type="button" className="cancel-btn" onClick={() => navigate("/browse")} disabled={loading}>Cancel</button><button type="submit" className="submit-btn" disabled={loading}>{loading ? "Listing Item..." : `List ${listingType === "sale" ? "for Sale" : "for Rent"}`} {!loading && <span>→</span>}</button></div>
        </form>
      </main>
    </div>
  );
}

export default ListItem;
