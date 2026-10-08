import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Borrow Box render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="container py-5">
          <div className="alert alert-danger">
            <h1 className="h4">Borrow Box could not render</h1>
            <p className="mb-2">The app started, but a component crashed. Copy this error to the developer:</p>
            <pre className="text-wrap mb-0">{this.state.error.message || String(this.state.error)}</pre>
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload app</button>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = '<main style="font-family:system-ui;padding:2rem"><h1>Borrow Box startup error</h1><p>index.html is missing the #root element.</p></main>';
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>
  );
}
