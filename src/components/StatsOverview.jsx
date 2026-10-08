import React from "react";

export default function StatsOverview({ matches, bookings, onBookNew, onViewMatches }) {
  const confirmedBookings = bookings.filter((b) => b.booking_status === "Confirmed");

  const totalTicketsSold = confirmedBookings.reduce(
    (acc, b) => acc + Number(b.number_of_tickets || 0),
    0
  );

  const totalRevenue = confirmedBookings.reduce(
    (acc, b) => acc + Number(b.total_price || 0),
    0
  );

  // Seat tier breakdown
  const tierStats = {
    General: { count: 0, revenue: 0 },
    Premium: { count: 0, revenue: 0 },
    VIP: { count: 0, revenue: 0 },
  };

  confirmedBookings.forEach((b) => {
    const tier = b.seat_type || "General";
    if (tierStats[tier]) {
      tierStats[tier].count += Number(b.number_of_tickets || 0);
      tierStats[tier].revenue += Number(b.total_price || 0);
    }
  });

  return (
    <div className="stats-dashboard">
      <div className="section-header">
        <div>
          <h2>📊 IPL Ticket Sales & Analytics</h2>
          <p className="section-desc">
            Real-time performance metrics for TATA IPL 2026 ticketing operations
          </p>
        </div>
        <div className="list-top-actions">
          <button className="btn-primary" onClick={onBookNew}>
            🎟️ Book Tickets
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card revenue-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Revenue</span>
            <span className="kpi-value">₹{totalRevenue.toLocaleString("en-IN")}</span>
            <span className="kpi-subtext">From {confirmedBookings.length} confirmed orders</span>
          </div>
        </div>

        <div className="kpi-card tickets-card">
          <div className="kpi-icon">🎟️</div>
          <div className="kpi-content">
            <span className="kpi-label">Tickets Issued</span>
            <span className="kpi-value">{totalTicketsSold.toLocaleString("en-IN")}</span>
            <span className="kpi-subtext">Stadium gate passes generated</span>
          </div>
        </div>

        <div className="kpi-card matches-card">
          <div className="kpi-icon">🏏</div>
          <div className="kpi-content">
            <span className="kpi-label">Scheduled Matches</span>
            <span className="kpi-value">{matches.length}</span>
            <span className="kpi-subtext">Across top Indian stadiums</span>
          </div>
        </div>

        <div className="kpi-card avg-card">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <span className="kpi-label">Avg Order Value</span>
            <span className="kpi-value">
              ₹
              {confirmedBookings.length > 0
                ? Math.round(totalRevenue / confirmedBookings.length).toLocaleString("en-IN")
                : 0}
            </span>
            <span className="kpi-subtext">Per booking transaction</span>
          </div>
        </div>
      </div>

      {/* Seating Categories Breakdown */}
      <div className="analytics-details-grid">
        <div className="analytics-panel">
          <h3>🎟️ Seating Category Distribution</h3>
          <p className="panel-desc">Breakdown of tickets sold and revenue by tier</p>

          <div className="tiers-list">
            {Object.entries(tierStats).map(([tierName, data]) => {
              const pct = totalTicketsSold > 0 ? Math.round((data.count / totalTicketsSold) * 100) : 0;
              return (
                <div key={tierName} className="tier-stat-item">
                  <div className="tier-stat-head">
                    <span className={`tier-badge badge-${tierName.toLowerCase()}`}>
                      {tierName}
                    </span>
                    <span className="tier-rev">
                      ₹{data.revenue.toLocaleString("en-IN")} ({data.count} tickets)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill fill-${tierName.toLowerCase()}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="tier-pct">{pct}% of tickets</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-panel">
          <h3>🏟️ Stadium & Venue Highlights</h3>
          <p className="panel-desc">Upcoming key stadiums hosting matches</p>

          <div className="stadium-list">
            {matches.slice(0, 4).map((m) => (
              <div key={m.id} className="stadium-item">
                <div className="stadium-info">
                  <strong>{m.team1} vs {m.team2}</strong>
                  <span className="stadium-name">📍 {m.venue}</span>
                </div>
                <span className="stadium-date">
                  {m.match_date}
                </span>
              </div>
            ))}
          </div>

          <div className="panel-footer-btn">
            <button className="btn-outline" onClick={onViewMatches}>
              Explore All {matches.length} Stadiums & Fixtures →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
