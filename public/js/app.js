
const API="/api";
const DEMO_ITEMS=[
 { _id:"demo-1",title:"Engineering Mathematics Book",category:"Books",listingType:"rent",price:15,description:"Reference book for semester preparation and exam practice.",condition:"Good",availability:"Available now",owner:"Arun",ownerEmail:"arun.demo@example.com",imageUrl:"https://placehold.co/900x600/F2EFE7/3368A0?text=Mathematics+Book",status:"Available"},
 { _id:"demo-2",title:"Data Structures and Algorithms",category:"Books",listingType:"sale",price:280,description:"DSA textbook with solved examples for project and exam preparation.",condition:"Very Good",availability:"Available now",owner:"Meena",ownerEmail:"meena.demo@example.com",imageUrl:"https://placehold.co/900x600/C8DFDB/3368A0?text=DSA+Book",status:"Available"},
 { _id:"demo-3",title:"Scientific Calculator",category:"Electronics",listingType:"rent",price:10,description:"Student calculator for mathematics and engineering examinations.",condition:"Good",availability:"Available now",owner:"Karthik",ownerEmail:"karthik.demo@example.com",imageUrl:"https://placehold.co/900x600/66A3BF/F2EFE7?text=Calculator",status:"Available"},
 { _id:"demo-4",title:"Wireless Headphones",category:"Electronics",listingType:"rent",price:35,description:"Comfortable headphones for library study and online classes.",condition:"Excellent",availability:"Available now",owner:"Priya",ownerEmail:"priya.demo@example.com",imageUrl:"https://placehold.co/900x600/F2EFE7/3368A0?text=Headphones",status:"Available"},
 { _id:"demo-5",title:"Laptop Stand",category:"Electronics",listingType:"sale",price:450,description:"Foldable stand suitable for study desks.",condition:"Excellent",availability:"Available now",owner:"Vishal",ownerEmail:"vishal.demo@example.com",imageUrl:"https://placehold.co/900x600/C8DFDB/3368A0?text=Laptop+Stand",status:"Available"},
 { _id:"demo-6",title:"Python Programming Notes",category:"Notes",listingType:"rent",price:8,description:"Compact notes for Python programming and practical preparation.",condition:"Good",availability:"Available now",owner:"Divya",ownerEmail:"divya.demo@example.com",imageUrl:"https://placehold.co/900x600/66A3BF/F2EFE7?text=Python+Notes",status:"Available"},
 { _id:"demo-7",title:"DBMS Revision Notes",category:"Notes",listingType:"sale",price:60,description:"Quick revision material covering SQL and normalization.",condition:"Very Good",availability:"Available now",owner:"Rahul",ownerEmail:"rahul.demo@example.com",imageUrl:"https://placehold.co/900x600/F2EFE7/3368A0?text=DBMS+Notes",status:"Available"},
 { _id:"demo-8",title:"Football",category:"Sports",listingType:"rent",price:20,description:"Football for weekend games and practice sessions.",condition:"Good",availability:"Available now",owner:"Sanjay",ownerEmail:"sanjay.demo@example.com",imageUrl:"https://placehold.co/900x600/C8DFDB/3368A0?text=Football",status:"Available"},
 { _id:"demo-9",title:"Badminton Racket",category:"Sports",listingType:"rent",price:25,description:"Lightweight racket for recreational games.",condition:"Excellent",availability:"Available now",owner:"Nisha",ownerEmail:"nisha.demo@example.com",imageUrl:"https://placehold.co/900x600/66A3BF/F2EFE7?text=Badminton+Racket",status:"Available"},
 { _id:"demo-10",title:"Study Backpack",category:"Others",listingType:"sale",price:350,description:"Spacious backpack with laptop compartment.",condition:"Excellent",availability:"Available now",owner:"Aditya",ownerEmail:"aditya.demo@example.com",imageUrl:"https://placehold.co/900x600/F2EFE7/3368A0?text=Study+Backpack",status:"Available"},
 { _id:"demo-11",title:"USB Mechanical Keyboard",category:"Electronics",listingType:"rent",price:25,description:"Mechanical keyboard for coding and project work.",condition:"Excellent",availability:"Available now",owner:"Harish",ownerEmail:"harish.demo@example.com",imageUrl:"https://placehold.co/900x600/C8DFDB/3368A0?text=Keyboard",status:"Available"},
 { _id:"demo-12",title:"Study Desk Lamp",category:"Others",listingType:"sale",price:220,description:"Compact study lamp for late-night reading.",condition:"Good",availability:"Available now",owner:"Sneha",ownerEmail:"sneha.demo@example.com",imageUrl:"https://placehold.co/900x600/66A3BF/F2EFE7?text=Desk+Lamp",status:"Available"}
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
function itemCard(i){const id=encodeURIComponent(i._id||"");return '<article class="card item"><img src="'+esc(i.imageUrl||"/borrow-box-hero.svg")+'" onerror="this.src=&quot;/borrow-box-hero.svg&quot;" alt="'+esc(i.title)+'"><div class="item-body"><span class="pill">'+esc((i.listingType||"rent").toUpperCase())+'</span><h3>'+esc(i.title)+'</h3><div class="muted">'+esc(i.category||"Other")+' · '+esc(i.condition||"")+'</div><div class="price">₹'+Number(i.price||0).toLocaleString("en-IN")+' <small class="muted">'+(i.listingType==="rent"?"/ day":"one-time")+'</small></div><div class="muted">Seller: '+esc(i.owner||"Seller")+'</div><div class="actions"><a class="btn primary" href="/item-details.html?id='+id+'">View details</a></div></div></article>'}
async function getItems(){try{const d=await api("/items");return d.items?.length?d.items:DEMO_ITEMS}catch(e){return DEMO_ITEMS}}
function renderCards(items,target="#items"){const box=$(target);if(!items.length){box.html('<div class="empty">No items found.</div>');return}box.html(items.map(itemCard).join(""))}
function getLocation(){return new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(new Error("Location is not supported by this browser."));navigator.geolocation.getCurrentPosition(p=>resolve({latitude:p.coords.latitude,longitude:p.coords.longitude}),e=>reject(new Error("Please allow location access so the request can be submitted.")),{enableHighAccuracy:true,timeout:10000})})}

async 
function setTheme(next){
 const mode=next==="dark"?"dark":"light";
 document.documentElement.dataset.theme=mode;
 try{localStorage.setItem("color-theme",mode)}catch(e){}
 const src=mode==="dark"?"/borrow-box-hero-dark.svg":"/borrow-box-hero-light.svg";
 $(".themeable-hero").attr("src",src);
 $(".theme-toggle").text(mode==="dark"?"☀ Light":"☾ Dark").attr("aria-pressed",String(mode==="dark"));
}
function bindThemeToggle(){
 $(".theme-toggle").off("click").on("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
 setTheme(document.documentElement.dataset.theme||"light");
}
function bbBrand(){
 return '<a class="bb-brand" href="/" aria-label="Borrow Box home"><span class="bb-brand-icon">◇</span><span class="bb-brand-name">Borrow <b>Box</b><small>Share · Rent · Buy</small></span></a>';
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
     saveUser(d.user);go("/home.html");
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
     saveUser(d.user);go("/home.html");
   }catch(err){$("#formMsg").html('<div class="msg error">'+esc(err.message)+'</div>')}
 });
}
async function home(){
 const u=user();if(!u)return go("/login.html");
 shell("Hello, "+(u.nickname||u.name||"there"),'<p class="muted">Find something useful, list an item, or manage your current requests.</p><div class="actions"><a class="btn primary" href="/browse.html">Browse items</a><a class="btn secondary" href="/list-item.html">List an item</a></div><section class="section"><div class="items" id="items"></div></section>');
 const items=await getItems();renderCards(items.slice(0,8));
}
async function browse(){
 shell("Browse Borrow Box",'<div class="toolbar"><input id="search" placeholder="Search products..."><select id="category"><option value="">All categories</option><option>Books</option><option>Electronics</option><option>Notes</option><option>Sports</option><option>Others</option></select><select id="type"><option value="">Buy or rent</option><option value="sale">Sale</option><option value="rent">Rent</option></select></div><div id="items" class="items"></div>');
 const items=await getItems();function filter(){const q=$("#search").val().toLowerCase();const c=$("#category").val();const t=$("#type").val();renderCards(items.filter(i=>(!q||String(i.title).toLowerCase().includes(q)||String(i.description).toLowerCase().includes(q))&&(!c||i.category===c)&&(!t||i.listingType===t)))}$("#search,#category,#type").on("input change",filter);filter()
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
 $("#detail").html('<div class="detail"><div><img src="'+esc(item.imageUrl||"/borrow-box-hero.svg")+'" onerror="this.src=&quot;/borrow-box-hero.svg&quot;" alt="'+esc(item.title)+'"></div><div class="card"><span class="pill">'+esc((item.listingType||"rent").toUpperCase())+'</span><h2>'+esc(item.title)+'</h2><div class="price">₹'+Number(item.price||0).toLocaleString("en-IN")+' '+(item.listingType==="rent"?'<small class="muted">/ day</small>':'')+'</div><p class="muted">'+esc(item.description)+'</p><div class="kv"><strong>Category</strong><span>'+esc(item.category)+'</span><strong>Condition</strong><span>'+esc(item.condition)+'</span><strong>Availability</strong><span>'+esc(item.availability)+'</span><strong>Seller</strong><span>'+esc(item.owner||"Seller")+'</span></div><div class="actions">'+(own?'<a class="btn secondary" href="/my-items.html">Manage my item</a>':u?'<button class="btn primary" id="requestBtn">'+(item.listingType==="sale"?"Request purchase":"Request to borrow")+'</button><button class="btn secondary" id="chatBtn">Chat with seller</button>':'<a class="btn primary" href="/login.html">Login to request</a>')+'</div><div id="requestBox"></div></div></div>');
 if(u&&!own){$("#chatBtn").on("click",async()=>{try{const d=await api("/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email,itemId:item._id})});go("/chat.html?id="+encodeURIComponent(d._id))}catch(e){toast(e.message,true)}});$("#requestBtn").on("click",()=>requestForm(item))}
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
 const u=user();if(!u)return go("/login.html");shell("My Items",'<div class="actions"><a class="btn primary" href="/list-item.html">+ List new item</a></div><div id="myItems" class="items"></div><section class="section"><h2>My requests</h2><div id="requests"></div></section>');const items=await getItems();renderCards(items.filter(i=>String(i.ownerEmail||"").toLowerCase()===String(u.email).toLowerCase()),"#myItems");try{const d=await api("/borrow-requests/borrower/"+encodeURIComponent(u.email));const owner=await api("/borrow-requests/owner/"+encodeURIComponent(u.email));const rows=[...(d.requests||[]).map(x=>({...x,role:"Buyer/Borrower"})),...(owner.requests||[]).map(x=>({...x,role:"Seller"}))];$("#requests").html(rows.length?'<table class="table"><thead><tr><th>Item</th><th>Role</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.itemTitle)+'</td><td>'+r.role+'</td><td>'+esc(r.requestType)+'</td><td>'+esc(r.status)+'</td><td>'+(r.role==="Seller"&&r.status==="Pending"?'<button class="btn primary approve" data-id="'+r._id+'">Approve</button> <button class="btn danger reject" data-id="'+r._id+'">Reject</button>':r.role==="Buyer/Borrower"&&r.status==="Approved"&&r.requestType==="Borrow"?'<button class="btn secondary return" data-id="'+r._id+'">Mark returned</button>':'')+'</td></tr>').join("")+'</tbody></table>':'<div class="empty">No requests yet.</div>');$(".approve,.reject,.return").on("click",async function(){const id=$(this).data("id");const a=$(this).hasClass("approve")?"approve":$(this).hasClass("reject")?"reject":"return";try{toast((await api("/borrow-requests/"+id+"/"+a,{method:"PUT"})).message);setTimeout(myItems,500)}catch(e){toast(e.message,true)}})}catch(e){$("#requests").html('<div class="msg error">'+esc(e.message)+'</div>')}}
async function history(){
 const u=user();if(!u)return go("/login.html");shell("Seller History",'<div id="history"></div>');try{const d=await api("/borrow-requests/owner/"+encodeURIComponent(u.email));const rows=d.requests||[];$("#history").html(rows.length?'<table class="table"><thead><tr><th>Item</th><th>Buyer</th><th>Type</th><th>Status</th><th>Dates</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.itemTitle)+'</td><td>'+esc(r.borrower)+'</td><td>'+esc(r.requestType)+'</td><td>'+esc(r.status)+'</td><td>'+(r.startDate?new Date(r.startDate).toLocaleDateString("en-IN")+" → "+new Date(r.endDate).toLocaleDateString("en-IN"):"Permanent sale")+'</td></tr>').join("")+'</tbody></table>':'<div class="empty">No seller transactions yet.</div>')}catch(e){$("#history").html('<div class="msg error">'+esc(e.message)+'</div>')}}
async function chat(){
 const u=user();if(!u)return go("/login.html");shell("Chat",'<div class="chat-layout"><aside class="card"><h3>Conversations</h3><div id="chatList" class="chat-list"></div></aside><section class="card"><div id="chatHeader" class="empty">Select a conversation.</div><div id="messages" class="messages hidden"></div><form id="chatForm" class="chat-compose hidden"><input id="chatText" placeholder="Write a message..." maxlength="2000"><button class="btn primary">Send</button></form></section></div>');
 let chats=[];try{chats=await api("/chats/user/"+encodeURIComponent(u.email))}catch(e){}
 if(!chats.length){$("#chatList").html('<div class="empty">No conversations yet.<br>Open an item and choose Chat with seller.</div>');return}
 $("#chatList").html(chats.map(c=>'<div class="chat-row" data-id="'+c._id+'"><strong>'+esc(c.otherName||"Seller")+'</strong><div class="muted">'+esc(c.itemTitle||"Product chat")+'</div></div>').join(""));
 async function openChat(id){$(".chat-row").removeClass("active");$('.chat-row[data-id="'+id+'"]').addClass("active");try{const c=await api("/chats/"+id+"?email="+encodeURIComponent(u.email));$("#chatHeader").html('<h3>'+esc(u.email===c.buyerEmail?c.sellerName:c.buyerName)+'</h3><div class="muted">'+esc(c.itemTitle)+'</div>');$("#messages").removeClass("hidden").html((c.messages||[]).map(m=>'<div class="bubble '+(m.senderEmail.toLowerCase()===u.email.toLowerCase()?"mine":"")+'">'+esc(m.text)+'</div>').join(""));$("#chatForm").removeClass("hidden").data("id",id);$("#messages").scrollTop($("#messages")[0].scrollHeight)}catch(e){toast(e.message,true)}}
 $(".chat-row").on("click",function(){openChat($(this).data("id"))});$("#chatForm").on("submit",async function(e){e.preventDefault();const id=$(this).data("id"),text=$("#chatText").val().trim();if(!text)return;try{await api("/chats/"+id+"/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email,text})});$("#chatText").val("");openChat(id)}catch(e){toast(e.message,true)}});const initial=new URLSearchParams(location.search).get("id");openChat(initial||chats[0]._id)
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
