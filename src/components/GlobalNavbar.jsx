import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import BBIcon from "./BBIcon";
import "./GlobalNavbar.css";

const links=[
 {path:"/home",label:"Home",icon:"home"},
 {path:"/browse",label:"Browse",icon:"store"},
 {path:"/my-items",label:"My Items",icon:"box"},
 {path:"/chat",label:"Chat",icon:"chat"},
 {path:"/profile",label:"Profile",icon:"user"}
];

function getInitialTheme(){
 const saved=localStorage.getItem("color-theme");
 return saved==="dark"||(!("color-theme" in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export default function GlobalNavbar(){
 const location=useLocation(),navigate=useNavigate(),[dark,setDark]=useState(getInitialTheme);
 useEffect(()=>{
   const sync=()=>setDark(document.documentElement.classList.contains("dark"));
   sync();
   window.addEventListener("borrowbox-theme-change",sync);
   return()=>window.removeEventListener("borrowbox-theme-change",sync);
 },[]);
 const toggleTheme=()=>{
   const next=!document.documentElement.classList.contains("dark");
   document.documentElement.classList.toggle("dark",next);
   localStorage.setItem("color-theme",next?"dark":"light");
   setDark(next);
   window.dispatchEvent(new Event("borrowbox-theme-change"));
 };
 const show=links.some(x=>location.pathname===x.path||location.pathname.startsWith(x.path+"/"));
 if(!show)return null;
 const active=links.find(x=>location.pathname===x.path||location.pathname.startsWith(x.path+"/"));
 return <header className="bb-global-navbar">
   <div className="bb-global-nav-inner">
     <button className="bb-global-brand" onClick={()=>navigate("/home")} aria-label="Borrow Box Home">
       <span className="bb-global-logo">◇</span>
       <span className="bb-global-brand-copy"><strong>Borrow Box</strong><small>Campus sharing</small></span>
     </button>
     <nav className="bb-global-links" aria-label="Main navigation">
       {links.map(x=><button key={x.path} className={active?.path===x.path?"active":""} onClick={()=>navigate(x.path)} aria-current={active?.path===x.path?"page":undefined}>
         <BBIcon name={x.icon} size={18}/><span>{x.label}</span>
       </button>)}
     </nav>

   </div>
 </header>;
}