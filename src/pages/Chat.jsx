import React,{useEffect,useMemo,useRef,useState} from "react";
import {useNavigate} from "react-router-dom";
import BBIcon from "../components/BBIcon";
import "./Chat.css";

const USERS_KEY="borrowBoxUsers";
const SESSION_KEY="borrowBoxUser";
const MSG_KEY="borrowBoxMessages";

const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch{return fallback}};
const getName=u=>u?.nickname||u?.name||u?.email?.split("@")[0]||"Borrow Box Member";
const getInitial=u=>getName(u).charAt(0).toUpperCase();
const getPic=u=>u?.profilePicture||"";
const conversationId=(a,b)=>[String(a||"demo").toLowerCase(),String(b||"demo").toLowerCase()].sort().join("::");

function Chat(){
  const navigate=useNavigate();
  const endRef=useRef(null);
  const [user,setUser]=useState(()=>read(SESSION_KEY,null));
  const [users,setUsers]=useState([]);
  const [selected,setSelected]=useState(null);
  const [text,setText]=useState("");
  const [search,setSearch]=useState("");
  const [openMenu,setOpenMenu]=useState(null);
  const [replyTo,setReplyTo]=useState(null);
  const [messages,setMessages]=useState(()=>read(MSG_KEY,[]));

  useEffect(()=>{
    const refresh=()=>{
      const current=read(SESSION_KEY,null);
      const all=read(USERS_KEY,[]);
      setUser(current);
      const contacts=Array.isArray(all)?all.filter(u=>String(u.email).toLowerCase()!==String(current?.email).toLowerCase()):[];
      setUsers(contacts);
      setSelected(prev=>prev&&contacts.some(u=>String(u.email).toLowerCase()===String(prev.email).toLowerCase())?prev:(contacts[0]||{email:"demo@borrowbox.local",nickname:"Borrow Box Demo",name:"Borrow Box Demo"}));
    };
    refresh();
    window.addEventListener("borrowbox-profile-updated",refresh);
    window.addEventListener("storage",refresh);
    return()=>{window.removeEventListener("borrowbox-profile-updated",refresh);window.removeEventListener("storage",refresh)};
  },[]);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[messages,selected]);

  const selectedEmail=selected?.email||"demo@borrowbox.local";
  const currentEmail=user?.email||"guest@borrowbox.local";
  const cid=conversationId(currentEmail,selectedEmail);
  const currentMessages=useMemo(()=>messages.filter(m=>m.conversationId===cid),[messages,cid]);
  const contacts=useMemo(()=>{
    const list=[...users];
    if(!list.length) return [selected||{email:"demo@borrowbox.local",nickname:"Borrow Box Demo",name:"Borrow Box Demo"}];
    return list.filter(u=>getName(u).toLowerCase().includes(search.toLowerCase())||String(u.email).toLowerCase().includes(search.toLowerCase()));
  },[users,search,selected]);

  const persist=next=>{setMessages(next);localStorage.setItem(MSG_KEY,JSON.stringify(next));};

  const send=e=>{
    e.preventDefault();
    const clean=text.trim();
    if(!clean)return;
    const now=new Date().toISOString();
    const next=[...messages,{
      id:Date.now(),
      conversationId:cid,
      senderEmail:currentEmail,
      recipientEmail:selectedEmail,
      sender:getName(user),
      text:replyTo?("↩ "+replyTo.text+"\n"+clean):clean,
      mine:true,
      createdAt:now,
      status:"Delivered"
    }];
    persist(next);
    setText("");
    setReplyTo(null);
  };

  const removeMessage=id=>{persist(messages.filter(m=>m.id!==id));setOpenMenu(null)};
  const copyMessage=m=>{navigator.clipboard?.writeText(m.text);setOpenMenu(null)};
  const reply=m=>{setReplyTo(m);setText("");setOpenMenu(null)};
  const formatTime=d=>new Date(d).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  const lastFor=u=>{const id=conversationId(currentEmail,u?.email);return messages.filter(m=>m.conversationId===id).at(-1)};
  const avatar=(u,size="md")=><div className={"chat-avatar "+size}>{getPic(u)?<img src={getPic(u)} alt={getName(u)+" profile"}/>:getInitial(u)}</div>;

  if(!user)return <div className="chat-loading-screen"><div className="chat-loader"/><p>Opening messages...</p></div>;

  return <div className="chat-page" onClick={()=>openMenu!==null&&setOpenMenu(null)}>
    <header className="chat-topbar">
      <button className="chat-back" onClick={()=>navigate("/browse")}><BBIcon name="arrow-left" size={18}/><span>Marketplace</span></button>
      <div className="chat-top-brand"><div className="chat-brand-mark">◇</div><div><strong>Borrow Box</strong><small>Messages</small></div></div>
      <button className="chat-top-profile" onClick={()=>navigate("/profile")}>{avatar(user,"xs")}<span>{getName(user)}</span></button>
    </header>

    <div className="chat-layout">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head"><div><span>MESSAGES</span><h1>Inbox</h1></div><span className="chat-count">{messages.length}</span></div>
        <div className="chat-search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search people..."/></div>
        <div className="chat-conversations">
          {contacts.map(contact=>{
            const active=String(contact.email).toLowerCase()===String(selectedEmail).toLowerCase();
            const last=lastFor(contact);
            return <button className={"chat-conversation "+(active?"selected":"")} key={contact.email} onClick={e=>{e.stopPropagation();setSelected(contact);setOpenMenu(null)}}>
              {avatar(contact,"md")}
              <span className="chat-conversation-body"><strong>{getName(contact)}</strong><small>{contact.email||"Community member"}</small><em>{last?.text||"Start a conversation"}</em></span>
            </button>
          })}
        </div>
      </aside>

      <section className="chat-main">
        <div className="chat-person-header">
          {avatar(selected,"md")}
          <div className="chat-person-copy"><strong>{getName(selected)}</strong><span>{selected?.email==="demo@borrowbox.local"?"Demo conversation":"Borrow Box Member · Available to chat"}</span></div>
          <button onClick={()=>navigate("/profile")}><BBIcon name="user" size={17}/> Profile</button>
        </div>

        <div className="chat-product-strip"><div className="chat-product-icon"><BBIcon name="chat" size={19}/></div><div><span>PRIVATE CHAT</span><strong>Discuss items, borrowing, renting or selling</strong></div><span className="chat-safe"><BBIcon name="shield" size={14}/> Local storage</span></div>

        <div className="chat-messages-area">
          {!currentMessages.length?<div className="chat-welcome"><div className="chat-welcome-avatar">{avatar(selected,"lg")}</div><h2>Start chatting with {getName(selected)}</h2><p>Send a message to discuss an item or arrange a borrow, rent or sale.</p></div>:
          currentMessages.map(m=><div className={"chat-message-row "+(m.mine?"mine":"received")} key={m.id}>
            {avatar(m.mine?user:selected,"xs")}
            <div className="chat-message-content">
              <div className="chat-message-meta"><strong>{m.mine?"You":m.sender||getName(selected)}</strong><time>{formatTime(m.createdAt)}</time></div>
              <div className="chat-message-line">
                <div className="chat-bubble">{m.text.split("\n").map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</div>
                <div className="chat-message-menu-wrap" onClick={e=>e.stopPropagation()}><button className="chat-message-menu-btn" type="button" onClick={()=>setOpenMenu(openMenu===m.id?null:m.id)}>⋮</button>
                  {openMenu===m.id&&<div className="chat-message-menu"><button type="button" onClick={()=>reply(m)}>Reply</button><button type="button" onClick={()=>copyMessage(m)}>Copy</button>{m.mine&&<button type="button" onClick={()=>removeMessage(m.id)}>Delete</button>}<button type="button" onClick={()=>setOpenMenu(null)}>Close</button></div>}
                </div>
              </div>
              <span className="chat-message-status">{m.mine?"✓✓ Delivered":"Received"}</span>
            </div>
          </div>)}
          <div ref={endRef}/>
        </div>

        {replyTo&&<div className="chat-reply-bar"><div><strong>Replying to {replyTo.mine?"your message":replyTo.sender}</strong><span>{replyTo.text}</span></div><button type="button" onClick={()=>setReplyTo(null)}>×</button></div>}

        <form className="chat-composer" onSubmit={send}>
          <button type="button" className="chat-attach" title="Attachment storage requires a backend"><BBIcon name="upload" size={18}/></button>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder={replyTo?"Write your reply...":"Type a message..."} maxLength={2000}/>
          <button className="chat-send" disabled={!text.trim()}><BBIcon name="send" size={19}/></button>
        </form>
        <div className="chat-privacy"><BBIcon name="shield" size={13}/> Demo mode — messages and profile pictures stay in this browser.</div>
      </section>
    </div>
  </div>;
}
export default Chat;