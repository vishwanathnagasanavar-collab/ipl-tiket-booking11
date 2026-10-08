import React from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";

export default function Navbar({ activeTab, setActiveTab, bookingCount, onOpenConfig }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab("matches")}>
          <div className="brand-logo">
            <span className="trophy-icon">🏆</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">IPL TicketHub</span>
            <span className="brand-subtitle">TATA IPL 2026 Official Portal</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === "matches" ? "active" : ""}`}
            onClick={() => setActiveTab("matches")}
          >
            🏏 Matches
          </button>
          <button
            className={`nav-btn ${activeTab === "book" ? "active" : ""}`}
            onClick={() => setActiveTab("book")}
          >
            🎟️ Book Tickets
          </button>
          <button
            className={`nav-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Bookings
            {bookingCount > 0 && <span className="nav-badge">{bookingCount}</span>}
          </button>
          <button
            className={`nav-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            📊 Analytics
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            className={`status-pill ${isSupabaseConfigured ? "status-connected" : "status-demo"}`}
            onClick={onOpenConfig}
            title="Click to view database connection status & SQL setup"
          >
            <span className="status-dot"></span>
            {isSupabaseConfigured ? "Supabase Connected" : "Local Demo Mode"}
          </button>

          <button
            className="settings-icon-btn"
            onClick={onOpenConfig}
            title="Database Configuration & SQL Schema"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
