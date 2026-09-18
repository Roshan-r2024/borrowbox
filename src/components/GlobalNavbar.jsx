import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import BBIcon from "./BBIcon";
import "./GlobalNavbar.css";
const links=[{path:"/home",label:"Home",icon:"home"},{path:"/browse",label:"Browse",icon:"store"},{path:"/my-items",label:"My Items",icon:"box"},{path:"/chat",label:"Chat",icon:"chat"},{path:"/profile",label:"Profile",icon:"user"}];
export default function GlobalNavbar(){
 const location=useLocation(),navigate=useNavigate(),[dark,setDark]=useState(()=>document.documentElement.classList.contains("dark"));
 useEffect(()=>{const sync=()=>setDark(document.documentElement.classList.contains("dark"));sync();window.addEventListener("borrowbox-theme-change",sync);return()=>window.removeEventListener("borrowbox-theme-change",sync)},[]);
 const toggleTheme=()=>{const next=!document.documentElement.classList.contains("dark");document.documentElement.classList.toggle("dark",next);localStorage.setItem("color-theme",next?"dark":"light");setDark(next);window.dispatchEvent(new Event("borrowbox-theme-change"))};
 const show=links.some(x=>location.pathname===x.path||location.pathname.startsWith(x.path+"/")); if(!show)return null;
 const active=links.find(x=>location.pathname===x.path||location.pathname.startsWith(x.path+"/"));
 return <header className="bb-global-navbar"><div className="bb-global-nav-inner"><button className="bb-global-brand" onClick={()=>navigate("/home")}><span className="bb-global-logo">◇</span><span className="bb-global-brand-copy"><strong>Borrow Box</strong><small>Campus sharing</small></span></button><nav className="bb-global-links" aria-label="Main navigation">{links.map(x=><button key={x.path} className={active?.path===x.path?"active":""} onClick={()=>navigate(x.path)}><BBIcon name={x.icon} size={17}/><span>{x.label}</span></button>)}</nav><button className="bb-global-theme" onClick={toggleTheme} aria-label={dark?"Switch to light theme":"Switch to dark theme"} title={dark?"Light mode":"Dark mode"}>{dark?"☀":"☾"}</button></div></header>;
}