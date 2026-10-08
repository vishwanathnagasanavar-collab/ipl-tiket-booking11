export const TEAM_INFO = {
  "Chennai Super Kings": { code: "CSK", primaryColor: "#FDB913", secondaryColor: "#002B49", accent: "#ffcf33" },
  "Mumbai Indians": { code: "MI", primaryColor: "#004BA0", secondaryColor: "#D1AB3E", accent: "#0077ff" },
  "Royal Challengers Bengaluru": { code: "RCB", primaryColor: "#DA1818", secondaryColor: "#2B2A29", accent: "#ff3e3e" },
  "Kolkata Knight Riders": { code: "KKR", primaryColor: "#3A225D", secondaryColor: "#F4C430", accent: "#7b4db8" },
  "Gujarat Titans": { code: "GT", primaryColor: "#1C2833", secondaryColor: "#C9A04B", accent: "#d4af37" },
  "Rajasthan Royals": { code: "RR", primaryColor: "#EA1A85", secondaryColor: "#001D48", accent: "#ff5dae" },
  "Sunrisers Hyderabad": { code: "SRH", primaryColor: "#F26522", secondaryColor: "#000000", accent: "#ff8246" },
  "Delhi Capitals": { code: "DC", primaryColor: "#004C93", secondaryColor: "#EE1C25", accent: "#1e88e5" },
  "Lucknow Super Giants": { code: "LSG", primaryColor: "#0057E7", secondaryColor: "#E34E34", accent: "#2563eb" },
  "Punjab Kings": { code: "PBKS", primaryColor: "#D71920", secondaryColor: "#DCDDDF", accent: "#f53d47" }
};

export const INITIAL_MATCHES = [
  {
    id: 1,
    team1: "Chennai Super Kings",
    team2: "Mumbai Indians",
    venue: "MA Chidambaram Stadium, Chennai",
    city: "Chennai",
    match_date: "2026-03-28",
    match_time: "19:30:00",
    total_seats: 38000,
    available_seats: 36240,
    status: "El Clásico - Selling Fast"
  },
  {
    id: 2,
    team1: "Royal Challengers Bengaluru",
    team2: "Kolkata Knight Riders",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    city: "Bengaluru",
    match_date: "2026-03-29",
    match_time: "19:30:00",
    total_seats: 35000,
    available_seats: 33500,
    status: "High Demand"
  },
  {
    id: 3,
    team1: "Gujarat Titans",
    team2: "Rajasthan Royals",
    venue: "Narendra Modi Stadium, Ahmedabad",
    city: "Ahmedabad",
    match_date: "2026-03-30",
    match_time: "19:30:00",
    total_seats: 132000,
    available_seats: 128000,
    status: "Available"
  },
  {
    id: 4,
    team1: "Sunrisers Hyderabad",
    team2: "Delhi Capitals",
    venue: "Rajiv Gandhi Intl Cricket Stadium, Hyderabad",
    city: "Hyderabad",
    match_date: "2026-03-31",
    match_time: "19:30:00",
    total_seats: 39000,
    available_seats: 37800,
    status: "Available"
  },
  {
    id: 5,
    team1: "Lucknow Super Giants",
    team2: "Punjab Kings",
    venue: "BRSABV Ekana Stadium, Lucknow",
    city: "Lucknow",
    match_date: "2026-04-01",
    match_time: "19:30:00",
    total_seats: 50000,
    available_seats: 48200,
    status: "Available"
  },
  {
    id: 6,
    team1: "Mumbai Indians",
    team2: "Royal Challengers Bengaluru",
    venue: "Wankhede Stadium, Mumbai",
    city: "Mumbai",
    match_date: "2026-04-02",
    match_time: "19:30:00",
    total_seats: 33100,
    available_seats: 31200,
    status: "Almost Full"
  },
  {
    id: 7,
    team1: "Kolkata Knight Riders",
    team2: "Chennai Super Kings",
    venue: "Eden Gardens, Kolkata",
    city: "Kolkata",
    match_date: "2026-04-03",
    match_time: "19:30:00",
    total_seats: 66000,
    available_seats: 62400,
    status: "Selling Fast"
  },
  {
    id: 8,
    team1: "Rajasthan Royals",
    team2: "Sunrisers Hyderabad",
    venue: "Sawai Mansingh Stadium, Jaipur",
    city: "Jaipur",
    match_date: "2026-04-04",
    match_time: "15:30:00",
    total_seats: 30000,
    available_seats: 28900,
    status: "Afternoon Match"
  },
  {
    id: 9,
    team1: "Delhi Capitals",
    team2: "Gujarat Titans",
    venue: "Arun Jaitley Stadium, Delhi",
    city: "Delhi",
    match_date: "2026-04-04",
    match_time: "19:30:00",
    total_seats: 41800,
    available_seats: 40100,
    status: "Available"
  },
  {
    id: 10,
    team1: "Punjab Kings",
    team2: "Chennai Super Kings",
    venue: "HPCA Stadium, Dharamshala",
    city: "Dharamshala",
    match_date: "2026-04-05",
    match_time: "19:30:00",
    total_seats: 23000,
    available_seats: 21500,
    status: "Scenic Venue - Selling Fast"
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 101,
    customer_name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43210",
    match_id: 1,
    seat_type: "VIP",
    number_of_tickets: 2,
    price_per_ticket: 2000,
    total_price: 4000,
    booking_status: "Confirmed",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    matches: {
      team1: "Chennai Super Kings",
      team2: "Mumbai Indians",
      venue: "MA Chidambaram Stadium, Chennai"
    }
  },
  {
    id: 102,
    customer_name: "Pooja Sharma",
    email: "pooja.sharma@example.com",
    phone: "+91 98123 45678",
    match_id: 2,
    seat_type: "Premium",
    number_of_tickets: 3,
    price_per_ticket: 1000,
    total_price: 3000,
    booking_status: "Confirmed",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    matches: {
      team1: "Royal Challengers Bengaluru",
      team2: "Kolkata Knight Riders",
      venue: "M. Chinnaswamy Stadium, Bengaluru"
    }
  }
];
