import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import BBIcon from "./BBIcon";
import "./NotificationCenter.css";

const API_URL="http://localhost:5000";
const KEY="borrowBoxSeenNotifications";

export default function NotificationCenter(){
 const navigate=useNavigate();
 const[user,setUser]=useState(null);const[open,setOpen]=useState(false);const[notifications,setNotifications]=useState([]);
 useEffect(()=>{try{setUser(JSON.parse(localStorage.getItem("borrowBoxUser")||"null"))}catch{setUser(null)}},[]);
 const load=async()=>{if(!user?.email)return;try{
   const email=encodeURIComponent(user.email);
   const [ownerR,borrowR,chatR]=await Promise.all([
    fetch(`${API_URL}/api/borrow-requests/owner/${email}`),
    fetch(`${API_URL}/api/borrow-requests/borrower/${email}`),
    fetch(`${API_URL}/api/chats/user/${email}`)
   ]);
   const ownerD=await ownerR.json().catch(()=>[]),borrowD=await borrowR.json().catch(()=>[]),chatD=await chatR.json().catch(()=>[]);
   const owner=Array.isArray(ownerD)?ownerD:ownerD.requests||[];const borrower=Array.isArray(borrowD)?borrowD:borrowD.requests||[];const chats=Array.isArray(chatD)?chatD:chatD.chats||[];
   const list=[];
   owner.slice(0,20).forEach(r=>{list.push({id:`order-${r._id}-${r.status}`,type:"order",title:r.status==="Pending"?"New order request":`Order ${r.status}`,text:`${r.itemTitle||"Item"} · ${r.borrower||"Student"}`,time:r.updatedAt||r.createdAt,status:r.status,action:()=>navigate(`/my-items`)})});
   borrower.slice(0,20).forEach(r=>{list.push({id:`borrow-${r._id}-${r.status}`,type:"order",title:r.status==="Approved"?"Order approved":r.status==="Rejected"?"Order rejected":`Order ${r.status}`,text:`${r.itemTitle||"Item"} · ${r.owner||"Seller"}`,time:r.updatedAt||r.createdAt,status:r.status,action:()=>navigate(`/my-items`)})});
   chats.slice(0,20).forEach(c=>{const m=c.messages?.[c.messages.length-1];if(m)list.push({id:`chat-${c._id}-${m._id||m.createdAt}`,type:"chat",title:"New chat message",text:`${m.senderName||"Student"}: ${m.text}`,time:m.createdAt||c.updatedAt,action:()=>navigate(`/chat/${c._id}`)})});
   list.sort((a,b)=>new Date(b.time||0)-new Date(a.time||0));
   let seen={};try{seen=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}
   setNotifications(list.map(n=>({...n,unread:!seen[n.id]})).slice(0,30));
 }catch{}}
 useEffect(()=>{load();const t=setInterval(load,3000);return()=>clearInterval(t)},[user?.email]);
 const unread=notifications.filter(n=>n.unread).length;
 const markAll=()=>{const seen={};notifications.forEach(n=>seen[n.id]=true);localStorage.setItem(KEY,JSON.stringify(seen));setNotifications(x=>x.map(n=>({...n,unread:false})));};
 const openNotification=n=>{localStorage.setItem(KEY,JSON.stringify({...(()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}})(),[n.id]:true}));setNotifications(x=>x.map(v=>v.id===n.id?{...v,unread:false}:v));setOpen(false);n.action?.()};
 return <div className="bb-notification-wrap">
  <button className={`bb-notification-button ${unread?"has-unread":""}`} onClick={()=>setOpen(v=>!v)} aria-label="Notifications" title="Notifications"><BBIcon name="notification" size={20}/>{unread>0&&<span className="bb-notification-count">{unread>99?"99+":unread}</span>}</button>
  {open&&<><button className="bb-notification-backdrop" aria-label="Close notifications" onClick={()=>setOpen(false)}/><div className="bb-notification-panel"><div className="bb-notification-head"><div><strong>Notifications</strong><span>{unread?`${unread} new`:"You're all caught up"}</span></div>{unread>0&&<button onClick={markAll}>Mark all read</button>}</div><div className="bb-notification-list">{notifications.length?notifications.map(n=><button key={n.id} className={`bb-notification-item ${n.unread?"unread":""}`} onClick={()=>openNotification(n)}><span className="bb-notification-item-icon"><BBIcon name={n.type==="chat"?"chat":"notification"} size={17}/></span><span className="bb-notification-item-copy"><strong>{n.title}</strong><span>{n.text}</span><small>{new Date(n.time||Date.now()).toLocaleString()}</small></span>{n.unread&&<i/>}</button>):<div className="bb-notification-empty"><BBIcon name="notification" size={24}/><strong>No notifications yet</strong><span>New orders, approvals and chat messages will appear here.</span></div>}</div></div></>}
 </div>;
}
