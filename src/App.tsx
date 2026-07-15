// src/App.tsx
import React, { useState, useMemo } from "react";
import { Navbar } from "./components/layout/Navbar";
import { EventCard } from "./components/EventCard";
import { EventDetail } from "./components/EventDetail";
import { CreateEventModal } from "./components/CreateEventModal";
import { MyBookings } from "./components/MyBookings";
import { INITIAL_EVENTS } from "./data/initialEvents";
import { EventItem, Booking, User, Review } from "./types";
import {
  StatsSection,
  FeaturedHighlights,
  TestimonialsSection,
  Footer,
} from "./components/LandingSections";

import { SkeletonCard } from "./components/SkeletonCard";
import { useToast } from "./context/ToastContext";

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
  const { showToast } = useToast();
  // Central Application State
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"explore" | "bookings">("explore");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Paid">(
    "All"
  );

  // Mock Dynamic User Session (ইনিশিয়ালি লগড-আউট রাখলাম যাতে টেস্ট করা সহজ হয়)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // নতুন ইভেন্ট যোগ করার কাস্টম হ্যান্ডলার
  const handleCreateEvent = (newEventData: Omit<EventItem, "id">) => {
    const newEvent: EventItem = {
      ...newEventData,
      id: `event-${Date.now()}`,
      organizer: {
        name: currentUser?.name || "Anonymous Host",
        eventsHosted: 1,
        logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      },
      reviews: [],
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    showToast("🎉 Premium Assembly Published Successfully!", "success"); // ⚡ টোস্ট ট্রিগার
  };

  // Authentication Handlers
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("explore");
  };

  const handleLoginDemo = (role: "user" | "admin") => {
    setCurrentUser({
      id: role === "admin" ? "adm-1" : "usr-1",
      name: role === "admin" ? "Sarah Jenkins" : "Alex Rivera",
      email: role === "admin" ? "admin@eventhub.com" : "user@eventhub.com",
      role: role, // Navbar-এর কন্ডিশনের সাথে ম্যাচ করানোর জন্য সরাসরি 'admin' বা 'user' পাস করা হলো
    });
  };

  // Filtered Events logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
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
  }, [events, selectedCategory, priceFilter, searchQuery]);

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const handleBookEvent = (quantity: number) => {
    if (!selectedEvent) return;

    if (!currentUser) {
      showToast("Please login to book tickets!", "error");
      return;
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === selectedEvent.id && e.spotsLeft !== undefined) {
          return { ...e, spotsLeft: Math.max(0, e.spotsLeft - quantity) };
        }
        return e;
      })
    );

    const newBooking: Booking = {
      id: `TX-${Math.floor(Math.random() * 900000) + 100000}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      eventImage: selectedEvent.image,
      bookingDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      price: selectedEvent.price * quantity,
    };
    setBookings((prev) => [newBooking, ...prev]);
    showToast("🎟️ Pass Secured! Check 'My Bookings'.", "success"); // ⚡ টোস্ট ট্রিগার
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === booking.eventId && e.spotsLeft !== undefined) {
          return { ...e, spotsLeft: e.spotsLeft + 1 };
        }
        return e;
      })
    );
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast("✕ Booking Canceled Successfully.", "info"); // ⚡ টোস্ট ট্রিগার
  };

  const handleAddReview = (
    reviewInput: Omit<Review, "id" | "date" | "userInitials">
  ) => {
    if (!selectedEvent) return;
    const newReview: Review = {
      ...reviewInput,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      userInitials: reviewInput.userName
        .split(" ")
        .map((n) => n[0])
        .join(""),
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === selectedEvent.id) {
          return { ...e, reviews: [newReview, ...(e.reviews || [])] };
        }
        return e;
      })
    );
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-800"
      id="event-hub-root"
    >
      {/* ⚡ ফিক্সড নেভিগেশন বার - সকল ইন্টারেক্টিভ প্রপ্সসহ */}
      <Navbar
        currentUser={currentUser}
        bookings={bookings}
        onLogout={handleLogout}
        onLoginDemo={handleLoginDemo}
        onAddEventClick={() => setShowCreateModal(true)}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === "explore" ? (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Hero Banner */}
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
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    {["All", "Free", "Paid"].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setPriceFilter(tier as any)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          priceFilter === tier
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
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
                      setTimeout(() => setIsLoading(false), 1500);
                    }}
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer transition-colors bg-indigo-50 px-3 py-1.5 rounded-xl"
                  >
                    ⚡ Simulate Loading
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, idx) => (
                      <SkeletonCard key={idx} />
                    ))
                  ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEventId(event.id)}
                        isBooked={bookings.some((b) => b.eventId === event.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-lg mx-auto">
                      <h4 className="font-display text-base font-bold text-slate-800">
                        No matching events found
                      </h4>
                    </div>
                  )}
                </div>
              </div>

              <StatsSection />
              <FeaturedHighlights />
              <TestimonialsSection />
            </motion.div>
          ) : (
            <MyBookings
              bookings={bookings}
              currentUser={currentUser!}
              onCancel={handleCancelBooking}
              onExploreClick={() => setActiveTab("explore")}
            />
          )}
        </AnimatePresence>
        <Footer />
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
            onBook={handleBookEvent}
            onAddReview={handleAddReview}
            currentUser={currentUser!}
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
    </div>
  );
}
