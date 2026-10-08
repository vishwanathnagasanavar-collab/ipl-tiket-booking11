import React, { useState } from "react";
import { TEAM_INFO } from "../lib/mockData";

export default function MatchList({ matches, onSelectMatch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  const allTeams = Array.from(
    new Set(matches.flatMap((m) => [m.team1, m.team2]))
  ).sort();

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (match.city && match.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTeam =
      teamFilter === "ALL" ||
      match.team1 === teamFilter ||
      match.team2 === teamFilter;

    return matchesSearch && matchesTeam;
  });

  const getTeamCode = (teamName) => {
    return TEAM_INFO[teamName]?.code || teamName.substring(0, 3).toUpperCase();
  };

  const getTeamColor = (teamName) => {
    return TEAM_INFO[teamName]?.primaryColor || "#333333";
  };

  const formatMatchDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatMatchTime = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm} IST`;
    }
    return timeStr;
  };

  return (
    <section className="matches-section">
      <div className="section-header">
        <div>
          <h2>📅 IPL 2026 Fixtures & Tickets</h2>
          <p className="section-desc">
            Select a marquee match below to book official stadium tickets
          </p>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
            title="Card View"
          >
            🎴 Cards
          </button>
          <button
            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            📋 Table
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search teams, venue, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="team-filter">
          <label htmlFor="team-select">Filter by Team:</label>
          <select
            id="team-select"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="ALL">All Teams ({allTeams.length})</option>
            {allTeams.map((team) => (
              <option key={team} value={team}>
                {team} ({getTeamCode(team)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏏</div>
          <h3>No matches found</h3>
          <p>Try resetting your search or selecting "All Teams".</p>
          <button
            className="btn-outline"
            onClick={() => {
              setSearchTerm("");
              setTeamFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="matches-grid">
          {filteredMatches.map((match) => {
            const team1Code = getTeamCode(match.team1);
            const team2Code = getTeamCode(match.team2);
            const team1Color = getTeamColor(match.team1);
            const team2Color = getTeamColor(match.team2);

            return (
              <div key={match.id} className="match-card">
                <div className="match-card-header">
                  <span className="match-number">Match #{match.id}</span>
                  <span className="match-badge">
                    {match.status || "Tickets Available"}
                  </span>
                </div>

                <div className="teams-row">
                  <div className="team-col team-left">
                    <div
                      className="team-badge"
                      style={{ backgroundColor: team1Color }}
                    >
                      {team1Code}
                    </div>
                    <span className="team-name">{match.team1}</span>
                  </div>

                  <div className="vs-badge">
                    <span>VS</span>
                  </div>

                  <div className="team-col team-right">
                    <div
                      className="team-badge"
                      style={{ backgroundColor: team2Color }}
                    >
                      {team2Code}
                    </div>
                    <span className="team-name">{match.team2}</span>
                  </div>
                </div>

                <div className="match-details">
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span className="detail-text">{match.venue}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">🗓️</span>
                    <span className="detail-text">
                      {formatMatchDate(match.match_date)} • {formatMatchTime(match.match_time)}
                    </span>
                  </div>
                </div>

                <div className="match-card-footer">
                  <div className="price-tag">
                    <span className="price-label">Starts at</span>
                    <span className="price-amount">₹500</span>
                  </div>

                  <button
                    className="book-now-btn"
                    onClick={() => onSelectMatch(match)}
                  >
                    Book Tickets 🎟️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="matches-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Teams</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>Starts From</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr key={match.id}>
                  <td><strong>#{match.id}</strong></td>
                  <td>
                    <div className="table-teams">
                      <span
                        className="mini-pill"
                        style={{ backgroundColor: getTeamColor(match.team1) }}
                      >
                        {getTeamCode(match.team1)}
                      </span>
                      <span>vs</span>
                      <span
                        className="mini-pill"
                        style={{ backgroundColor: getTeamColor(match.team2) }}
                      >
                        {getTeamCode(match.team2)}
                      </span>
                      <span className="match-teams-full">
                        {match.team1} vs {match.team2}
                      </span>
                    </div>
                  </td>
                  <td>{match.venue}</td>
                  <td>{formatMatchDate(match.match_date)}</td>
                  <td>{formatMatchTime(match.match_time)}</td>
                  <td><span className="table-price">₹500</span></td>
                  <td>
                    <button
                      className="btn-sm-primary"
                      onClick={() => onSelectMatch(match)}
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
