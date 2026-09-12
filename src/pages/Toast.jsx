import React, { useEffect, useState } from "react";
import "./Toast.css";

export function showToast(message, type = "success") {
  window.dispatchEvent(new CustomEvent("borrowbox-toast", { detail: { message, type } }));
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = (event) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message: event.detail.message, type: event.detail.type || "success" }]);
      setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 2800);
    };
    window.addEventListener("borrowbox-toast", handler);
    return () => window.removeEventListener("borrowbox-toast", handler);
  }, []);
  return <div className="bb-toast-stack" aria-live="polite">{toasts.map((toast) => <div className={`bb-toast ${toast.type}`} key={toast.id} role="alert"><span className="bb-toast-icon">{toast.type === "success" ? "✓" : "!"}</span><span className="bb-toast-message">{toast.message}</span><button className="bb-toast-close" onClick={() => setToasts((list) => list.filter((item) => item.id !== toast.id))} aria-label="Close">×</button></div>)}</div>;
}
