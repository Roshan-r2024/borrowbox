import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemDetails.css";
import "./OrderFormEnhancements.css";

const API_URL = "http://localhost:5000";

function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [startDate, setStartDate] = useState(""), [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(""), [landmark, setLandmark] = useState("");
  const [location, setLocation] = useState(null), [locating, setLocating] = useState(false);
  const [sending, setSending] = useState(false), [success, setSuccess] = useState(false), [successMessage, setSuccessMessage] = useState("");
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    fetch(`${API_URL}/api/items/${id}`).then(async (r) => { const d=await r.json(); if(!r.ok) throw new Error(d.message||"Unable to load item."); setItem(d.item); }).catch(e=>setError(e.message)).finally(()=>setLoading(false));
    try { const u=JSON.parse(localStorage.getItem("borrowBoxUser")||"null"); if(u) setBuyer({name:u.nickname||u.name||"Student",phone:u.phone||"",email:u.email||""}); } catch {}
  }, [id]);

  const getImageUrl=(url)=>!url?"":url.startsWith("http")?url:`${API_URL}${url}`;
  const getToday=()=>new Date().toISOString().split("T")[0];

  const markLiveLocation=()=>{
    if(!navigator.geolocation) return setError("Live location is not supported by this browser.");
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition((p)=>{setLocation({latitude:p.coords.latitude,longitude:p.coords.longitude});setLocating(false);},(e)=>{setLocating(false);setError(e.code===1?"Location permission was denied. Please allow location access.":"Unable to get your live location. Please try again.");},{enableHighAccuracy:true,timeout:10000,maximumAge:0});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();setError("");
    if(!buyer.name.trim()||!buyer.phone.trim()) return setError("Buyer name and phone number are required.");
    if(!/^[0-9]{10}$/.test(buyer.phone.trim())) return setError("Phone number must contain exactly 10 digits.");
    if(item.listingType!=="sale" && (!startDate||!endDate)) return setError("Please select both borrow dates.");
    if(item.listingType!=="sale" && new Date(endDate)<new Date(startDate)) return setError("Return date cannot be before borrow date.");
    if(!landmark.trim()) return setError("Please enter a landmark.");
    if(!location) return setError("Please mark your live location before placing the order.");
    if(!buyer.email) return navigate("/login");
    setSending(true);
    try{
      const r=await fetch(`${API_URL}/api/borrow-requests`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:item._id,requestType:item.listingType==="sale"?"Purchase":"Borrow",borrower:buyer.name,borrowerEmail:buyer.email,borrowerPhone:buyer.phone,startDate:item.listingType==="sale"?null:startDate,endDate:item.listingType==="sale"?null:endDate,message,landmark,location})});
      const d=await r.json();if(!r.ok)return setError(d.message||"Unable to place order.");setSuccessMessage(item.listingType==="sale"?"Purchase order sent. The seller will review your order.":"Borrow request sent. The owner will review your request.");setSuccess(true);
    }catch(e){setError("Cannot connect to Borrow Box server. Make sure backend is running.");}finally{setSending(false)}
  };

  if(loading)return <div className="item-details-page"><div className="item-details-loading"><div className="details-spinner"/><p>Loading item...</p></div></div>;
  if(error&&!item)return <div className="item-details-page"><div className="item-details-error"><h2>Unable to load item</h2><p>{error}</p><button onClick={()=>navigate("/browse")}>← Back to Browse</button></div></div>;
  if(!item)return null;
  const sale=item.listingType==="sale", unavailable=item.status!=="Available";

  return <div className="item-details-page">
    <header className="details-navbar"><div className="details-nav-container"><div className="details-brand" onClick={()=>navigate("/home")}><div className="details-logo">◇</div><div><strong>Borrow Box</strong><span>Campus sharing</span></div></div><button onClick={()=>navigate("/browse")} className="back-browse">← Browse Items</button></div></header>
    <main className="item-details-container"><div className="details-layout">
      <section className="details-image-section"><div className={`details-image ${item.displayStyle||"square"}`}>{item.imageUrl?<img src={getImageUrl(item.imageUrl)} alt={item.title}/>:<div>No Image</div>}<span className={`details-listing-badge ${sale?"sale":"rent"}`}>{sale?"FOR SALE":"FOR RENT"}</span></div></section>
      <section className="details-info"><span className="details-category">{item.category}</span><h1>{item.title}</h1><div className="details-price"><strong>₹{item.price}</strong><span>{sale?" permanent":" / day"}</span></div><div className="details-status">{item.status||"Available"}</div><div className="details-divider"/><div className="details-description"><h3>About this item</h3><p>{item.description}</p></div>
        <div className="details-owner">{item.ownerProfilePicture?<img className="details-owner-avatar owner-profile-photo" src={getImageUrl(item.ownerProfilePicture)} alt={item.owner||"Student"}/>:<div className="details-owner-avatar">{(item.owner||"S").charAt(0).toUpperCase()}</div>}<div><span>Listed by</span><strong>{item.owner||"Student"}</strong></div></div>
        <div className="borrow-request-box"><div className="borrow-request-heading"><h2>{sale?"Place Order":"Request to Borrow"}</h2><p>{sale?"Enter your details and delivery location to send a purchase order.":"Enter your details, borrow dates and delivery location."}</p></div>
          {success?<div className="request-success"><div className="success-icon">✓</div><div><strong>Order Sent</strong><p>{successMessage}</p></div></div>:<form onSubmit={handleSubmit}>
            <div className="order-buyer-grid"><div className="order-field"><label>Buyer Name</label><input value={buyer.name} onChange={e=>setBuyer({...buyer,name:e.target.value})} /></div><div className="order-field"><label>Phone Number</label><input value={buyer.phone} onChange={e=>setBuyer({...buyer,phone:e.target.value.replace(/\D/g,"").slice(0,10)})} inputMode="numeric" maxLength="10" /></div></div>
            <div className="order-field"><label>Email</label><input value={buyer.email} readOnly className="locked-order-input" /></div>
            {!sale&&<div className="date-row"><div className="date-field"><label>Borrow From</label><input type="date" value={startDate} min={getToday()} onChange={e=>setStartDate(e.target.value)}/></div><div className="date-field"><label>Return By</label><input type="date" value={endDate} min={startDate||getToday()} onChange={e=>setEndDate(e.target.value)}/></div></div>}
            <div className="location-box"><div className="location-heading"><div><h3>Delivery / Pickup Location</h3><p>Mark your current live location and add a nearby landmark.</p></div><button type="button" className="location-btn" onClick={markLiveLocation} disabled={locating}>{locating?"Getting location...":"⌖ Mark Live Location"}</button></div>{location&&<div className="location-confirmed">✓ Location marked: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} <a href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=18/${location.latitude}/${location.longitude}`} target="_blank" rel="noreferrer">View map</a></div>}<div className="order-field"><label>Landmark</label><input value={landmark} onChange={e=>setLandmark(e.target.value)} placeholder="Eg. Main Gate, Block C, Library" /></div></div>
            <div className="message-field"><label>Message <span>Optional</span></label><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Any additional details for the owner..." rows="3"/></div>
            {error&&<div className="request-error">{error}</div>}<button type="submit" className="send-request-btn" disabled={sending||unavailable}>{unavailable?(item.status==="Sold"?"Item Sold":"Item Unavailable"):(sending?"Sending Order...":sale?"Place Purchase Order →":"Send Borrow Request →")}</button><p className="request-note">Your order will be sent to the item owner for approval.</p>
          </form>}
          {success&&<button className="back-after-success" onClick={()=>navigate("/browse")}>← Continue Browsing</button>}
        </div>
      </section>
    </div></main>
  </div>;
}
export default ItemDetails;
