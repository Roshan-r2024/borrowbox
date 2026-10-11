
const API="/api";
const DEMO_ITEMS=[
 { _id:"demo-1",title:"Engineering Mathematics Book",category:"Books",listingType:"rent",price:15,description:"Reference book for semester preparation and exam practice.",condition:"Good",availability:"Available now",owner:"Arun",ownerEmail:"arun.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-2",title:"Data Structures and Algorithms",category:"Books",listingType:"sale",price:280,description:"DSA textbook with solved examples for project and exam preparation.",condition:"Very Good",availability:"Available now",owner:"Meena",ownerEmail:"meena.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-3",title:"Scientific Calculator",category:"Electronics",listingType:"rent",price:10,description:"Student calculator for mathematics and engineering examinations.",condition:"Good",availability:"Available now",owner:"Karthik",ownerEmail:"karthik.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-4",title:"Wireless Headphones",category:"Electronics",listingType:"rent",price:35,description:"Comfortable headphones for library study and online classes.",condition:"Excellent",availability:"Available now",owner:"Priya",ownerEmail:"priya.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-5",title:"Laptop Stand",category:"Electronics",listingType:"sale",price:450,description:"Foldable stand suitable for study desks.",condition:"Excellent",availability:"Available now",owner:"Vishal",ownerEmail:"vishal.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-6",title:"Python Programming Notes",category:"Notes",listingType:"rent",price:8,description:"Compact notes for Python programming and practical preparation.",condition:"Good",availability:"Available now",owner:"Divya",ownerEmail:"divya.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1455390582262-044c057f2156?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-7",title:"DBMS Revision Notes",category:"Notes",listingType:"sale",price:60,description:"Quick revision material covering SQL and normalization.",condition:"Very Good",availability:"Available now",owner:"Rahul",ownerEmail:"rahul.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-8",title:"Football",category:"Sports",listingType:"rent",price:20,description:"Football for weekend games and practice sessions.",condition:"Good",availability:"Available now",owner:"Sanjay",ownerEmail:"sanjay.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1614632537423-1e6c2e7e0e9a?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-9",title:"Badminton Racket",category:"Sports",listingType:"rent",price:25,description:"Lightweight racket for recreational games.",condition:"Excellent",availability:"Available now",owner:"Nisha",ownerEmail:"nisha.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-10",title:"Study Backpack",category:"Others",listingType:"sale",price:350,description:"Spacious backpack with laptop compartment.",condition:"Excellent",availability:"Available now",owner:"Aditya",ownerEmail:"aditya.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-11",title:"USB Mechanical Keyboard",category:"Electronics",listingType:"rent",price:25,description:"Mechanical keyboard for coding and project work.",condition:"Excellent",availability:"Available now",owner:"Harish",ownerEmail:"harish.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",status:"Available"},
 { _id:"demo-12",title:"Study Desk Lamp",category:"Others",listingType:"sale",price:220,description:"Compact study lamp for late-night reading.",condition:"Good",availability:"Available now",owner:"Sneha",ownerEmail:"sneha.demo@example.com",imageUrl:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",status:"Available"}
];

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function user(){try{return JSON.parse(localStorage.getItem("borrowBoxUser")||"null")}catch(e){return null}}
function saveUser(u){localStorage.setItem("borrowBoxUser",JSON.stringify(u))}
function logout(){localStorage.removeItem("borrowBoxUser");location.href="/"}
function go(p){location.href=p}
function toast(msg,error=false){const n=$("<div class='msg "+(error?"error":"success")+"'></div>").text(msg);$("#toast").remove();n.attr("id","toast").css({position:"fixed",right:"18px",bottom:"18px",zIndex:50,maxWidth:"380px",boxShadow:"var(--shadow)"}).appendTo("body");setTimeout(()=>n.fadeOut(200,()=>n.remove()),3500)}
async function api(path,opts={}){const r=await fetch(API+path,opts);let d={};try{d=await r.json()}catch(e){}if(!r.ok)throw new Error(d.message||"Request failed");return d}
function nav(){const u=user();return '<header class="topbar"><div class="container nav"><a class="logo" href="'+(u?"/home.html":"/")+'">Borrow Box</a><button class="menu" id="menu">☰</button><div class="navlinks"><a href="/browse.html">Browse</a>'+(u?'<a href="/list-item.html">List Item</a><a href="/my-items.html">My Items</a><a href="/seller-history.html">History</a><a href="/chat.html">Chat</a><a href="/profile.html">Profile</a><button class="theme" id="theme">◐ Theme</button><button id="logout">Logout</button>':'<a href="/login.html">Login</a><a href="/signup.html">Sign Up</a><button class="theme" id="theme">◐ Theme</button>')+'</div></div></header>'}
function shell(title,body){$("#app").html(nav()+'<main class="page"><div class="container"><h1>'+esc(title)+'</h1>'+body+'</div></main><footer class="footer">Borrow Box · Buy, rent and share useful things.</footer>');bindCommon()}
function bindCommon(){
 $("#menu").on("click",()=>$(".nav").toggleClass("open"));
 $("#logout").on("click",logout);
 $("#theme").on("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("color-theme",next)});
}

function productImage(item){
 const title=String(item?.title||item?.name||"").toLowerCase();
 const category=String(item?.category||"").toLowerCase();
 const raw=item?.imageUrl||item?.imageURL||item?.imagePath||item?.image||item?.photo||item?.thumbnail||(Array.isArray(item?.images)?item.images[0]:"")||(Array.isArray(item?.photos)?item.photos[0]:"");
 const uploaded=typeof raw==="string"?raw:(raw&&typeof raw==="object"?(raw.url||raw.path||raw.src||""):"");
 const isPlaceholder=/(placehold\.co|placeholder|dummyimage|via\.placeholder)/i.test(uploaded);
 // Keep real seller uploads and real image URLs, but do not let generic dataset placeholders
 // override the product-specific image mapping below.
 if(uploaded && /^(https?:\/\/|\/)/i.test(uploaded) && !isPlaceholder) return uploaded;
 const photos=[
  [/calculator/,"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85"],
  [/headphone|earbud|earphone/,"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"],
  [/laptop stand|laptop riser|laptop/,"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=85"],
  [/keyboard/,"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85"],
  [/lamp|light/,"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"],
  [/backpack|bag/,"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85"],
  [/football|soccer/,"https://images.unsplash.com/photo-1614632537423-1e6c2e7e0e9a?auto=format&fit=crop&w=900&q=85"],
  [/badminton|racket/,"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=85"],
  [/book|textbook|novel|dsa|engineering mathematics/,"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85"],
  [/notes|notebook|paper|journal/,"https://images.unsplash.com/photo-1455390582262-044c057f2156?auto=format&fit=crop&w=900&q=85"]
 ];
 const match=photos.find(([pattern])=>pattern.test(title));
 if(match)return match[1];
 if(category.includes("book")||category.includes("note"))return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85";
 if(category.includes("electronic")||category.includes("tech"))return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=85";
 if(category.includes("sport"))return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85";
 if(uploaded && /^(https?:\/\/|\/)/i.test(uploaded))return uploaded;
 return "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=85";
}
function itemCard(i){const id=encodeURIComponent(i._id||"");const u=user();const own=u&&String(u.email||"").toLowerCase()===String(i.ownerEmail||"").toLowerCase();return '<article class="card item" data-item-id="'+esc(i._id||"")+'"><img src="'+esc(productImage(i))+'" onerror="this.src=&quot;/borrow-box-hero.svg&quot;" alt="'+esc(i.title)+'"><div class="item-body"><span class="pill">'+esc((i.listingType||"rent").toUpperCase())+'</span><h3>'+esc(i.title)+'</h3><div class="muted">'+esc(i.category||"Other")+' · '+esc(i.condition||"")+'</div><div class="price">₹'+Number(i.price||0).toLocaleString("en-IN")+' <small class="muted">'+(i.listingType==="rent"?"/ day":"one-time")+'</small></div><div class="muted">Seller: '+esc(i.owner||"Seller")+'</div><div class="actions"><a class="btn primary" href="/item-details.html?id='+id+'">View details</a>'+(u&&!own&&i.sellerRegistered!==false?'<button type="button" class="btn secondary chat-seller-btn" data-item-id="'+esc(i._id||"")+'">Chat with seller</button>':'')+'</div></div></article>'}
async function getItems(){try{const d=await api("/items");return Array.isArray(d.items)?d.items:[]}catch(e){toast("Could not load saved products from the server. Please check the backend and database.",true);return []}}
function renderCards(items,target="#items"){const box=$(target);if(!items.length){box.html('<div class="empty">'+(target==="#myItems"?'You have not listed any items yet. <a class="btn primary" href="/list-item.html">List your first item</a>':'No items found.')+'</div>');return}box.html(items.map(itemCard).join(""));if(target==="#myItems"){box.find(".item").each(function(){const card=$(this),item=items.find(x=>String(x._id)===String(card.attr("data-item-id")||""));if(!item)return;const status=String(item.status||"Available");card.find(".item-body").append('<div class="manage-item-panel"><div class="manage-item-status"><span class="muted">Listing status</span> <strong>'+esc(status)+'</strong></div><div class="actions manage-item-actions"><button type="button" class="btn secondary edit-item-btn" data-id="'+esc(item._id)+'">Edit item</button>'+(status==="Available"?'<button type="button" class="btn secondary status-item-btn" data-id="'+esc(item._id)+'" data-status="Unavailable">Pause listing</button>':status==="Unavailable"?'<button type="button" class="btn primary status-item-btn" data-id="'+esc(item._id)+'" data-status="Available">Make available</button>':'')+'<button type="button" class="btn danger delete-item-btn" data-id="'+esc(item._id)+'">Delete item</button></div></div>')});box.find(".edit-item-btn").on("click",function(){const id=String($(this).data("id"));const item=items.find(x=>String(x._id)===id);if(item)editItem(item)});box.find(".status-item-btn").on("click",async function(){const btn=$(this),id=String(btn.data("id")),status=String(btn.data("status"));const item=items.find(x=>String(x._id)===id);if(!item)return;btn.prop("disabled",true).text("Saving…");try{const fd=new FormData();fd.append("ownerEmail",user().email);fd.append("status",status);const d=await api("/items/"+encodeURIComponent(id),{method:"PUT",body:fd});toast(d.message||"Listing status updated.");await myItems()}catch(e){toast(e.message,true);btn.prop("disabled",false).text(status==="Available"?"Make available":"Pause listing")}});box.find(".delete-item-btn").on("click",async function(){const btn=$(this),id=String(btn.data("id"));if(!window.confirm("Delete this listing permanently? This cannot be undone."))return;btn.prop("disabled",true).text("Deleting…");try{const d=await api("/items/"+encodeURIComponent(id),{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({ownerEmail:user().email})});toast(d.message||"Item deleted.");await myItems()}catch(e){toast(e.message,true);btn.prop("disabled",false).text("Delete item")}})}box.find(".chat-seller-btn").off("click").on("click",async function(){const u=user();if(!u)return go("/login.html");const itemId=$(this).attr("data-item-id");const btn=$(this);btn.prop("disabled",true).text("Opening chat…");try{const d=await api("/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email,itemId})});const chatId=d._id||d.chat?._id||d.chatId; if(!chatId)throw new Error(d.message||"Chat could not be opened. Please try again.");go("/chat.html?id="+encodeURIComponent(chatId))}catch(err){toast(err.message,true);btn.prop("disabled",false).text("Chat with seller")}})}
function editItem(item){
 const u=user();if(!u)return go("/login.html");
 const old=$("#manageItemEditor");old.remove();
 const html='<section class="card section manage-item-editor" id="manageItemEditor"><div class="manage-item-editor-head"><div><h2>Edit listing</h2><p class="muted">Update your item details, price, type or photo.</p></div><button type="button" class="btn secondary" id="closeItemEditor">Close</button></div><form id="editItemForm" enctype="multipart/form-data"><div class="form-grid"><div class="field full"><label>Replace image (optional)</label><input id="editImage" type="file" accept="image/jpeg,image/png,image/webp"></div><div class="field"><label>Title</label><input id="editTitle" required maxlength="120" value="'+esc(item.title)+'"></div><div class="field"><label>Category</label><select id="editCategory" required>'+["Books","Electronics","Notes","Sports","Others"].map(x=>'<option'+(x===item.category?' selected':'')+'>'+x+'</option>').join("")+'</select></div><div class="field"><label>Listing type</label><select id="editType"><option value="rent"'+(item.listingType==="rent"?' selected':'')+'>Rent</option><option value="sale"'+(item.listingType==="sale"?' selected':'')+'>Sale</option></select></div><div class="field"><label>Price (₹)</label><input id="editPrice" type="number" min="0" step="0.01" required value="'+Number(item.price||0)+'"></div><div class="field"><label>Condition</label><select id="editCondition">'+["New","Excellent","Very Good","Good","Fair"].map(x=>'<option'+(x===item.condition?' selected':'')+'>'+x+'</option>').join("")+'</select></div><div class="field"><label>Availability</label><input id="editAvailability" required value="'+esc(item.availability||"Available now")+'"></div><div class="field full"><label>Description</label><textarea id="editDescription" required maxlength="3000">'+esc(item.description||"")+'</textarea></div></div><div id="editItemMsg"></div><div class="actions"><button type="submit" class="btn primary">Save changes</button><button type="button" class="btn secondary" id="cancelItemEdit">Cancel</button></div></form></section>';
 $("#myItems").after(html);$("#manageItemEditor").get(0).scrollIntoView({behavior:"smooth",block:"start"});
 $("#closeItemEditor,#cancelItemEdit").on("click",()=>$("#manageItemEditor").remove());
 $("#editItemForm").on("submit",async function(e){e.preventDefault();const btn=$(this).find('button[type="submit"]');btn.prop("disabled",true).text("Saving…");const fd=new FormData();fd.append("ownerEmail",u.email);fd.append("title",$("#editTitle").val().trim());fd.append("category",$("#editCategory").val());fd.append("listingType",$("#editType").val());fd.append("price",$("#editPrice").val());fd.append("condition",$("#editCondition").val());fd.append("availability",$("#editAvailability").val().trim());fd.append("description",$("#editDescription").val().trim());const file=$("#editImage")[0].files[0];if(file)fd.append("image",file);try{const d=await api("/items/"+encodeURIComponent(item._id),{method:"PUT",body:fd});toast(d.message||"Item updated.");await myItems()}catch(err){$("#editItemMsg").html('<div class="msg error">'+esc(err.message)+'</div>');btn.prop("disabled",false).text("Save changes")}});
}
function getLocation(){return new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(new Error("Location is not supported by this browser."));navigator.geolocation.getCurrentPosition(p=>resolve({latitude:p.coords.latitude,longitude:p.coords.longitude}),e=>reject(new Error("Please allow location access so the request can be submitted.")),{enableHighAccuracy:true,timeout:10000})})}

function setTheme(next){
 const mode=next==="dark"?"dark":"light";
 document.documentElement.dataset.theme=mode;
 try{localStorage.setItem("color-theme",mode)}catch(e){}
 const src=mode==="dark"?"/borrow-box-hero-dark.svg":"/borrow-box-hero-light.svg";
 $(".themeable-hero").attr("src",src);
 $(".theme-toggle").text(mode==="dark"?"☀ Light":"☾ Dark").attr("aria-pressed",String(mode==="dark"));
}
function bindThemeToggle(){
 const initial=document.documentElement.dataset.theme||(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
 $(".theme-toggle").off("click").on("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
 setTheme(initial);
}
function bbBrand(){
 return '<a class="bb-brand" href="/" aria-label="Borrow Box home"><span class="bb-brand-icon" aria-hidden="true"><svg viewBox="0 0 40 40" role="presentation"><path d="M20 1 38 10.5 20 21 2 10.5Z" fill="#93c5fd"/><path d="M2 10.5 20 21v18L2 29.5Z" fill="#1d4ed8"/><path d="M38 10.5 20 21v18l18-9.5Z" fill="#2563eb"/><path d="M20 1v20m-18-10.5 18 10.5 18-10.5" fill="none" stroke="#eff6ff" stroke-width="1.7"/></svg></span><span class="bb-brand-name">Borrow <b>Box</b><small>Share · Rent · Buy</small></span></a>';
}
function authHeader(){
 return '<header class="auth-topbar"><div class="container auth-topbar-inner">'+bbBrand()+'<div class="auth-top-actions"><a href="/">Home</a><button type="button" class="theme-toggle" id="theme">☾ Dark</button></div></div></header>';
}
function heroAsset(className,alt){
 const src=document.documentElement.dataset.theme==="dark"?"/borrow-box-hero-dark.svg":"/borrow-box-hero-light.svg";
 return '<img class="'+className+' themeable-hero" src="'+src+'" alt="'+esc(alt)+'">';
}
function bindPasswordToggles(){
 $(".password-toggle").off("click").on("click",function(){
   const field=$("#"+$(this).data("target"));
   const reveal=field.attr("type")==="password";
   field.attr("type",reveal?"text":"password");
   $(this).text(reveal?"Hide":"Show").attr("aria-label",reveal?"Hide password":"Show password");
 });
}

function getStarted(){
 $("#app").html(
 '<main class="landing-page" id="home">'+
   '<header class="landing-header"><div class="container landing-nav">'+
     bbBrand()+
     '<nav class="landing-links" aria-label="Main navigation"><a class="active" href="#home">Home</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a></nav>'+
     '<div class="landing-nav-actions"><button type="button" class="theme-toggle" id="theme">☾ Dark</button><a class="nav-login" href="/login.html">Login</a><a class="nav-signup" href="/signup.html">Sign Up</a></div>'+
   '</div></header>'+
   '<section class="container landing-hero">'+
     '<div class="landing-copy"><span class="landing-eyebrow">Share&nbsp; · &nbsp;Rent&nbsp; · &nbsp;Buy</span>'+
       '<h1>Everything You Need,<br>Just a <span>Borrow Away</span></h1>'+
       '<p>Borrow Box is a community marketplace where everyone can borrow, rent, buy, or sell useful items. Save money, reuse more, and help each other!</p>'+
       '<div class="landing-actions"><a class="landing-primary" href="/signup.html">Get Started <span>→</span></a><a class="landing-secondary" href="#how-it-works">Learn More</a></div>'+
       '<div class="landing-trust"><span>✓ Easy to use</span><span>✓ Community sharing</span><span>✓ Made for everyone</span></div>'+
     '</div>'+
     '<div class="landing-art-wrap">'+heroAsset("landing-art","Two people sharing useful items with the Borrow Box app")+'</div>'+
   '</section>'+
   '<section class="container landing-features" id="features"><div class="landing-section-heading"><span>WHY CHOOSE BORROW BOX?</span><h2>Smart Features for Everyday Life</h2></div>'+
     '<div class="landing-feature-grid">'+
       '<article class="landing-feature"><span class="feature-icon green">◇</span><h3>Borrow &amp; Rent</h3><p>Get what you need for a day, a week, or longer.</p></article>'+
       '<article class="landing-feature"><span class="feature-icon purple">◇</span><h3>Buy &amp; Sell</h3><p>Sell items you no longer use or find useful deals.</p></article>'+
       '<article class="landing-feature"><span class="feature-icon blue">♧</span><h3>Community Sharing</h3><p>Connect with people and make useful items easier to access.</p></article>'+
       '<article class="landing-feature"><span class="feature-icon coral">♻</span><h3>Save Money &amp; Waste Less</h3><p>Reuse more, spend less, and give items another life.</p></article>'+
       '<article class="landing-feature"><span class="feature-icon amber">▯</span><h3>Easy &amp; Convenient</h3><p>Browse listings and manage exchanges in one place.</p></article>'+
     '</div>'+
   '</section>'+
   '<section class="container landing-cta" id="how-it-works"><div class="landing-cta-art" aria-hidden="true">⌁</div><div class="landing-cta-copy"><h2>Ready to start sharing?</h2><p>Join the Borrow Box community. List an item, find something useful, and make more of what you already have.</p></div><a class="landing-primary" href="/signup.html">Get Started <span>→</span></a></section>'+
   '<footer class="landing-footer"><strong>Borrow Box</strong><span>Share more. Waste less.</span></footer>'+
 '</main>');
 bindThemeToggle();
}
function login(){
 $("#app").html(authHeader()+
 '<main class="container auth-layout">'+
   '<section class="auth-visual-panel">'+
     '<div class="auth-visual-copy"><span class="landing-eyebrow">SHARE · RENT · BUY</span><h1>Borrow what you <span>need.</span></h1><p>Borrow Box makes it simple for everyone to discover, borrow, rent and sell useful items in their community.</p></div>'+
     heroAsset("auth-hero-image","Borrow Box sharing illustration")+
     '<div class="auth-benefits"><div><span>⌕</span><strong>Find useful items</strong><small>Discover listings quickly.</small></div><div><span>↻</span><strong>Borrow or rent</strong><small>Choose what fits your needs.</small></div><div><span>◇</span><strong>Sell your items</strong><small>Give useful things another life.</small></div></div>'+
     '<small class="auth-note">Borrow Box · Share more. Waste less.</small>'+
   '</section>'+
   '<section class="auth-form-panel"><span class="auth-kicker">WELCOME BACK</span><h2>Sign in to Borrow Box</h2><p class="auth-form-intro">Access your account and continue sharing.</p><div id="formMsg"></div>'+
     '<form id="loginForm" class="auth-form">'+
       '<div class="field"><label for="email">Email address</label><input id="email" type="email" placeholder="you@example.com" required autocomplete="email"></div>'+
       '<div class="field"><label for="password">Password</label><div class="auth-password-wrap"><input id="password" type="password" placeholder="Enter your password" required autocomplete="current-password"><button type="button" class="password-toggle" data-target="password" aria-label="Show password">Show</button></div></div>'+
       '<div class="auth-meta"><span class="hint">Use the email address linked to your account.</span></div>'+
       '<button class="auth-submit" type="submit">Login <span>→</span></button>'+
     '</form>'+
     '<p class="auth-switch">Don’t have an account? <a href="/signup.html">Sign Up</a></p>'+
   '</section>'+
 '</main><footer class="auth-footer">Borrow Box <span>·</span> A community marketplace for everyone.</footer>');
 bindThemeToggle();
 bindPasswordToggles();
 $("#loginForm").on("submit",async function(e){
   e.preventDefault();$("#formMsg").html("");
   try{
     const d=await api("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("#email").val().trim(),password:$("#password").val()})});
     if(!d.user||!d.user.email)throw new Error("Login succeeded but account details were not returned. Please try again.");
     saveUser({...d.user,name:d.user.name||d.user.nickname||""});
     window.location.replace("/home.html");
   }catch(err){$("#formMsg").html('<div class="msg error">'+esc(err.message)+'</div>')}
 });
}
function signup(){
 $("#app").html(authHeader()+
 '<main class="container auth-layout signup-layout">'+
   '<section class="auth-visual-panel signup-visual-panel">'+
     '<div class="auth-visual-copy"><span class="landing-eyebrow">A COMMUNITY THAT SHARES</span><h1>Join the Borrow Box <span>community.</span></h1><p>Create your account and start sharing useful items. Borrow what you need, sell what you no longer use, and help reduce waste.</p></div>'+
     heroAsset("auth-hero-image","Borrow Box community illustration")+
     '<div class="auth-benefits"><div><span>✦</span><strong>More Access</strong><small>Get what you need.</small></div><div><span>♧</span><strong>Build Community</strong><small>Help and support.</small></div><div><span>♻</span><strong>Less Waste</strong><small>A greener tomorrow.</small></div></div>'+
     '<small class="auth-note">Anyone can join. No OTP is required.</small>'+
   '</section>'+
   '<section class="auth-form-panel signup-form-panel"><span class="auth-kicker">CREATE ACCOUNT</span><h2>Sign up to Borrow Box</h2><p class="auth-form-intro">Fill in your details to get started.</p><div id="formMsg"></div>'+
     '<form id="signupForm" class="auth-form">'+
       '<div class="form-grid">'+
         '<div class="field"><label for="name">Full name</label><input id="name" placeholder="Enter your full name" required autocomplete="name"></div>'+
         '<div class="field"><label for="phone">Phone number</label><input id="phone" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit phone number" required autocomplete="tel"></div>'+
         '<div class="field"><label for="gender">Gender</label><select id="gender" required><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></div>'+
         '<div class="field"><label for="email">Email ID</label><input id="email" type="email" placeholder="you@example.com" required autocomplete="email"></div>'+
         '<div class="field full"><label for="address">Address</label><textarea id="address" rows="2" placeholder="Enter your complete address" required></textarea></div>'+
         '<div class="field"><label for="pincode">Pincode</label><input id="pincode" inputmode="numeric" maxlength="6" placeholder="6-digit pincode" required autocomplete="postal-code"></div>'+
         '<div class="field"><label for="state">State</label><input id="state" placeholder="Enter your state" required autocomplete="address-level1"></div>'+
         '<div class="field full"><label for="password">Create password</label><div class="auth-password-wrap"><input id="password" type="password" placeholder="Create a strong password" minlength="8" required autocomplete="new-password"><button type="button" class="password-toggle" data-target="password" aria-label="Show password">Show</button></div><span class="hint password-hint">Use 8+ characters with uppercase, lowercase, number and special character.</span></div>'+
       '</div>'+
       '<button class="auth-submit" type="submit">Create Account <span>→</span></button>'+
     '</form>'+
     '<p class="auth-switch">Already have an account? <a href="/login.html">Sign In</a></p>'+
   '</section>'+
 '</main><footer class="auth-footer">Borrow Box <span>·</span> A community marketplace for everyone.</footer>');
 bindThemeToggle();
 bindPasswordToggles();
 $("#phone").on("input",function(){$(this).val($(this).val().replace(/\D/g,"").slice(0,10))});
 $("#pincode").on("input",function(){$(this).val($(this).val().replace(/\D/g,"").slice(0,6))});
 $("#signupForm").on("submit",async function(e){
   e.preventDefault();
   const email=$("#email").val().trim().toLowerCase();
   const pass=$("#password").val();
   const phone=$("#phone").val().trim();
   const pin=$("#pincode").val().trim();
   const strong=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return $("#formMsg").html('<div class="msg error">Please enter a valid email address.</div>');
   if(!/^\d{10}$/.test(phone))return $("#formMsg").html('<div class="msg error">Phone number must contain exactly 10 digits.</div>');
   if(!/^\d{6}$/.test(pin))return $("#formMsg").html('<div class="msg error">Pincode must contain exactly 6 digits.</div>');
   if(!strong.test(pass))return $("#formMsg").html('<div class="msg error">Password needs 8+ characters with uppercase, lowercase, number and special character.</div>');
   const payload={name:$("#name").val().trim(),email,password:pass,phone,gender:$("#gender").val(),address:$("#address").val().trim(),pincode:pin,state:$("#state").val().trim()};
   try{
     const d=await api("/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
     if(!d.user||!d.user.email)throw new Error("Account created but account details were not returned. Please try again.");
     saveUser({...d.user,name:d.user.name||d.user.nickname||""});
     window.location.replace("/home.html");
   }catch(err){$("#formMsg").html('<div class="msg error">'+esc(err.message)+'</div>')}
 });
}
async function home(){
 const u=user();if(!u)return go("/login.html");
 const displayName=esc(u.nickname||u.name||"there");
 $("#app").html(nav()+
 '<main class="home-page">'+
   '<section class="home-hero container">'+
     '<div class="home-hero-copy">'+
       '<span class="home-eyebrow"><span class="home-eyebrow-dot"></span> YOUR COMMUNITY MARKETPLACE</span>'+
       '<h1>Good things are <span>closer than you think.</span></h1>'+
       '<p>Welcome back, '+displayName+'! Find useful things to rent or buy, or give your own items a new home.</p>'+
       '<div class="home-hero-actions"><a class="btn primary home-main-btn" href="/browse.html">Explore items <span>→</span></a><a class="btn secondary home-secondary-btn" href="/list-item.html">＋ List an item</a></div>'+
       '<div class="home-trust-row"><span>✓ Easy to browse</span><span>✓ Buy or rent</span><span>✓ For everyone</span></div>'+
     '</div>'+
     '<div class="home-hero-art"><div class="home-art-glow"></div>'+heroAsset("home-hero-image","Borrow Box community sharing illustration")+'<div class="home-float-card home-float-top"><span class="home-float-icon">↗</span><span><strong>Find more value</strong><small>Buy less, share more</small></span></div><div class="home-float-card home-float-bottom"><span class="home-float-icon">✓</span><span><strong>Ready when you are</strong><small>Discover useful finds</small></span></div></div>'+
   '</section>'+
   '<section class="home-category-section"><div class="container"><div class="home-section-heading"><div><span class="home-section-kicker">FIND YOUR NEXT USEFUL THING</span><h2>Explore categories</h2></div><a class="home-text-link" href="/browse.html">View all items <span>→</span></a></div>'+
     '<div class="home-category-grid">'+
       '<a class="home-category-card" href="/browse.html"><span class="home-category-icon home-icon-blue">⌘</span><strong>Electronics</strong><small>Gadgets & accessories</small><span class="home-category-arrow">↗</span></a>'+
       '<a class="home-category-card" href="/browse.html"><span class="home-category-icon home-icon-purple">▤</span><strong>Books & Notes</strong><small>Learn something new</small><span class="home-category-arrow">↗</span></a>'+
       '<a class="home-category-card" href="/browse.html"><span class="home-category-icon home-icon-green">⚽</span><strong>Sports</strong><small>Gear up and play</small><span class="home-category-arrow">↗</span></a>'+
       '<a class="home-category-card" href="/browse.html"><span class="home-category-icon home-icon-orange">⌂</span><strong>Everyday items</strong><small>Useful things for life</small><span class="home-category-arrow">↗</span></a>'+
     '</div></div></section>'+
   '<section class="container home-featured-section"><div class="home-section-heading"><div><span class="home-section-kicker">HANDPICKED FOR YOU</span><h2>Featured items</h2><p>Discover something useful for your next project, outing, or everyday need.</p></div><a class="home-text-link" href="/browse.html">Browse marketplace <span>→</span></a></div><div class="items home-items-grid" id="homeItems"></div></section>'+
   '<section class="container home-sell-banner"><div class="home-sell-icon">＋</div><div class="home-sell-copy"><span class="home-section-kicker">HAVE SOMETHING TO SHARE?</span><h2>Turn unused items into useful finds.</h2><p>List it for sale or rent and help someone find exactly what they need.</p></div><a class="btn primary home-main-btn" href="/list-item.html">List your item <span>→</span></a></section>'+
 '</main><footer class="footer home-footer">Borrow Box · Buy, rent and share useful things.</footer>');
 bindCommon();
 const items=await getItems();renderCards(items.slice(0,8),"#homeItems");
}
async function browse(){
 shell("Browse Borrow Box",'<div class="toolbar"><input id="search" placeholder="Search products..."><select id="category"><option value="">All categories</option><option>Books</option><option>Electronics</option><option>Notes</option><option>Sports</option><option>Others</option></select><select id="type"><option value="">Buy or rent</option><option value="sale">Sale</option><option value="rent">Rent</option></select></div><div id="items" class="items"></div>');
 const items=await getItems();function filter(){const q=$("#search").val().toLowerCase();const c=$("#category").val();const t=$("#type").val();renderCards(items.filter(i=>(i.status||"Available")==="Available"&&(!q||String(i.title).toLowerCase().includes(q)||String(i.description).toLowerCase().includes(q))&&(!c||i.category===c)&&(!t||i.listingType===t)))}$("#search,#category,#type").on("input change",filter);filter()
}
function listItem(){
 const u=user();if(!u)return go("/login.html");
 shell("List an item",'<div class="card form-card"><p class="muted">Choose Sale for a permanent sale or Rent for a borrow period.</p><div id="formMsg"></div><form id="itemForm" enctype="multipart/form-data"><div class="form-grid"><div class="field full"><label>Item image</label><input id="image" type="file" accept="image/jpeg,image/png,image/webp" required></div><div class="field"><label>Title</label><input id="title" required></div><div class="field"><label>Category</label><select id="category" required><option value="">Select</option><option>Books</option><option>Electronics</option><option>Notes</option><option>Sports</option><option>Others</option></select></div><div class="field"><label>Listing type</label><select id="listingType" required><option value="rent">Rent</option><option value="sale">Sale</option></select></div><div class="field"><label>Price</label><input id="price" type="number" min="0" required></div><div class="field"><label>Condition</label><select id="condition" required><option>New</option><option>Excellent</option><option>Very Good</option><option>Good</option><option>Fair</option></select></div><div class="field"><label>Availability</label><input id="availability" value="Available now" required></div><div class="field full"><label>Description</label><textarea id="description" required></textarea></div></div><div class="actions"><button class="btn primary">Publish item</button></div></form></div>');
 $("#itemForm").on("submit",async function(e){e.preventDefault();const fd=new FormData();["image","title","category","listingType","price","condition","availability","description"].forEach(k=>fd.append(k,$("#"+k)[0]?.files?.[0]||$("#"+k).val()));fd.append("owner",u.nickname||"User");fd.append("ownerEmail",u.email);try{const d=await api("/items",{method:"POST",body:fd});toast(d.message||"Item listed");setTimeout(()=>go("/my-items.html"),500)}catch(err){$("#formMsg").html('<div class="msg error">'+esc(err.message)+'</div>')}})
}
async function itemDetails(){
 const id=new URLSearchParams(location.search).get("id");if(!id)return go("/browse.html");let item=null;try{item=(await api("/items/"+encodeURIComponent(id))).item}catch(e){item=DEMO_ITEMS.find(x=>x._id===id)}if(!item)return shell("Item not found",'<div class="empty">This listing could not be found.</div>');
 shell(item.title,'<div id="detail"></div>');
 const u=user();const own=u&&String(u.email).toLowerCase()===String(item.ownerEmail||"").toLowerCase();
 $("#detail").html('<div class="detail"><div><img src="'+esc(productImage(item))+'" onerror="this.src=&quot;/borrow-box-hero.svg&quot;" alt="'+esc(item.title)+'"></div><div class="card"><span class="pill">'+esc((item.listingType||"rent").toUpperCase())+'</span><h2>'+esc(item.title)+'</h2><div class="price">₹'+Number(item.price||0).toLocaleString("en-IN")+' '+(item.listingType==="rent"?'<small class="muted">/ day</small>':'')+'</div><p class="muted">'+esc(item.description)+'</p><div class="kv"><strong>Category</strong><span>'+esc(item.category)+'</span><strong>Condition</strong><span>'+esc(item.condition)+'</span><strong>Availability</strong><span>'+esc(item.availability)+'</span><strong>Seller</strong><span>'+esc(item.owner||"Seller")+'</span></div><div class="actions">'+(own?'<a class="btn secondary" href="/my-items.html">Manage my item</a>':u?'<button class="btn primary" id="requestBtn">'+(item.listingType==="sale"?"Request purchase":"Request to borrow")+'</button>'+(item.sellerRegistered===false?'<span class="muted">Chat is available for listings from registered sellers.</span>':'<button class="btn secondary" id="chatBtn">Chat with seller</button>'):'<a class="btn primary" href="/login.html">Login to request</a>')+'</div><div id="requestBox"></div></div></div>');
 if(u&&!own){if(item.sellerRegistered!==false)$("#chatBtn").on("click",async()=>{const btn=$("#chatBtn");btn.prop("disabled",true).text("Opening chat…");try{const d=await api("/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email,itemId:item._id})});const chatId=d._id||d.chat?._id||d.chatId;if(!chatId)throw new Error(d.message||"The server did not return a chat ID.");go("/chat.html?id="+encodeURIComponent(chatId))}catch(e){toast(e.message||"Unable to create chat. Please try again.",true);btn.prop("disabled",false).text("Chat with seller")}});$("#requestBtn").on("click",()=>requestForm(item))}
}
function requestForm(item){
 const u=user();const sale=item.listingType==="sale";$("#requestBox").html('<div class="card section"><h3>'+ (sale?"Purchase request":"Borrow request")+'</h3><form id="requestForm"><div class="form-grid">'+(sale?"":'<div class="field"><label>Borrow from</label><input id="startDate" type="date" required></div><div class="field"><label>Return by</label><input id="endDate" type="date" required></div>')+'<div class="field"><label>Landmark</label><input id="landmark" required placeholder="Nearby landmark"></div><div class="field"><label>Urgency</label><select id="urgency"><option>Normal</option><option>Urgent</option></select></div><div class="field full"><label>Message</label><textarea id="message" placeholder="Optional message to seller"></textarea></div></div><div class="actions"><button class="btn primary">Send request</button></div></form></div>');
 $("#requestForm").on("submit",async e=>{e.preventDefault();try{const loc=await getLocation();const body={itemId:item._id,borrower:u.nickname||"User",borrowerEmail:u.email,borrowerPhone:u.phone||"",requestType:sale?"Purchase":"Borrow",startDate:sale?null:$("#startDate").val(),endDate:sale?null:$("#endDate").val(),landmark:$("#landmark").val(),location:loc,urgency:$("#urgency").val(),message:$("#message").val()};const d=await api("/borrow-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});toast(d.message);setTimeout(()=>go("/my-items.html"),600)}catch(err){toast(err.message,true)}})
}
async function profile(){
 const u=user();if(!u)return go("/login.html");shell("My Profile",'<div id="profile"></div>');let p=u;try{p=(await api("/auth/profile/"+encodeURIComponent(u.email))).user}catch(e){}
 $("#profile").html('<div class="card"><div class="profile-head"><img class="avatar" src="'+esc(p.profilePicture||"/favicon.svg")+'" onerror="this.src=&quot;/favicon.svg&quot;"><div><h2>'+esc(p.nickname||"User")+'</h2><div class="muted">'+esc(p.email)+'</div></div></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><form id="profileForm"><div class="form-grid"><div class="field"><label>Name</label><input id="nickname" value="'+esc(p.nickname||"")+'" required></div><div class="field"><label>Phone</label><input id="phone" value="'+esc(p.phone||"")+'"></div><div class="field full"><label>Profile picture</label><input id="profilePicture" type="file" accept="image/jpeg,image/png,image/webp"></div></div><div class="actions"><button class="btn primary">Save profile</button></div></form><div id="formMsg"></div></div>');
 $("#profileForm").on("submit",async e=>{e.preventDefault();const fd=new FormData();fd.append("email",u.email);fd.append("nickname",$("#nickname").val());fd.append("phone",$("#phone").val());if($("#profilePicture")[0].files[0])fd.append("profilePicture",$("#profilePicture")[0].files[0]);try{const d=await api("/auth/profile",{method:"PUT",body:fd});saveUser(d.user);toast(d.message)}catch(err){$("#formMsg").html('<div class="msg error">'+esc(err.message)+'</div>')}})
}
async function myItems(){
 const u=user();if(!u)return go("/login.html");shell("My Items",'<div class="actions"><a class="btn primary" href="/list-item.html">+ List new item</a></div><div id="myItems" class="items"></div><section class="section"><h2>My requests</h2><div id="requests"></div></section>');const items=await getItems();renderCards(items.filter(i=>String(i.ownerEmail||"").toLowerCase()===String(u.email).toLowerCase()),"#myItems");try{const d=await api("/borrow-requests/borrower/"+encodeURIComponent(u.email));const owner=await api("/borrow-requests/owner/"+encodeURIComponent(u.email));const rows=[...(d.requests||[]).map(x=>({...x,role:"Buyer/Borrower"})),...(owner.requests||[]).map(x=>({...x,role:"Seller"}))];$("#requests").html(rows.length?'<table class="table"><thead><tr><th>Item</th><th>Role</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.itemTitle)+'</td><td>'+r.role+'</td><td>'+esc(r.requestType)+'</td><td>'+esc(r.status)+'</td><td>'+(r.role==="Seller"&&r.status==="Pending"?'<button class="btn primary approve" data-id="'+r._id+'">Approve</button> <button class="btn danger reject" data-id="'+r._id+'">Reject</button>':r.role==="Buyer/Borrower"&&r.status==="Pending"?'<button class="btn danger cancel-request" data-id="'+r._id+'">Cancel Request</button>':r.role==="Buyer/Borrower"&&r.status==="Approved"&&r.requestType==="Borrow"?'<button class="btn secondary return" data-id="'+r._id+'">Mark returned</button>':'')+'</td></tr>').join("")+'</tbody></table>':'<div class="empty">No requests yet.</div>');$(".approve,.reject,.return,.cancel-request").on("click",async function(){const button=$(this),id=String(button.attr("data-id")||"");const a=button.hasClass("approve")?"approve":button.hasClass("reject")?"reject":button.hasClass("cancel-request")?"cancel":"return";if(a==="cancel"&&!window.confirm("Cancel this request? This action cannot be undone."))return;if(!/^[a-f0-9]{24}$/i.test(id)){toast("This request has an invalid ID. Refresh the page and try again.",true);return}const options={method:"PUT"};if(a==="cancel"){options.headers={"Content-Type":"application/json"};options.body=JSON.stringify({email:u.email})}button.prop("disabled",true).text(a==="cancel"?"Cancelling…":"Please wait…");try{toast((await api("/borrow-requests/"+encodeURIComponent(id)+"/"+a,options)).message);await myItems()}catch(e){toast(e.message,true);button.prop("disabled",false).text(a==="cancel"?"Cancel Request":a==="approve"?"Approve":a==="reject"?"Reject":"Mark returned")}})}catch(e){$("#requests").html('<div class="msg error">'+esc(e.message)+'</div>')}}
async function history(){
 const u=user();if(!u)return go("/login.html");shell("Seller History",'<div id="history"></div>');try{const d=await api("/borrow-requests/owner/"+encodeURIComponent(u.email));const rows=d.requests||[];$("#history").html(rows.length?'<table class="table"><thead><tr><th>Item</th><th>Buyer</th><th>Type</th><th>Status</th><th>Dates</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.itemTitle)+'</td><td>'+esc(r.borrower)+'</td><td>'+esc(r.requestType)+'</td><td>'+esc(r.status)+'</td><td>'+(r.startDate?new Date(r.startDate).toLocaleDateString("en-IN")+" → "+new Date(r.endDate).toLocaleDateString("en-IN"):"Permanent sale")+'</td></tr>').join("")+'</tbody></table>':'<div class="empty">No seller transactions yet.</div>')}catch(e){$("#history").html('<div class="msg error">'+esc(e.message)+'</div>')}}
async function chat(){
 const u=user();
 if(!u)return go("/login.html");
 shell("Chat",'<div class="chat-layout"><aside class="card"><h3>Conversations</h3><div id="chatList" class="chat-list"><div class="muted">Loading conversations…</div></div></aside><section class="card"><div id="chatHeader" class="empty">Select a conversation.</div><div id="messages" class="messages hidden" aria-live="polite"></div><form id="chatForm" class="chat-compose hidden"><input id="chatText" placeholder="Write a message..." maxlength="2000" autocomplete="off"><button class="btn primary" type="submit">Send</button></form></section></div>');
 let chats=[],activeChatId=new URLSearchParams(location.search).get("id")||"",loadingMessages=false;
 function renderChatList(){
  if(!chats.length){$("#chatList").html('<div class="chat-empty"><div class="chat-empty-icon">✉</div><h4>No conversations yet</h4><p>Open an item listed by a registered seller and choose <strong>Chat with seller</strong>.</p><a class="btn primary" href="/browse.html">Browse items</a></div>');return}
  $("#chatList").html(chats.map(c=>'<button type="button" class="chat-row '+(String(c._id||c.id)===String(activeChatId)?"active":"")+'" data-id="'+esc(c._id||c.id||"")+'"><span class="chat-avatar">'+esc(String(c.otherName||c.sellerName||c.buyerName||"U").trim().charAt(0).toUpperCase())+'</span><span class="chat-row-copy"><strong>'+esc(c.otherName||c.sellerName||c.buyerName||"Seller")+'</strong><span class="muted">'+esc(c.itemTitle||"Product chat")+'</span></span><span class="chat-row-arrow">›</span></button>').join(""));
  $(".chat-row").off("click").on("click",function(){openChat(String($(this).data("id")||""))});
 }
 async function loadChats(){
  try{
   const result=await api("/chats/user/"+encodeURIComponent(u.email));
   chats=Array.isArray(result)?result:(result.chats||result.items||[]);
   renderChatList();
   if(!activeChatId&&chats.length)activeChatId=String(chats[0]._id||chats[0].id||"");
   if(activeChatId)await openChat(activeChatId,true);
  }catch(e){$("#chatList").html('<div class="msg error">'+esc(e.message||"Could not load conversations.")+'</div>')}
 }
 async function openChat(id,quiet=false){
  if(!id||loadingMessages)return;
  activeChatId=String(id);
  loadingMessages=true;
  $(".chat-row").removeClass("active");
  $('.chat-row[data-id="'+activeChatId+'"]').addClass("active");
  try{
   const c=await api("/chats/"+encodeURIComponent(activeChatId)+"?email="+encodeURIComponent(u.email));
   const isBuyer=String(u.email).toLowerCase()===String(c.buyerEmail||"").toLowerCase();
   const otherName=isBuyer?(c.sellerName||"Seller"):(c.buyerName||"Buyer");
   $("#chatHeader").html('<div class="chat-conversation-heading"><span class="chat-avatar large">'+esc(String(otherName).trim().charAt(0).toUpperCase())+'</span><div><h3>'+esc(otherName)+'</h3><div class="muted">'+esc(c.itemTitle||"Borrow Box item")+'</div></div></div>');
   $("#messages").removeClass("hidden").html((c.messages||[]).map(m=>'<div class="bubble-wrap '+(String(m.senderEmail||"").toLowerCase()===u.email.toLowerCase()?"mine":"")+'"><div class="bubble">'+esc(m.text||m.message||"")+'</div></div>').join("")||'<div class="chat-empty-message">This is the start of your conversation. Say hello!</div>');
   $("#chatForm").removeClass("hidden").data("id",activeChatId);
   $("#messages").scrollTop($("#messages")[0].scrollHeight);
  }catch(e){
   if(!quiet)toast(e.message||"Could not open this conversation.",true);
   if(!$("#messages").children().length)$("#chatHeader").html('<div class="msg error">'+esc(e.message||"Could not open this conversation.")+'</div>');
  }finally{loadingMessages=false}
 }
 $("#chatForm").off("submit").on("submit",async function(e){
  e.preventDefault();
  const id=String($(this).data("id")||activeChatId||""),message=$("#chatText").val().trim();
  if(!id){toast("Open a conversation before sending a message.",true);return}
  if(!message)return;
  const send=$(this).find("button").first();
  send.prop("disabled",true).text("Sending…");
  try{
   await api("/chats/"+encodeURIComponent(id)+"/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email,text:message})});
   $("#chatText").val("");
   await openChat(id,true);
  }catch(e){toast(e.message||"Message could not be sent.",true)}
  finally{send.prop("disabled",false).text("Send")}
 });
 await loadChats();
 if(activeChatId&&!chats.some(c=>String(c._id||c.id)===activeChatId))await openChat(activeChatId,true);
 // Poll for new conversations and messages so the other participant sees updates without a manual refresh.
 window.setInterval(()=>{if(!document.hidden)loadChats()},5000);
}
$(function(){
 const saved=localStorage.getItem("color-theme");if(saved)document.documentElement.dataset.theme=saved;
 const page=document.body.dataset.page;
 if(page==="get-started")return getStarted();
 if(page==="login")return user()?go("/home.html"):login();
 if(page==="signup")return user()?go("/home.html"):signup();
 if(page==="home")return home();
 if(page==="browse")return browse();
 if(page==="list-item")return listItem();
 if(page==="item-details")return itemDetails();
 if(page==="profile")return profile();
 if(page==="my-items")return myItems();
 if(page==="seller-history")return history();
 if(page==="chat")return chat();
});
