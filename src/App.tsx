// src/App.tsx
import React, { useState, useMemo } from "react";
import { Navbar } from "./components/layout/Navbar"; // নতুন ইম্পোর্ট
import { EventCard } from "./components/EventCard";
import { EventDetail } from "./components/EventDetail";
import { CreateEventModal } from "./components/CreateEventModal";
import { MyBookings } from "./components/MyBookings";
import { INITIAL_EVENTS } from "./data/initialEvents";
import { EventItem, Booking, User, Review } from "./types";

import { SkeletonCard } from "./components/SkeletonCard"; // এইমাত্র তৈরি করা ফাইল

import {
  Search,
  Sparkles,
  CheckCircle,
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

  // Mock Dynamic User Session
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "usr-1",
    name: "Alex Rivera",
    email: "alex.rivera@eventhub.com",
    role: "Premium Member",
  });

  // Authentication Mock Handlers (Requirement 7 & 12 অনুযায়ী)
  const handleLogout = () => setCurrentUser(null);
  const handleLoginDemo = (role: "user" | "admin") => {
    setCurrentUser({
      id: role === "admin" ? "adm-1" : "usr-1",
      name: role === "admin" ? "Sarah Jenkins" : "Alex Rivera",
      email: role === "admin" ? "admin@eventhub.com" : "user@eventhub.com",
      role: role === "admin" ? "Administrator" : "Premium Member",
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
        event.location.toLowerCase().includes(query) ||
        event.tag.toLowerCase().includes(query);

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [events, selectedCategory, priceFilter, searchQuery]);

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Handlers
  const handleHostEvent = (
    newEventData: Omit<EventItem, "id" | "organizer" | "reviews">
  ) => {
    if (!currentUser) return;
    const newEvent: EventItem = {
      ...newEventData,
      id: `custom-event-${Date.now()}`,
      organizer: {
        name: currentUser.name + " Productions",
        eventsHosted: 1,
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeBA6qQ2LPF15z375K9SwpU4JWpbB9cqU0SxWvCLB_RRFV9hrBTh2IfsdfV_2WpIIt-_7xkJhxl43V_j4WOKDm3gzgCGQ3jiEppddr3T-jHAWv8QJDvTEHTzfpkQ2EYQTcrtyuj5rZfgkjT1ZqgTJ0EgFWIDMnwIdEAEF4AcoYEoFmcpFhk4nPvCoe1TofTxZLBBx6SYvy7_KRH-L8mwtHZg2VBVza2zl6NEydd81lkEixd7rcc5dB",
      },
      reviews: [],
    };

    setEvents((prev) => [newEvent, ...prev]);
    setShowCreateModal(false);
    setSelectedEventId(newEvent.id);
  };

  const handleBookEvent = (quantity: number) => {
    if (!selectedEvent) return;
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
      {/* রিকোয়ারমেন্ট অনুযায়ী নতুন রেসপনসিভ গ্লোবাল নেভিগেশন বার */}
      <Navbar
        currentUser={currentUser}
        bookings={bookings}
        onLogout={handleLogout}
        onLoginDemo={handleLoginDemo}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* তোমার আগের মেইন কন্টেন্ট এবং গ্রিড লজিক এখানে অপরিবর্তিত থাকবে */}
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
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900/40 to-slate-900" />
                <div className="relative max-w-2xl text-left space-y-4">
                  <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-500 border border-amber-500/20 shadow-inner">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>CURATED ASSEMBLY SPACES</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white">
                    Uncover Premium Local Gatherings & Assemblies
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                    Explore and reserve admission passes to world-class
                    conferences, private jazz rooftops, creative design
                    masterclasses, and elite culinary workshops.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span className="text-slate-200">
                        100% Verified Organizers
                      </span>
                    </span>
                  </div>
                </div>
              </div>

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
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
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
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold ${
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

                  {/* স্কেলেটন লোডিং টেস্ট বাটন */}
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 2000); // ২ সেকেন্ড স্কেলেটন লোডার দেখাবে
                    }}
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer transition-colors bg-indigo-50 px-3 py-1.5 rounded-xl"
                  >
                    ⚡ Simulate Loading
                  </button>
                </div>

                {/* রিকোয়ারমেন্ট ৪ অনুযায়ী ডেক্সটপে ৪ কলাম গ্রিড (lg:grid-cols-4) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {isLoading ? (
                    // লোড হওয়ার সময় ৮টি কাস্টম কঙ্কাল বা স্কেলেটন কার্ড দেখাবে
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
                    /* No matching events fallback */
                    <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-lg mx-auto">
                      {/* তোমার আগের No events found এর ভেতরের অংশটুকু এখানে থাকবে */}
                      <h4 className="font-display text-base font-bold text-slate-800">
                        No matching events found
                      </h4>
                    </div>
                  )}
                </div>
              </div>
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
            onClose={() => setShowCreateModal(false)}
            onCreate={handleHostEvent}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200/60 bg-white py-8 text-center text-xs text-slate-400 font-semibold">
        <p>© 2026 Event Hub Premium Services. All rights reserved.</p>
      </footer>
    </div>
  );
}
