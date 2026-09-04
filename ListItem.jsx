import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListItem.css";
import Toast from "./Toast";

function ListItem() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [displayStyle, setDisplayStyle] = useState("square");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [formData, setFormData] = useState({ name: "", category: "", price: "", description: "", condition: "", availability: "" });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setToast({ message: "Please select a valid image file.", type: "error" }); return; }
    if (file.size > 5 * 1024 * 1024) { setToast({ message: "Image must be less than 5 MB.", type: "error" }); return; }
    if (image) URL.revokeObjectURL(image);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage("");
    if (!imageFile) { setToast({ message: "Please upload an item photo.", type: "error" }); return; }
    if (!formData.name.trim() || !formData.category || !formData.price || !formData.description.trim() || !formData.condition || !formData.availability) {
      setToast({ message: "Please fill in all item details.", type: "error" }); return;
    }

    setLoading(true);
    const slowTimer = setTimeout(() => setToast({ message: "Upload is taking longer than usual. Please wait…", type: "info" }), 3500);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const storedUser = localStorage.getItem("borrowBoxUser");
      let user = null;
      try { user = storedUser ? JSON.parse(storedUser) : null; } catch { user = null; }
      if (!user?.email) { setToast({ message: "Please log in before listing an item.", type: "error" }); return; }

      const data = new FormData();
      data.append("image", imageFile);
      data.append("title", formData.name.trim());
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description.trim());
      data.append("condition", formData.condition);
      data.append("availability", formData.availability);
      data.append("displayStyle", displayStyle);
      data.append("owner", user.nickname || "Student");
      data.append("ownerEmail", user.email);

      const response = await fetch("http://localhost:5000/api/items", { method: "POST", body: data, signal: controller.signal });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setToast({ message: result.message || "Unable to list item.", type: "error" }); return; }

      setToast({ message: "Item listed successfully. Added to Browse.", type: "success" });
      setTimeout(() => navigate("/browse", { replace: true, state: { toast: "Your item is now visible in Browse.", toastType: "success" } }), 900);
    } catch (error) {
      if (error.name === "AbortError") setToast({ message: "Upload timed out. Please check your connection and try again.", type: "error" });
      else setToast({ message: "Network error while listing item. Please try again.", type: "error" });
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/browse");

  return (
    <div className="list-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
      <header className="list-header"><div className="list-brand" onClick={() => navigate("/home")}><div className="list-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div><button className="back-btn" onClick={handleCancel} disabled={loading}>← Back</button></header>
      <main className="list-container">
        <div className="list-title"><span>SELL / SHARE</span><h1>List an Item</h1><p>Share something useful with students on your campus.</p></div>
        <form className="list-form" onSubmit={handleSubmit}>
          <section className="form-section"><div className="section-heading"><div><h2>Item Photo</h2><p className="section-desc">Upload a clear photo and choose the best frame.</p></div><span className="required-text">Required</span></div>
            <div className="frame-section"><label>Image Display</label><div className="frame-options">
              {[["square","Square","1:1","General"],["portrait","Portrait","4:5","Books / Mobile"],["landscape","Landscape","16:10","Laptop / Monitor"]].map(([value,title,ratio,desc]) => <button key={value} type="button" className={displayStyle === value ? "frame-option selected" : "frame-option"} onClick={() => setDisplayStyle(value)}><strong>{title}</strong><span>{ratio}</span><small>{desc}</small></button>)}
            </div></div>
            <label className={`image-upload ${displayStyle} ${image ? "has-image" : ""}`}>{image ? <div className="image-preview"><img src={image} alt="Item preview" /><div className="image-overlay"><span>Change Image</span></div></div> : <div className="upload-placeholder"><div className="upload-icon">+</div><strong>Upload item image</strong><span>PNG, JPG or JPEG</span><small>Maximum size 5 MB</small></div>}<input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleImage} disabled={loading} /></label>
          </section>
          <section className="form-section"><div className="section-heading"><div><h2>Item Details</h2><p className="section-desc">Provide accurate information about your item.</p></div></div>
            <div className="form-grid">
              <div className="input-group full"><label htmlFor="name">Item name</label><input id="name" name="name" type="text" placeholder="Eg. Scientific Calculator" value={formData.name} onChange={handleChange} disabled={loading} /></div>
              <div className="input-group"><label htmlFor="category">Category</label><select id="category" name="category" value={formData.category} onChange={handleChange} disabled={loading}><option value="">Select category</option><option>Books</option><option>Electronics</option><option>Notes</option><option>Sports</option><option>Others</option></select></div>
              <div className="input-group"><label htmlFor="price">Price per day</label><div className="price-input"><span>₹</span><input id="price" name="price" type="number" min="0" placeholder="50" value={formData.price} onChange={handleChange} disabled={loading} /></div></div>
              <div className="input-group full"><label htmlFor="description">Description</label><textarea id="description" name="description" rows="5" placeholder="Describe your item, its condition and anything the borrower should know..." value={formData.description} onChange={handleChange} disabled={loading} /></div>
              <div className="input-group"><label htmlFor="condition">Condition</label><select id="condition" name="condition" value={formData.condition} onChange={handleChange} disabled={loading}><option value="">Select condition</option><option>New</option><option>Like New</option><option>Good</option><option>Fair</option></select></div>
              <div className="input-group"><label htmlFor="availability">Availability</label><select id="availability" name="availability" value={formData.availability} onChange={handleChange} disabled={loading}><option value="">Select availability</option><option>Available now</option><option>Available from tomorrow</option></select></div>
            </div>
          </section>
          {message && <div className="list-message">{message}</div>}
          <div className="form-actions"><button type="button" className="cancel-btn" onClick={handleCancel} disabled={loading}>Cancel</button><button type="submit" className="submit-btn" disabled={loading}>{loading ? "Listing Item…" : <>List Item <span>→</span></>}</button></div>
        </form>
      </main>
    </div>
  );
}
export default ListItem;
