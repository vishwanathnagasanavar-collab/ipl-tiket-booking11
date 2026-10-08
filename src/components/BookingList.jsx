import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookingList({ refresh, onViewTicket, onBookNew, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          customer_name,
          email,
          phone,
          match_id,
          seat_type,
          number_of_tickets,
          price_per_ticket,
          total_price,
          booking_status,
          created_at,
          matches (
            team1,
            team2,
            venue
          )
        `)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        if (showToast) showToast("error", "Error loading bookings: " + error.message);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, refresh]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(id);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ booking_status: "Cancelled" })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, booking_status: "Cancelled" } : b))
      );

      if (showToast) {
        showToast("info", `Booking #${id} has been cancelled.`);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      if (showToast) {
        showToast("error", `Failed to cancel booking: ${err.message}`);
      }
    } finally {
      setCancellingId(null);
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) return;

    const headers = [
      "Booking ID",
      "Customer Name",
      "Email",
      "Phone",
      "Teams",
      "Venue",
      "Seat Type",
      "Tickets",
      "Price Per Ticket",
      "Total Price",
      "Status",
      "Date",
    ];

    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer_name}"`,
      `"${b.email}"`,
      `"${b.phone || ""}"`,
      `"${b.matches ? `${b.matches.team1} vs ${b.matches.team2}` : ""}"`,
      `"${b.matches?.venue || ""}"`,
      b.seat_type,
      b.number_of_tickets,
      b.price_per_ticket,
      b.total_price,
      b.booking_status,
      b.created_at ? new Date(b.created_at).toLocaleDateString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ipl_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast("success", "Exported bookings to CSV file!");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchTeams = booking.matches
      ? `${booking.matches.team1} ${booking.matches.team2}`.toLowerCase()
      : "";
    const nameMatch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = String(booking.id).includes(searchTerm);
    const matchesSearch = nameMatch || emailMatch || idMatch || matchTeams.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      booking.booking_status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const confirmedCount = bookings.filter((b) => b.booking_status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.booking_status === "Cancelled").length;

  return (
    <div className="booking-list-container">
      <div className="section-header">
        <div>
          <h2>🎟️ All Bookings & Stadium Passes</h2>
          <p className="section-desc">
            Manage your booked tickets, reprint digital passes, or cancel orders
          </p>
        </div>

        <div className="list-top-actions">
          {bookings.length > 0 && (
            <button className="btn-export-csv" onClick={handleExportCSV}>
              📥 Export CSV
            </button>
          )}
          {onBookNew && (
            <button className="btn-primary" onClick={onBookNew}>
              + Book New Ticket
            </button>
          )}
        </div>
      </div>

      {/* Bookings Stats Pill Bar */}
      <div className="bookings-summary-bar">
        <div className="summary-pill total">
          <span className="pill-count">{bookings.length}</span>
          <span className="pill-title">Total Bookings</span>
        </div>
        <div className="summary-pill confirmed">
          <span className="pill-count">{confirmedCount}</span>
          <span className="pill-title">Confirmed Passes</span>
        </div>
        <div className="summary-pill cancelled">
          <span className="pill-count">{cancelledCount}</span>
          <span className="pill-title">Cancelled</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, booking #, team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="status-filter">
          <button
            className={`status-tab ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            All ({bookings.length})
          </button>
          <button
            className={`status-tab ${statusFilter === "Confirmed" ? "active" : ""}`}
            onClick={() => setStatusFilter("Confirmed")}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            className={`status-tab ${statusFilter === "Cancelled" ? "active" : ""}`}
            onClick={() => setStatusFilter("Cancelled")}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings from database...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎟️</div>
          <h3>No bookings found</h3>
          <p>
            {searchTerm || statusFilter !== "ALL"
              ? "No bookings match your current search criteria."
              : "No tickets have been booked yet. Book your first IPL match ticket today!"}
          </p>
          {onBookNew && (
            <button className="btn-primary" onClick={onBookNew}>
              Book Match Tickets Now 🏏
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Match Fixture</th>
                <th>Venue</th>
                <th>Seat Tier</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const isConfirmed = booking.booking_status === "Confirmed";
                return (
                  <tr key={booking.id} className={`booking-row status-${booking.booking_status?.toLowerCase()}`}>
                    <td>
                      <span className="ref-tag">#BK-{String(booking.id).slice(-6)}</span>
                    </td>
                    <td>
                      <div className="cust-info">
                        <strong>{booking.customer_name}</strong>
                        <span className="cust-email">{booking.email}</span>
                        {booking.phone && <span className="cust-phone">{booking.phone}</span>}
                      </div>
                    </td>
                    <td>
                      {booking.matches ? (
                        <div className="match-tag">
                          <strong>{booking.matches.team1}</strong>
                          <span className="vs-tiny">vs</span>
                          <strong>{booking.matches.team2}</strong>
                        </div>
                      ) : (
                        <span className="text-muted">Match #{booking.match_id}</span>
                      )}
                    </td>
                    <td>
                      <span className="venue-cell">
                        {booking.matches?.venue || "IPL Venue"}
                      </span>
                    </td>
                    <td>
                      <span className={`seat-badge badge-${booking.seat_type?.toLowerCase()}`}>
                        {booking.seat_type}
                      </span>
                    </td>
                    <td>
                      <span className="ticket-count-badge">
                        {booking.number_of_tickets} seat{booking.number_of_tickets > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td>
                      <strong className="table-price-total">
                        ₹{Number(booking.total_price).toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td>
                      <span className={`status-badge-chip ${isConfirmed ? "confirmed" : "cancelled"}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn-view-ticket"
                          onClick={() => onViewTicket(booking)}
                          title="View Digital Pass & Print"
                        >
                          🎟️ Pass
                        </button>

                        {isConfirmed && (
                          <button
                            className="btn-cancel-ticket"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            title="Cancel Booking"
                          >
                            {cancellingId === booking.id ? "..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}