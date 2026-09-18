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
     <button id="theme-toggle" className="bb-global-theme" onClick={toggleTheme} aria-label={dark?"Switch to light theme":"Switch to dark theme"} title={dark?"Light mode":"Dark mode"}>
       {dark?
         <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"/></svg>
         :
         <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>}
     </button>
   </div>
 </header>;
}