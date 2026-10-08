import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookingForm({
  matches,
  selectedMatchId,
  onBookingAdded,
  showToast,
  onViewMatches,
}) {
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    match_id: selectedMatchId ? String(selectedMatchId) : "",
    seat_type: "General",
    number_of_tickets: 2,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedMatchId) {
      setForm((prev) => ({ ...prev, match_id: String(selectedMatchId) }));
    }
  }, [selectedMatchId]);

  const seatTypes = [
    {
      id: "General",
      name: "General Stand",
      price: 500,
      description: "Standard grandstand seating with high-energy fan atmosphere",
      icon: "📢",
      color: "#2563eb",
    },
    {
      id: "Premium",
      name: "Premium Pavilion",
      price: 1500,
      description: "Covered pavilion view, cushioned seats, and mid-tier prime angles",
      icon: "⭐",
      color: "#7c3aed",
    },
    {
      id: "VIP",
      name: "VIP Hospitality",
      price: 3500,
      description: "Air-conditioned luxury lounge, prime boundary view & gourmet buffet",
      icon: "👑",
      color: "#d97706",
    },
  ];

  const currentSeat =
    seatTypes.find((s) => s.id === form.seat_type) || seatTypes[0];
  const pricePerTicket = currentSeat.price;
  const subtotal = Number(form.number_of_tickets) * pricePerTicket;
  const taxes = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + taxes;

  const currentMatch = matches.find(
    (m) => String(m.id) === String(form.match_id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTicketCountChange = (delta) => {
    const newCount = Math.min(10, Math.max(1, Number(form.number_of_tickets) + delta));
    setForm((prev) => ({ ...prev, number_of_tickets: newCount }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (!form.match_id) errs.match_id = "Please select a match";
    if (!form.seat_type) errs.seat_type = "Please select a seat type";
    if (form.number_of_tickets < 1) errs.number_of_tickets = "Minimum 1 ticket";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newBookingPayload = {
        customer_name: form.customer_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        match_id: Number(form.match_id),
        seat_type: form.seat_type,
        number_of_tickets: Number(form.number_of_tickets),
        price_per_ticket: pricePerTicket,
        total_price: grandTotal,
        booking_status: "Confirmed",
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert([newBookingPayload]);

      if (error) {
        throw new Error(error.message);
      }

      const createdBooking =
        data && data.length > 0
          ? data[0]
          : {
              id: Date.now(),
              ...newBookingPayload,
              created_at: new Date().toISOString(),
              matches: currentMatch
                ? {
                    team1: currentMatch.team1,
                    team2: currentMatch.team2,
                    venue: currentMatch.venue,
                  }
                : null,
            };

      if (showToast) {
        showToast("success", "🎉 Tickets booked successfully! E-Ticket generated.");
      }

      if (onBookingAdded) {
        onBookingAdded(createdBooking);
      }

      // Reset customer contact details but keep match
      setForm((prev) => ({
        ...prev,
        customer_name: "",
        email: "",
        phone: "",
        number_of_tickets: 2,
      }));
    } catch (err) {
      console.error("Booking error:", err);
      if (showToast) {
        showToast("error", `Booking failed: ${err.message}`);
      } else {
        alert("Booking failed: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <div className="booking-header-title">
            <h2>🎟️ Book IPL Match Tickets</h2>
            <p>Official digital ticketing portal for TATA IPL 2026 matches</p>
          </div>
          {onViewMatches && (
            <button className="btn-secondary" onClick={onViewMatches}>
              Browse All Matches 🏏
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="booking-form-grid">
          {/* Left Column: Match & Seat Selection */}
          <div className="form-col-left">
            {/* Match Selection */}
            <div className="form-group">
              <label htmlFor="match_id">Select Match:</label>
              <select
                id="match_id"
                name="match_id"
                value={form.match_id}
                onChange={handleChange}
                className={errors.match_id ? "input-error" : ""}
                required
              >
                <option value="">-- Choose an IPL Match --</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    Match #{match.id}: {match.team1} vs {match.team2} ({match.venue.split(",")[1]?.trim() || match.venue})
                  </option>
                ))}
              </select>
              {errors.match_id && <span className="error-text">{errors.match_id}</span>}
            </div>

            {/* Selected Match Card Preview */}
            {currentMatch && (
              <div className="match-preview-pill">
                <div className="pill-badge">Match Selected</div>
                <div className="pill-teams">
                  <strong>{currentMatch.team1}</strong> vs <strong>{currentMatch.team2}</strong>
                </div>
                <div className="pill-venue">
                  📍 {currentMatch.venue} • 🗓️ {currentMatch.match_date} @ {currentMatch.match_time}
                </div>
              </div>
            )}

            {/* Seat Category Selector */}
            <div className="form-group">
              <label>Select Seating Category:</label>
              <div className="seat-cards-grid">
                {seatTypes.map((seat) => {
                  const isSelected = form.seat_type === seat.id;
                  return (
                    <div
                      key={seat.id}
                      className={`seat-type-card ${isSelected ? "selected" : ""}`}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, seat_type: seat.id }))
                      }
                    >
                      <div className="seat-icon">{seat.icon}</div>
                      <div className="seat-info">
                        <div className="seat-title">{seat.name}</div>
                        <div className="seat-desc">{seat.description}</div>
                      </div>
                      <div className="seat-price">
                        ₹{seat.price.toLocaleString("en-IN")}
                        <span className="per-ticket">/ ticket</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Number of Tickets */}
            <div className="form-group">
              <label>Number of Tickets (Max 10 per order):</label>
              <div className="ticket-counter">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleTicketCountChange(-1)}
                  disabled={form.number_of_tickets <= 1}
                >
                  −
                </button>
                <span className="counter-value">{form.number_of_tickets}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleTicketCountChange(1)}
                  disabled={form.number_of_tickets >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Order Summary */}
          <div className="form-col-right">
            <div className="customer-details-box">
              <h3>👤 Fan Details</h3>

              <div className="form-group">
                <label htmlFor="customer_name">Full Name:</label>
                <input
                  id="customer_name"
                  type="text"
                  name="customer_name"
                  placeholder="e.g. Virat Kohli"
                  value={form.customer_name}
                  onChange={handleChange}
                  className={errors.customer_name ? "input-error" : ""}
                  required
                />
                {errors.customer_name && (
                  <span className="error-text">{errors.customer_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address (E-Ticket sent here):</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                  required
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Mobile Phone (for gate entry SMS):</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? "input-error" : ""}
                  required
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="order-summary-box">
              <h3>💳 Booking Summary</h3>
              <div className="summary-row">
                <span>Category:</span>
                <strong>{currentSeat.name}</strong>
              </div>
              <div className="summary-row">
                <span>Tickets:</span>
                <strong>{form.number_of_tickets} × ₹{pricePerTicket}</strong>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>GST & Stadium Cess (18%):</span>
                <span>₹{taxes.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row grand-total">
                <span>Total Amount:</span>
                <span className="total-amount">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="submit"
                className="submit-booking-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating E-Tickets..." : `Confirm & Book Tickets • ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>

              <div className="secure-badge">
                🔒 256-bit SSL Encrypted • Official BCCI / IPL Ticketing
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}