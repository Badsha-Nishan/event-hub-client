// src/components/EventDetail.tsx
import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Star,
  MessageSquare,
  Ticket,
} from "lucide-react";
import { EventItem, Review, User } from "../types";

interface EventDetailProps {
  event: EventItem;
  onClose: () => void;
  onBook: (quantity: number) => void;
  onAddReview: (review: Omit<Review, "id" | "date" | "userInitials">) => void;
  currentUser: User | null;
  isAlreadyBooked: boolean;
}

export function EventDetail({
  event,
  onClose,
  onBook,
  onAddReview,
  currentUser,
  isAlreadyBooked,
}: EventDetailProps) {
  const [ticketQty, setTicketQty] = useState(1);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login first to book tickets!");
      return;
    }
    onBook(ticketQty);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    onAddReview({
      userName: reviewName,
      rating: reviewRating,
      comment: reviewText,
    });

    setReviewText("");
    setReviewName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/60 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image & Fast Info */}
        <div className="w-full md:w-1/2 relative bg-slate-900 min-h-[250px] md:min-h-full">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-6 text-left">
            <span className="inline-block bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 w-max">
              {event.category}
            </span>
            <h3 className="text-xl font-black text-white leading-tight tracking-tight mb-3">
              {event.title}
            </h3>
            <div className="space-y-2 text-slate-200 text-xs">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details, Embedded Booking & Reviews */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between text-left space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              About the Event
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Organizer / Ticket Meta */}
          <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-600 text-[10px]">
                {event.organizer?.name[0] || "O"}
              </div>
              <div>
                <p className="font-bold text-slate-700">
                  {event.organizer?.name || "Premium Organizer"}
                </p>
                <p className="text-[10px] text-slate-400">Host</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900 text-sm">
                {event.price === 0 ? "FREE" : `$${event.price}`}
              </p>
              <p className="text-[10px] font-bold text-rose-500">
                {event.spotsLeft !== undefined
                  ? `${event.spotsLeft} seats left`
                  : "Available"}
              </p>
            </div>
          </div>

          {/* 🎟️ EMBEDDED INTERACTION: Booking System (Requirement 11) */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center space-x-1">
              <Ticket className="w-3.5 h-3.5 text-indigo-600" />
              <span>Secure Passes</span>
            </h4>

            {isAlreadyBooked ? (
              <div className="w-full bg-slate-200 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl text-center border border-slate-300/40 select-none">
                ✓ Already Booked (Pass Secured)
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[11px] font-bold text-slate-500">
                    Quantity
                  </label>
                  <select
                    value={ticketQty}
                    onChange={(e) => setTicketQty(Number(e.target.value))}
                    className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 outline-hidden"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Ticket{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-indigo-700 cursor-pointer shadow-md shadow-indigo-600/10 transition-all text-center"
                >
                  Confirm Reservation ·{" "}
                  {event.price === 0 ? "Free" : `$${event.price * ticketQty}`}
                </button>
              </form>
            )}
          </div>

          {/* Reviews Area */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              <span>Community Reviews ({event.reviews?.length || 0})</span>
            </h4>

            {/* Render Reviews */}
            <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
              {event.reviews && event.reviews.length > 0 ? (
                event.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 bg-white border border-slate-100 rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">
                        {rev.userName}
                      </span>
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              )}
            </div>

            {/* Add Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="space-y-2 border-t border-slate-100 pt-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="border border-slate-200 text-[11px] rounded-lg p-2 outline-hidden focus:border-indigo-500"
                  required
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="border border-slate-200 text-[11px] font-semibold rounded-lg p-2 outline-hidden"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Write a feedback statement..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={2}
                className="w-full border border-slate-200 text-[11px] rounded-lg p-2 outline-hidden focus:border-indigo-500 resize-none"
                required
              />
              <button
                type="submit"
                className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-all cursor-pointer"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
