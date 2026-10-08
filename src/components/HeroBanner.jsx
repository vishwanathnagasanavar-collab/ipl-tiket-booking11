import React from "react";

export default function HeroBanner({ onBookClick, onExploreClick }) {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-tag">
          <span className="live-pulse"></span>
          TATA IPL 2026 OFFICIAL TICKETING PARTNER
        </div>
        <h1 className="hero-heading">
          Feel the Roar of the Stadium Live! 🏏
        </h1>
        <p className="hero-subtext">
          Book authentic stadium tickets for all 10 IPL franchises. Instant digital passes, turnstile QR access & 100% genuine tickets.
        </p>

        <div className="hero-actions">
          <button className="hero-btn-primary" onClick={onBookClick}>
            🎟️ Book Match Tickets
          </button>
          <button className="hero-btn-secondary" onClick={onExploreClick}>
            View Match Schedule 🗓️
          </button>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Instant Digital Pass</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span>100% Verified Entry</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Mobile QR Turnstile Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
