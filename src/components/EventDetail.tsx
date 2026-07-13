/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, MapPin, Calendar, Star, ShieldCheck, 
  Users, Clock, MessageSquare, ArrowLeft, Ticket, CheckCircle, Sparkles 
} from 'lucide-react';
import { EventItem, Review, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EventDetailProps {
  event: EventItem;
  onClose: () => void;
  onBook: (quantity: number) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'userInitials'>) => void;
  currentUser: User;
  isAlreadyBooked: boolean;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onClose,
  onBook,
  onAddReview,
  currentUser,
  isAlreadyBooked,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'reviews'>('about');
  const [ticketQty, setTicketQty] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Review Form States
  const [newReviewName, setNewReviewName] = useState(currentUser.name);
  const [newReviewRole, setNewReviewRole] = useState(currentUser.role || 'Attendee');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const reviews = event.reviews || [];
    if (reviews.length === 0) return { avg: 0, count: 0, breakdown: [0, 0, 0, 0, 0] };
    
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total / reviews.length;
    
    const breakdown = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    reviews.forEach(r => {
      const index = 5 - Math.round(r.rating);
      if (index >= 0 && index < 5) breakdown[index]++;
    });
    
    return {
      avg: Number(avg.toFixed(1)),
      count: reviews.length,
      breakdown: breakdown.map(c => (c / reviews.length) * 100)
    };
  }, [event.reviews]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    onAddReview({
      userName: newReviewName,
      userRole: newReviewRole,
      rating: newReviewRating,
      comment: newReviewComment,
    });

    setReviewSubmitted(true);
    setNewReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const fees = event.price > 0 ? 4.95 : 0;
  const subtotal = event.price * ticketQty;
  const totalCost = subtotal > 0 ? subtotal + fees : 0;

  const handleBooking = () => {
    onBook(ticketQty);
    setBookingSuccess(true);
  };

  // SVG QR Code Generator
  const renderQRCode = () => {
    // Generate static matrix-like paths for high fidelity aesthetic QR code
    return (
      <svg className="w-28 h-28 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
        {/* Corners */}
        <rect x="0" y="0" width="30" height="30" rx="2" />
        <rect x="5" y="5" width="20" height="20" fill="white" />
        <rect x="10" y="10" width="10" height="10" />

        <rect x="70" y="0" width="30" height="30" rx="2" />
        <rect x="75" y="5" width="20" height="20" fill="white" />
        <rect x="80" y="10" width="10" height="10" />

        <rect x="0" y="70" width="30" height="30" rx="2" />
        <rect x="5" y="75" width="20" height="20" fill="white" />
        <rect x="10" y="80" width="10" height="10" />

        {/* Small alignment blocks */}
        <rect x="75" y="75" width="10" height="10" />

        {/* Random filled elements representing QR data */}
        <rect x="35" y="5" width="10" height="10" />
        <rect x="40" y="20" width="10" height="5" />
        <rect x="55" y="10" width="5" height="15" />
        
        <rect x="5" y="35" width="15" height="10" />
        <rect x="25" y="45" width="10" height="10" />
        <rect x="10" y="55" width="5" height="10" />

        <rect x="45" y="35" width="20" height="10" />
        <rect x="35" y="55" width="10" height="15" />
        <rect x="50" y="50" width="15" height="5" />

        <rect x="70" y="35" width="10" height="20" />
        <rect x="85" y="45" width="10" height="10" />
        <rect x="80" y="60" width="15" height="5" />

        <rect x="40" y="75" width="15" height="10" />
        <rect x="35" y="90" width="25" height="5" />
        <rect x="65" y="80" width="5" height="15" />
      </svg>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8"
      id="event-detail-modal"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Left main pane (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:pr-4">
          
          {/* Back/Close Button */}
          <button
            onClick={onClose}
            className="group mb-5 flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            id="detail-back-btn"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Discovery</span>
          </button>

          {/* Banner Hero Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 shadow-inner">
            <img 
              src={event.image} 
              alt={event.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-block rounded-md bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase mb-2">
                {event.category}
              </span>
              <h1 className="font-display text-lg sm:text-2xl font-extrabold tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Quick info row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-5 mb-6 text-slate-600">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Date</p>
                <p className="text-xs font-bold text-slate-800">{event.displayDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="max-w-[120px]">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-slate-800 truncate">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 col-span-2 sm:col-span-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Availability</p>
                <p className="text-xs font-bold text-slate-800">
                  {event.spotsLeft !== undefined ? `${event.spotsLeft} Spots Available` : 'Open Event'}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 text-sm font-semibold relative transition-colors mr-6 ${
                activeTab === 'about' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              About Event
              {activeTab === 'about' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
            {event.schedule && event.schedule.length > 0 && (
              <button
                onClick={() => setActiveTab('schedule')}
                className={`pb-3 text-sm font-semibold relative transition-colors mr-6 ${
                  activeTab === 'schedule' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Schedule Agenda
                {activeTab === 'schedule' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-semibold relative transition-colors ${
                activeTab === 'reviews' ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Reviews ({stats.count})
              {activeTab === 'reviews' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="mb-6 min-h-[220px]">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">Overview</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {event.longDescription || event.description}
                  </p>
                </div>

                {/* Organizer Info */}
                <div className="rounded-2xl border border-slate-100 p-4.5 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={event.organizer.logo} 
                      alt={event.organizer.name}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-xl object-cover border border-slate-200 bg-white"
                    />
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Hosted By</p>
                      <p className="text-sm font-bold text-slate-800">{event.organizer.name}</p>
                      <p className="text-xs text-slate-500">{event.organizer.eventsHosted} verified events hosted</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>VERIFIED HOST</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && event.schedule && (
              <div className="space-y-5">
                {/* Day selector if multi-day */}
                {event.schedule.length > 1 && (
                  <div className="flex space-x-2 mb-4">
                    {event.schedule.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeDayIndex === idx 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.dayTitle.split(':')[0]}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active Day Info */}
                <div className="mb-2">
                  <h4 className="font-display font-bold text-slate-800 text-sm">
                    {event.schedule[activeDayIndex].dayTitle}
                  </h4>
                  <p className="text-xs text-slate-400">{event.schedule[activeDayIndex].date}</p>
                </div>

                {/* Timeline Items */}
                <div className="space-y-5 relative pl-5 border-l border-slate-100 mt-4">
                  {event.schedule[activeDayIndex].items.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Marker dot */}
                      <div className="absolute -left-[25.5px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 ring-4 ring-white" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                        <span className="font-mono text-xs font-bold text-amber-600 shrink-0 w-20 mb-1 sm:mb-0">
                          {item.time}
                        </span>
                        <div>
                          <h5 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                            {item.title}
                          </h5>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Overview Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-slate-50/40 border border-slate-100 p-5 rounded-2xl">
                  <div className="text-center sm:border-r border-slate-100 py-2">
                    <p className="text-4xl font-extrabold text-slate-800">{stats.avg}</p>
                    <div className="flex justify-center my-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-4.5 w-4.5 ${
                            s <= Math.round(stats.avg) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-slate-400">{stats.count} verified reviews</p>
                  </div>

                  {/* Rating distribution progress bars */}
                  <div className="sm:col-span-2 space-y-2">
                    {stats.breakdown.map((percent, idx) => (
                      <div key={idx} className="flex items-center text-xs font-semibold">
                        <span className="w-12 text-slate-500">{5 - idx} Stars</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mx-3">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-8 text-right text-slate-400">{Math.round(percent)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submitting a Review Form */}
                <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 border border-slate-100 rounded-2xl bg-white shadow-xs">
                  <h4 className="font-display text-sm font-bold text-slate-800">Add Your Verified Review</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Professional Role</label>
                      <input 
                        type="text" 
                        required
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                  </div>

                  {/* Star Rating selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Rating</label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-hidden"
                        >
                          <Star 
                            className={`h-6 w-6 cursor-pointer transition-all hover:scale-110 ${
                              star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Review Comments</label>
                    <textarea 
                      rows={2}
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your experience at the event..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    {reviewSubmitted ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Review posted successfully!</span>
                      </span>
                    ) : <span />}
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4.5 py-2 cursor-pointer transition-all"
                    >
                      Post Review
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {event.reviews && event.reviews.length > 0 ? (
                    event.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 border border-slate-50 rounded-xl bg-slate-50/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                              {rev.userInitials}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-tight">{rev.userName}</p>
                              <p className="text-[10px] text-slate-400 leading-none">{rev.userRole}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-0.5 justify-end">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`h-3 w-3 ${
                                    s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-10">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No reviews yet. Be the first to review this event!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Booking Panel */}
        <div className="w-full md:w-[360px] border-t md:border-t-0 md:border-l border-slate-100 p-6 sm:p-8 bg-slate-50/30 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {!bookingSuccess ? (
              <motion.div 
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
                    Secure Ticket Selection
                  </h3>

                  <div className="mt-5 space-y-4">
                    {/* Price banner */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-slate-500">Price per ticket</span>
                      <span className="text-2xl font-extrabold text-slate-900 font-mono">
                        {event.price === 0 ? 'FREE' : `$${event.price}`}
                      </span>
                    </div>

                    {/* Quantity selectors */}
                    {event.price > 0 && (
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2">
                        <span className="text-xs font-bold text-slate-600 pl-2">Quantity</span>
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}
                            disabled={ticketQty <= 1}
                            className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold disabled:opacity-40 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-slate-800 font-mono w-4 text-center">
                            {ticketQty}
                          </span>
                          <button
                            onClick={() => setTicketQty(Math.min(5, ticketQty + 1))}
                            disabled={ticketQty >= 5 || (event.spotsLeft !== undefined && ticketQty >= event.spotsLeft)}
                            className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold disabled:opacity-40 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Price breakdown */}
                    {event.price > 0 && (
                      <div className="space-y-2 text-xs font-semibold text-slate-500 pt-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono text-slate-700">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Convenience Processing Fee</span>
                          <span className="font-mono text-slate-700">${fees.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-slate-100 my-2" />
                        <div className="flex justify-between text-sm font-bold text-slate-800">
                          <span>Total Payment Amount</span>
                          <span className="font-mono text-slate-900">${totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {event.price === 0 && (
                      <p className="text-xs text-emerald-600 font-medium leading-relaxed bg-emerald-50/50 border border-emerald-100/40 p-3 rounded-lg">
                        This is a community-funded event. General admission passes are entirely free of cost. Reservation required to secure entry.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  {isAlreadyBooked ? (
                    <div className="text-center">
                      <p className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 p-3 rounded-xl mb-3">
                        You have already booked tickets for this event!
                      </p>
                      <button 
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        Keep Browsing
                      </button>
                    </div>
                  ) : (
                    <button
                      id="book-tickets-btn"
                      onClick={handleBooking}
                      disabled={event.spotsLeft !== undefined && event.spotsLeft <= 0}
                      className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold shadow-md shadow-amber-500/20 tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Ticket className="h-4.5 w-4.5" />
                      <span>{event.price === 0 ? 'Claim Free Reservation' : 'Complete Checkout Booking'}</span>
                    </button>
                  )}
                  <p className="text-[10px] font-medium text-slate-400 text-center mt-3 leading-relaxed">
                    By confirming, you agree to our terms of assembly and event compliance guidelines.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Success animation wrapper */}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs shadow-emerald-500/5">
                    <CheckCircle className="h-7 w-7 animate-bounce" />
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 flex items-center justify-center space-x-1">
                      <span>Reservation Secured!</span>
                      <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Your ticket pass has been added to your profile wallet.
                    </p>
                  </div>

                  {/* Complete virtual pass ticket card */}
                  <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-4.5 flex flex-col items-center shadow-xs relative overflow-hidden">
                    {/* Left and Right punches */}
                    <div className="absolute -left-2.5 top-[50%] -translate-y-1/2 h-5 w-5 rounded-full bg-slate-50 border-r border-slate-100" />
                    <div className="absolute -right-2.5 top-[50%] -translate-y-1/2 h-5 w-5 rounded-full bg-slate-50 border-l border-slate-100" />

                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      ADMIT {ticketQty} GUEST{ticketQty > 1 ? 'S' : ''}
                    </p>
                    <h4 className="font-display text-xs font-bold text-slate-800 line-clamp-1 mb-3">
                      {event.title}
                    </h4>

                    {/* QR Code */}
                    <div className="p-2 border border-slate-100 rounded-xl bg-white mb-3 shadow-inner">
                      {renderQRCode()}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 text-left pt-3 border-t border-dashed border-slate-100 text-[10px] font-semibold text-slate-400">
                      <div>
                        <span>GATE PASS ID</span>
                        <p className="font-mono text-slate-800 text-[11px] font-bold">EH-{(Math.random() * 1000000).toFixed(0)}</p>
                      </div>
                      <div>
                        <span>HOLDER</span>
                        <p className="text-slate-800 text-[11px] font-bold truncate">{currentUser.name.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition-all cursor-pointer"
                  >
                    Done & Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal absolute close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white/60 p-1.5 rounded-full backdrop-blur-md cursor-pointer border border-slate-100 shadow-xs"
          id="detail-modal-close-btn"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};
