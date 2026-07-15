// src/App.tsx
import React, { useState, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { EventCard } from "./components/EventCard";
import { EventDetail } from "./components/EventDetail";
import { CreateEventModal } from "./components/CreateEventModal";
import { MyBookings } from "./components/MyBookings";
import { INITIAL_EVENTS } from "./data/initialEvents";
import { EventItem, Booking, User, Review } from "./types";
import { AuthPages } from "./pages/AuthPages"; // নতুন ইম্পোর্ট
import { ManageItems } from "./pages/ManageItems"; // নতুন ইম্পোর্ট
import { AboutPage, ContactPage } from "./pages/StaticPages"; // নতুন ইম্পোর্ট
import { useToast } from "./context/ToastContext";
import { ConfirmationModal } from "./components/ConfirmationModal";

import {
  StatsSection,
  FeaturedHighlights,
  TestimonialsSection,
  Footer,
} from "./components/LandingSections";

import { SkeletonCard } from "./components/SkeletonCard";

import {
  Search,
  Globe,
  Music,
  Terminal,
  Briefcase,
  Palette,
  UtensilsCrossed,
  Layers,
  Trophy,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Hero } from "./components/Hero";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Globe className="h-4 w-4" />,
  Music: <Music className="h-4 w-4" />,
  Tech: <Terminal className="h-4 w-4" />,
  Business: <Briefcase className="h-4 w-4" />,
  Arts: <Palette className="h-4 w-4" />,
  Food: <UtensilsCrossed className="h-4 w-4" />,
  Design: <Layers className="h-4 w-4" />,
  Sports: <Trophy className="h-4 w-4" />,
  Networking: <HelpCircle className="h-4 w-4" />,
};

export default function App() {
  const API_BASE = "http://localhost:5000/api";
  const { showToast } = useToast();

  // Central Application State
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  // ১. অ্যাপ লোড হওয়ার সাথে সাথে API থেকে ইভেন্ট ও বুকিং ফেচ করা
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Fetch Events
        const resEvents = await fetch(`${API_BASE}/events`);
        const dataEvents = await resEvents.json();
        setEvents(dataEvents);

        // Fetch Bookings
        const resBookings = await fetch(`${API_BASE}/bookings`);
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);
      } catch (error) {
        console.error("API error:", error);
        showToast(
          "⚠️ Failed to load database, using local offline mode.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<
    "explore" | "bookings" | "manage" | "auth" | "about" | "contact"
  >("explore");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Paid">(
    "All"
  );

  // Sorting State
  const [sortBy, setSortBy] = useState<
    "none" | "price-low" | "price-high" | "title-az"
  >("none");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // প্রতি পেজে ৪টি করে কার্ড দেখাবে (Requirement 4 - 4 cards per row)

  // Dynamic Session State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Authentication Callbacks
  const handleLoginSuccess = (
    role: "user" | "admin",
    name: string,
    email: string
  ) => {
    setCurrentUser({
      id: role === "admin" ? "adm-1" : "usr-1",
      name,
      email,
      role: role === "admin" ? "Administrator" : "Premium Member",
    });
    setActiveTab("explore");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBookings([]);
    setActiveTab("explore");
    showToast("✓ Session terminated successfully.", "info");
  };

  // ২. Add Item Handler Update (Requirement 8)
  const handleCreateEvent = async (newEventData: Omit<EventItem, "id">) => {
    const freshEvent = {
      ...newEventData,
      organizer: {
        name: currentUser?.name || "Anonymous Host",
        eventsHosted: 1,
        logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      },
    };

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(freshEvent),
      });
      const savedEvent = await res.json();
      setEvents((prev) => [savedEvent, ...prev]);
      setShowCreateModal(false);
      showToast("🎉 Premium Assembly Published Successfully!", "success");
    } catch (e) {
      showToast("❌ Failed to publish event to server.", "error");
    }
  };
  // ৩. Delete Item Handler Update (Requirement 9)
  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setBookings((prev) => prev.filter((b) => b.eventId !== id));
      }
    } catch (e) {
      showToast("❌ Failed to delete event on server.", "error");
    }
  };

  // Filtered, Sorted and Paginated Events logic
  const filteredAndSortedEvents = useMemo(() => {
    // ১. প্রথমে ফিল্টারিং করা হচ্ছে
    let result = events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Free" && event.price === 0) ||
        (priceFilter === "Paid" && event.price > 0);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesPrice && matchesSearch;
    });

    // ২. এবার সর্টিং করা হচ্ছে (Requirement 6)
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "title-az") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [events, selectedCategory, priceFilter, searchQuery, sortBy]);

  // ৩. প্যাজিনেশন লজিক (Requirement 6)
  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEvents, currentPage]);

  // যেকোনো ফিল্টার বা সর্ট পরিবর্তন হলে পেজ নাম্বার ১-এ ব্যাক করবে
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceFilter, sortBy]);

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const handleBookEvent = async (quantity: number) => {
    if (!selectedEvent) return;
    if (!currentUser) {
      showToast("❌ Authorization required. Please log in first.", "error");
      setActiveTab("auth");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          eventImage: selectedEvent.image,
          quantity,
          price: selectedEvent.price * quantity,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        // ইভেন্টের সিট সংখ্যা আপডেট করা
        setEvents((prev) =>
          prev.map((e) => (e.id === selectedEvent.id ? result.updatedEvent : e))
        );
        setBookings((prev) => [result.booking, ...prev]);
        showToast("🎟️ Pass Secured! Check 'My Bookings'.", "success");
      } else {
        const errData = await res.json();
        showToast(`❌ ${errData.error}`, "error");
      }
    } catch (e) {
      showToast("❌ Booking transaction failed on database.", "error");
    }
  };

  const handleCancelBookingRequest = (bookingId: string) => {
    setDeleteBookingId(bookingId);
  };

  // ৫. Confirm Cancel Booking Update (Requirement 10)
  const handleConfirmCancelBooking = async () => {
    if (!deleteBookingId) return;

    try {
      const res = await fetch(`${API_BASE}/bookings/${deleteBookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const booking = bookings.find((b) => b.id === deleteBookingId);
        if (booking) {
          // সিট রিলিজ করে আগের সংখ্যায় ফিরিয়ে আনা
          setEvents((prev) =>
            prev.map((e) => {
              if (e.id === booking.eventId && e.spotsLeft !== undefined) {
                return { ...e, spotsLeft: e.spotsLeft + 1 };
              }
              return e;
            })
          );
        }
        setBookings((prev) => prev.filter((b) => b.id !== deleteBookingId));
        setDeleteBookingId(null);
        showToast("✕ Booking Canceled Successfully.", "info");
      }
    } catch (e) {
      showToast("❌ Failed to cancel booking on database.", "error");
    }
  };

  // ৬. Add Review Update (Requirement 7)
  const handleAddReview = async (
    reviewInput: Omit<Review, "id" | "date" | "userInitials">
  ) => {
    if (!selectedEvent) return;

    try {
      const res = await fetch(
        `${API_BASE}/events/${selectedEvent.id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewInput),
        }
      );

      if (res.ok) {
        const savedReview = await res.json();
        setEvents((prev) =>
          prev.map((e) => {
            if (e.id === selectedEvent.id) {
              return { ...e, reviews: [savedReview, ...(e.reviews || [])] };
            }
            return e;
          })
        );
        showToast("💬 Thank you for your feedback statement!", "success");
      }
    } catch (e) {
      showToast("❌ Failed to post feedback.", "error");
    }
  };

  const isAdmin = currentUser?.role === "Administrator";

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between"
      id="event-hub-root"
    >
      <div>
        <Navbar
          currentUser={currentUser}
          bookings={bookings}
          onLogout={handleLogout}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Tab 1: Explore Page */}
            {activeTab === "explore" && (
              <motion.div
                key="explore-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                <Hero />

                {/* Filtering Controls */}
                <div className="space-y-4 bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search events, keywords, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ⚡ Requirement 6: Sorting Option */}
                      <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 outline-hidden focus:bg-white cursor-pointer"
                      >
                        <option value="none">Sort By (None)</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="title-az">Title: A - Z</option>
                      </select>

                      <div className="flex rounded-xl bg-slate-100 p-1">
                        {/* Free/Paid buttons previously here... */}

                        {["All", "Free", "Paid"].map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setPriceFilter(tier as any)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              priceFilter === tier
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>

                      {/* Add Event shortcut button for Admin */}
                      {isAdmin && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add Assembly</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex space-x-2 overflow-x-auto pb-1.5">
                    {Object.keys(CATEGORY_ICONS).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {CATEGORY_ICONS[cat]}
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Events Grid layout */}
                <div className="space-y-5">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-lg font-bold text-slate-800 text-left">
                      {selectedCategory === "All"
                        ? "All Discoverable Assemblies"
                        : `${selectedCategory} Screenings`}
                    </h2>

                    <button
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 1200);
                      }}
                      className="text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer transition-colors bg-indigo-50 px-3 py-1.5 rounded-xl"
                    >
                      ⚡ Simulate Loading
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                      ))
                    ) : paginatedEvents.length > 0 ? (
                      paginatedEvents.map(
                        (
                          event // ⚡ paginatedEvents ব্যবহার করা হলো
                        ) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEventId(event.id)}
                            isBooked={bookings.some(
                              (b) => b.eventId === event.id
                            )}
                          />
                        )
                      )
                    ) : (
                      <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-lg mx-auto">
                        <h4 className="font-display text-base font-bold text-slate-800">
                          No matching events found
                        </h4>
                      </div>
                    )}
                  </div>

                  {/* ⚡ Requirement 6: Dynamic Pagination UI Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 pt-6">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer transition-all"
                      >
                        Prev
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            currentPage === idx + 1
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                <StatsSection />
                <FeaturedHighlights />
                <TestimonialsSection />
              </motion.div>
            )}

            {/* Tab 2: Bookings Page */}
            {activeTab === "bookings" && (
              <MyBookings
                bookings={bookings}
                currentUser={currentUser!}
                onCancel={handleCancelBookingRequest}
                onExploreClick={() => setActiveTab("explore")}
              />
            )}

            {/* Tab 3: Auth Portal (Login / Register) */}
            {activeTab === "auth" && (
              <AuthPages onLoginSuccess={handleLoginSuccess} />
            )}

            {/* Tab 4: Manage Items (Admin only) */}
            {activeTab === "manage" && (
              <ManageItems
                events={events}
                currentUser={currentUser}
                onDeleteEvent={handleDeleteEvent}
                onViewEvent={(id) => {
                  setSelectedEventId(id);
                }}
              />
            )}

            {/* Tab 5: About Us */}
            {activeTab === "about" && <AboutPage />}

            {/* Tab 6: Contact */}
            {activeTab === "contact" && <ContactPage />}
          </AnimatePresence>
        </main>
      </div>

      <Footer />

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
            onBook={handleBookEvent}
            onAddReview={handleAddReview}
            currentUser={currentUser}
            isAlreadyBooked={bookings.some(
              (b) => b.eventId === selectedEvent.id
            )}
          />
        )}
        {showCreateModal && (
          <CreateEventModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateEvent}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={deleteBookingId !== null}
        title="Revoke Admission Pass?"
        message="Are you sure you want to cancel this booking? This action will immediately release your spot back to the community."
        onConfirm={handleConfirmCancelBooking}
        onCancel={() => setDeleteBookingId(null)}
      />
    </div>
  );
}
