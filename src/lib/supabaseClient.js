import { createClient } from "@supabase/supabase-js";
import { INITIAL_MATCHES, INITIAL_BOOKINGS } from "./mockData";

// Retrieve config from Vite environment variables or localStorage overrides
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const localSavedUrl = typeof window !== "undefined" ? localStorage.getItem("ipl_supabase_url") : null;
const localSavedKey = typeof window !== "undefined" ? localStorage.getItem("ipl_supabase_key") : null;

const effectiveUrl = localSavedUrl || envUrl;
const effectiveKey = localSavedKey || envKey;

export const isSupabaseConfigured = Boolean(
  effectiveUrl &&
    effectiveKey &&
    effectiveUrl.startsWith("http") &&
    effectiveKey.length > 10
);

// Local Storage helpers for offline / demo mode
const LOCAL_STORAGE_MATCHES_KEY = "ipl_matches_data_v1";
const LOCAL_STORAGE_BOOKINGS_KEY = "ipl_bookings_data_v1";

export const getLocalMatches = () => {
  if (typeof window === "undefined") return INITIAL_MATCHES;
  const stored = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(INITIAL_MATCHES));
    return INITIAL_MATCHES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MATCHES;
  }
};

export const getLocalBookings = () => {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveLocalBookings = (bookings) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  }
};

export const saveLocalMatches = (matches) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matches));
  }
};

// Create a robust Mock Query Builder that supports .select(), .order(), .insert(), .update(), .eq()
function createMockClient() {
  return {
    from(tableName) {
      return {
        select(selectColumns = "*") {
          let records =
            tableName === "matches" ? getLocalMatches() : getLocalBookings();

          const queryState = {
            records: [...records],
            isCancelled: false,
          };

          const builder = {
            order(column, options = {}) {
              const ascending = options.ascending ?? true;
              queryState.records.sort((a, b) => {
                if (a[column] < b[column]) return ascending ? -1 : 1;
                if (a[column] > b[column]) return ascending ? 1 : -1;
                return 0;
              });
              return builder;
            },
            eq(column, value) {
              queryState.records = queryState.records.filter(
                (item) => item[column] === value || String(item[column]) === String(value)
              );
              return builder;
            },
            async then(resolve) {
              // Format bookings with match relation if requested
              if (tableName === "bookings" && selectColumns.includes("matches")) {
                const matches = getLocalMatches();
                const populated = queryState.records.map((b) => {
                  const m = matches.find((match) => match.id === b.match_id);
                  return {
                    ...b,
                    matches: m
                      ? { team1: m.team1, team2: m.team2, venue: m.venue }
                      : b.matches || null,
                  };
                });
                return resolve({ data: populated, error: null });
              }
              return resolve({ data: queryState.records, error: null });
            },
          };

          return builder;
        },

        insert(newRows) {
          return {
            async then(resolve) {
              if (tableName === "bookings") {
                const existing = getLocalBookings();
                const matches = getLocalMatches();
                const created = newRows.map((row, idx) => {
                  const match = matches.find((m) => m.id === row.match_id);
                  return {
                    id: Date.now() + idx,
                    created_at: new Date().toISOString(),
                    booking_status: "Confirmed",
                    ...row,
                    matches: match
                      ? { team1: match.team1, team2: match.team2, venue: match.venue }
                      : null,
                  };
                });

                // Update matches available seats
                created.forEach((booking) => {
                  const matchIndex = matches.findIndex((m) => m.id === booking.match_id);
                  if (matchIndex !== -1 && matches[matchIndex].available_seats) {
                    matches[matchIndex].available_seats = Math.max(
                      0,
                      matches[matchIndex].available_seats - booking.number_of_tickets
                    );
                  }
                });
                saveLocalMatches(matches);

                const updated = [...created, ...existing];
                saveLocalBookings(updated);
                return resolve({ data: created, error: null });
              }
              return resolve({ data: newRows, error: null });
            },
          };
        },

        update(updates) {
          return {
            eq(column, value) {
              return {
                async then(resolve) {
                  if (tableName === "bookings") {
                    const existing = getLocalBookings();
                    const updated = existing.map((b) => {
                      if (b[column] === value || String(b[column]) === String(value)) {
                        return { ...b, ...updates };
                      }
                      return b;
                    });
                    saveLocalBookings(updated);
                    return resolve({ data: updated, error: null });
                  }
                  return resolve({ data: [], error: null });
                },
              };
            },
          };
        },

        delete() {
          return {
            eq(column, value) {
              return {
                async then(resolve) {
                  if (tableName === "bookings") {
                    const existing = getLocalBookings();
                    const filtered = existing.filter(
                      (b) => !(b[column] === value || String(b[column]) === String(value))
                    );
                    saveLocalBookings(filtered);
                    return resolve({ data: filtered, error: null });
                  }
                  return resolve({ data: [], error: null });
                },
              };
            },
          };
        },
      };
    },
  };
}

// Instantiate either real Supabase or our mock client
let activeClient;

if (isSupabaseConfigured) {
  try {
    activeClient = createClient(effectiveUrl, effectiveKey);
  } catch (err) {
    console.warn("Failed to initialize Supabase client, using local mock store:", err);
    activeClient = createMockClient();
  }
} else {
  activeClient = createMockClient();
}

export const supabase = activeClient;

export function updateSupabaseConfig(url, key) {
  if (typeof window !== "undefined") {
    if (url && key) {
      localStorage.setItem("ipl_supabase_url", url);
      localStorage.setItem("ipl_supabase_key", key);
    } else {
      localStorage.removeItem("ipl_supabase_url");
      localStorage.removeItem("ipl_supabase_key");
    }
    window.location.reload();
  }
}