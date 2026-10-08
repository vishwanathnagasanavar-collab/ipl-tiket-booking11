import React, { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import Navbar from "./components/Navbar.jsx";
import HeroBanner from "./components/HeroBanner.jsx";
import MatchList from "./components/MatchList.jsx";
import BookingForm from "./components/BookingForm.jsx";
import BookingList from "./components/BookingList.jsx";
import StatsOverview from "./components/StatsOverview.jsx";
import ETicketModal from "./components/ETicketModal.jsx";
import SupabaseModal from "./components/SupabaseModal.jsx";
import Toast from "./components/Toast.jsx";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("matches"); // "matches" | "book" | "bookings" | "stats"
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [bookingRefresh, setBookingRefresh] = useState(0);
  const [activeTicket, setActiveTicket] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const showToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch matches from Supabase or mock store
  const fetchMatches = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

      if (error) {
        console.error("Error loading matches:", error);
        showToast("error", "Error loading matches: " + error.message);
      } else {
        setMatches(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch all bookings for summary counts and stats
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

      if (!error && data) {
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching bookings summary:", err);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, bookingRefresh]);

  const handleSelectMatchToBook = (match) => {
    setSelectedMatchId(match.id);
    setActiveTab("book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingAdded = (newBooking) => {
    setBookingRefresh((prev) => prev + 1);
    setActiveTicket(newBooking);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem("ipl_matches_data_v1");
    localStorage.removeItem("ipl_bookings_data_v1");
    setBookingRefresh((prev) => prev + 1);
    fetchMatches();
    fetchBookings();
  };

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.length}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* Main App Content */}
      <main className="main-content">
        {/* Banner only on Matches tab */}
        {activeTab === "matches" && (
          <HeroBanner
            onBookClick={() => {
              setActiveTab("book");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onExploreClick={() => {
              const el = document.querySelector(".matches-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div>
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading IPL matches schedule...</p>
              </div>
            ) : (
              <MatchList
                matches={matches}
                onSelectMatch={handleSelectMatchToBook}
              />
            )}
          </div>
        )}

        {/* Book Tickets Tab */}
        {activeTab === "book" && (
          <BookingForm
            matches={matches}
            selectedMatchId={selectedMatchId}
            onBookingAdded={handleBookingAdded}
            showToast={showToast}
            onViewMatches={() => setActiveTab("matches")}
          />
        )}

        {/* Bookings & Passes Tab */}
        {activeTab === "bookings" && (
          <BookingList
            refresh={bookingRefresh}
            onViewTicket={(b) => setActiveTicket(b)}
            onBookNew={() => setActiveTab("book")}
            showToast={showToast}
          />
        )}

        {/* Analytics & Stats Tab */}
        {activeTab === "stats" && (
          <StatsOverview
            matches={matches}
            bookings={bookings}
            onBookNew={() => setActiveTab("book")}
            onViewMatches={() => setActiveTab("matches")}
          />
        )}
      </main>

      {/* Digital E-Ticket Pass Modal */}
      {activeTicket && (
        <ETicketModal
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
          onViewAllBookings={() => {
            setActiveTicket(null);
            setActiveTab("bookings");
          }}
        />
      )}

      {/* Supabase & Database Settings Modal */}
      {isConfigOpen && (
        <SupabaseModal
          onClose={() => setIsConfigOpen(false)}
          showToast={showToast}
          onResetDemoData={handleResetDemoData}
        />
      )}

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="trophy-sm">🏆</span>
            <strong>IPL TicketHub</strong>
            <span className="footer-pill">
              {isSupabaseConfigured ? "🟢 Supabase Connected" : "🟡 Local Demo Mode"}
            </span>
          </div>
          <p className="footer-disclaimer">
            Official ticketing platform for Indian Premier League 2026. All trademarks, logos, and team brands are the property of their respective owners.
          </p>
          <div className="footer-links">
            <button className="footer-btn" onClick={() => setActiveTab("matches")}>
              Match Schedule
            </button>
            <button className="footer-btn" onClick={() => setActiveTab("book")}>
              Book Tickets
            </button>
            <button className="footer-btn" onClick={() => setActiveTab("bookings")}>
              My Bookings
            </button>
            <button className="footer-btn" onClick={() => setIsConfigOpen(true)}>
              Database Settings & SQL
            </button>
          </div>
          <div className="footer-copyright">
            © 2026 IPL TicketHub • Powered by React & Supabase
          </div>
        </div>
      </footer>
    </div>
  );
}