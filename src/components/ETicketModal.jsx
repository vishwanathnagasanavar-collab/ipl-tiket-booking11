import React from "react";
import { TEAM_INFO } from "../lib/mockData";

export default function ETicketModal({ booking, onClose, onViewAllBookings }) {
  if (!booking) return null;

  const match = booking.matches || {};
  const team1 = match.team1 || "Team 1";
  const team2 = match.team2 || "Team 2";
  const team1Info = TEAM_INFO[team1] || { code: "T1", primaryColor: "#1e3a8a" };
  const team2Info = TEAM_INFO[team2] || { code: "T2", primaryColor: "#b91c1c" };

  const handlePrint = () => {
    window.print();
  };

  const bookingCode = `IPL26-BK-${String(booking.id).slice(-6).toUpperCase()}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-actions-top">
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="printable-ticket" id="printable-ticket">
          {/* Ticket Header */}
          <div className="ticket-top-banner">
            <div className="ticket-ipl-logo">
              <span className="trophy">🏆</span>
              <div>
                <div className="ipl-title">TATA IPL 2026</div>
                <div className="ipl-subtitle">OFFICIAL MATCH PASS</div>
              </div>
            </div>
            <div className="ticket-status-stamp">
              <span className="stamp-text">{booking.booking_status || "CONFIRMED"}</span>
            </div>
          </div>

          {/* Teams Banner */}
          <div className="ticket-teams-strip">
            <div className="ticket-team">
              <span
                className="ticket-team-badge"
                style={{ backgroundColor: team1Info.primaryColor }}
              >
                {team1Info.code}
              </span>
              <span className="ticket-team-title">{team1}</span>
            </div>

            <div className="ticket-vs-circle">VS</div>

            <div className="ticket-team">
              <span
                className="ticket-team-badge"
                style={{ backgroundColor: team2Info.primaryColor }}
              >
                {team2Info.code}
              </span>
              <span className="ticket-team-title">{team2}</span>
            </div>
          </div>

          {/* Stadium & Fixture Info */}
          <div className="ticket-body">
            <div className="ticket-info-grid">
              <div className="info-cell">
                <span className="cell-label">VENUE</span>
                <span className="cell-value">{match.venue || "Official Stadium"}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">CATEGORY</span>
                <span className="cell-value highlight">{booking.seat_type}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">TICKETS</span>
                <span className="cell-value">{booking.number_of_tickets} Seat(s)</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">ENTRY GATE</span>
                <span className="cell-value">Gate {((booking.id % 8) + 1)} • Turnstile A</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">PASS HOLDER</span>
                <span className="cell-value">{booking.customer_name}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">AMOUNT PAID</span>
                <span className="cell-value price">₹{Number(booking.total_price).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Simulated QR Code and Barcode */}
            <div className="ticket-verification-section">
              <div className="qr-box">
                {/* Simulated SVG QR code */}
                <svg
                  className="qr-code-svg"
                  viewBox="0 0 100 100"
                  width="85"
                  height="85"
                >
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Outer corner 1 */}
                  <rect x="5" y="5" width="28" height="28" fill="#111827" />
                  <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                  <rect x="13" y="13" width="12" height="12" fill="#111827" />
                  {/* Outer corner 2 */}
                  <rect x="67" y="5" width="28" height="28" fill="#111827" />
                  <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                  <rect x="75" y="13" width="12" height="12" fill="#111827" />
                  {/* Outer corner 3 */}
                  <rect x="5" y="67" width="28" height="28" fill="#111827" />
                  <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                  <rect x="13" y="75" width="12" height="12" fill="#111827" />
                  {/* Data dots */}
                  <rect x="38" y="10" width="6" height="6" fill="#111827" />
                  <rect x="48" y="15" width="6" height="6" fill="#111827" />
                  <rect x="38" y="25" width="6" height="6" fill="#111827" />
                  <rect x="48" y="35" width="6" height="6" fill="#111827" />
                  <rect x="15" y="42" width="6" height="6" fill="#111827" />
                  <rect x="25" y="52" width="6" height="6" fill="#111827" />
                  <rect x="38" y="45" width="8" height="8" fill="#111827" />
                  <rect x="55" y="50" width="6" height="6" fill="#111827" />
                  <rect x="68" y="42" width="6" height="6" fill="#111827" />
                  <rect x="80" y="52" width="6" height="6" fill="#111827" />
                  <rect x="40" y="70" width="8" height="8" fill="#111827" />
                  <rect x="55" y="75" width="6" height="6" fill="#111827" />
                  <rect x="70" y="70" width="6" height="6" fill="#111827" />
                  <rect x="80" y="80" width="8" height="8" fill="#111827" />
                </svg>
                <span className="qr-hint">Scan at Turnstile</span>
              </div>

              <div className="barcode-box">
                <div className="barcode-bars">
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-mid"></div>
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-mid"></div>
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-mid"></div>
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-mid"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-mid"></div>
                  <div className="bar b-wide"></div>
                  <div className="bar b-thin"></div>
                  <div className="bar b-wide"></div>
                </div>
                <div className="barcode-id">{bookingCode}</div>
                <div className="security-notice">
                  Strictly non-transferable • Valid government photo ID required
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="ticket-modal-buttons">
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print / Download Ticket Pass
          </button>
          {onViewAllBookings && (
            <button
              className="btn-view-bookings"
              onClick={() => {
                onClose();
                onViewAllBookings();
              }}
            >
              📋 View All Bookings
            </button>
          )}
          <button className="btn-close-secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
