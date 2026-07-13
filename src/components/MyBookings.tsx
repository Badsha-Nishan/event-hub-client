/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Ticket, Calendar, MapPin, Trash2, ShieldAlert,
  ArrowRight, Sparkles, Receipt, CheckCircle, TrendingUp, HelpCircle
} from 'lucide-react';
import { Booking, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MyBookingsProps {
  bookings: Booking[];
  currentUser: User;
  onCancel: (bookingId: string) => void;
  onExploreClick: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  bookings,
  currentUser,
  onCancel,
  onExploreClick,
}) => {
  // Stats calculations
  const stats = React.useMemo(() => {
    const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);
    const freePasses = bookings.filter(b => b.price === 0).length;
    const paidPasses = bookings.length - freePasses;
    
    return {
      totalSpent: totalSpent.toFixed(2),
      freePasses,
      paidPasses,
      totalCount: bookings.length
    };
  }, [bookings]);

  // Programmatic SVG QR code path generator
  const renderQRCode = (seed: string) => {
    // Generate static matrix-like paths for high fidelity aesthetic QR code
    return (
      <svg className="w-20 h-20 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
        {/* Corner alignment markers */}
        <rect x="0" y="0" width="28" height="28" rx="1.5" />
        <rect x="4" y="4" width="20" height="20" fill="white" />
        <rect x="8" y="8" width="12" height="12" />

        <rect x="72" y="0" width="28" height="28" rx="1.5" />
        <rect x="76" y="4" width="20" height="20" fill="white" />
        <rect x="80" y="8" width="12" height="12" />

        <rect x="0" y="72" width="28" height="28" rx="1.5" />
        <rect x="4" y="76" width="20" height="20" fill="white" />
        <rect x="8" y="80" width="12" height="12" />

        <rect x="76" y="76" width="8" height="8" />

        {/* Dynamic-looking datablocks */}
        <rect x="32" y="4" width="8" height="8" />
        <rect x="44" y="16" width="8" height="8" />
        <rect x="56" y="8" width="8" height="12" />
        
        <rect x="4" y="32" width="12" height="8" />
        <rect x="24" y="44" width="8" height="8" />
        <rect x="12" y="52" width="4" height="8" />

        <rect x="44" y="32" width="16" height="8" />
        <rect x="32" y="52" width="8" height="12" />
        <rect x="48" y="48" width="12" height="4" />

        <rect x="68" y="32" width="8" height="16" />
        <rect x="80" y="44" width="8" height="8" />
        <rect x="76" y="56" width="12" height="4" />

        <rect x="36" y="72" width="12" height="8" />
        <rect x="32" y="84" width="20" height="4" />
        <rect x="60" y="76" width="4" height="12" />
      </svg>
    );
  };

  return (
    <div className="space-y-8" id="bookings-dashboard">
      
      {/* Wallet Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Gate Passes</span>
            <p className="font-display text-2xl font-extrabold text-slate-800">{stats.totalCount}</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified admission ready</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Ticket className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Booking Investment</span>
            <p className="font-display text-2xl font-extrabold text-slate-800 font-mono">${stats.totalSpent}</p>
            <p className="text-[10px] text-slate-400 font-medium">Convenience tax/fees included</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Receipt className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Community Passes</span>
            <p className="font-display text-2xl font-extrabold text-slate-800">{stats.freePasses}</p>
            <p className="text-[10px] text-slate-400 font-medium">{stats.paidPasses} premium tier reservations</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-5">
        <h3 className="font-display text-base font-bold text-slate-800 text-left">Your Digital Passports</h3>

        <AnimatePresence mode="popLayout">
          {bookings.length > 0 ? (
            <div className="space-y-5 max-w-4xl mx-auto">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col md:flex-row rounded-3xl border border-slate-100 bg-white shadow-xs hover:shadow-md hover:border-slate-200/50 transition-all overflow-hidden text-left"
                  id={`ticket-pass-${booking.id}`}
                >
                  
                  {/* Left Ticket Cover Image Side */}
                  <div className="relative w-full md:w-56 shrink-0 aspect-video md:aspect-auto overflow-hidden bg-slate-100">
                    <img 
                      src={booking.eventImage} 
                      alt={booking.eventTitle} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="inline-block rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-wider backdrop-blur-xs uppercase mb-1">
                        ADMISSION PASS
                      </span>
                      <p className="font-mono text-[9px] font-medium text-slate-300">BOOKED: {booking.bookingDate}</p>
                    </div>
                  </div>

                  {/* Main Ticket body */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-widest block mb-1">
                          CONVERTED GUEST PASS
                        </span>
                        <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          ID: {booking.id}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-extrabold text-slate-900 group-hover:text-amber-500 transition-colors mb-2">
                        {booking.eventTitle}
                      </h4>

                      <div className="space-y-1.5 text-xs text-slate-500 font-semibold mb-4">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>Event Assembly Time</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>Venue Gate Assembly Coordinates</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                      <div>
                        <span className="text-[10px] font-medium text-slate-400 block uppercase">Admission Cost</span>
                        <span className="text-sm font-extrabold font-mono text-slate-800">
                          {booking.price === 0 ? <span className="text-emerald-600 font-sans">FREE</span> : `$${booking.price}`}
                        </span>
                      </div>

                      {/* Cancel gate pass button */}
                      <button
                        onClick={() => onCancel(booking.id)}
                        className="flex items-center space-x-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 hover:border-rose-100/50 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                        id={`cancel-booking-btn-${booking.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  </div>

                  {/* Perforated Separator Dots Line (Desktop) */}
                  <div className="hidden md:flex flex-col justify-between items-center py-2 shrink-0 relative px-1">
                    <div className="w-5 h-2.5 rounded-b-full bg-slate-50 border-x border-b border-slate-100 -mt-2" />
                    <div className="border-l border-dashed border-slate-200 h-full my-2" />
                    <div className="w-5 h-2.5 rounded-t-full bg-slate-50 border-x border-t border-slate-100 -mb-2" />
                  </div>

                  {/* Perforated Separator (Mobile) */}
                  <div className="flex md:hidden items-center justify-between px-2 py-1 shrink-0 relative">
                    <div className="h-5 w-2.5 rounded-r-full bg-slate-50 border-y border-r border-slate-100 -ml-2" />
                    <div className="border-t border-dashed border-slate-200 w-full mx-2" />
                    <div className="h-5 w-2.5 rounded-l-full bg-slate-50 border-y border-l border-slate-100 -mr-2" />
                  </div>

                  {/* Right Stub (Gate Scan) */}
                  <div className="w-full md:w-44 shrink-0 p-5 bg-slate-50/50 flex flex-row md:flex-col items-center justify-between md:justify-center text-center">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="p-1.5 border border-slate-100 rounded-xl bg-white shadow-xs">
                        {renderQRCode(booking.id)}
                      </div>
                      <span className="font-mono text-[9px] text-slate-400 font-bold block mt-1.5 tracking-wider">
                        SECURE STUB CODE
                      </span>
                    </div>

                    <div className="text-right md:text-center md:mt-3">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block leading-none mb-1">
                        HOLDER
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {currentUser.name}
                      </p>
                      <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                        GATE SCAN READY
                      </span>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center max-w-lg mx-auto"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4">
                <Ticket className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-slate-800">Your Wallet is Empty</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-xs mx-auto">
                No active gate passes found. Find premium gatherings, concerts, and tech workshops, then reserve your tickets instantly.
              </p>
              <button
                onClick={onExploreClick}
                className="mt-6 inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                id="discover-events-cta-btn"
              >
                <span>Discover Events</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helpful Wallet details */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-100 p-4.5 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4 text-left">
        <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-amber-50 text-amber-500">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-slate-800 block">How do I access my tickets at the venue?</span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Upon arrival, locate the venue ticketing check-in deck and present the digital stubs above. Standard code verification scanner matches your gate pass ID against local host databases securely.
          </p>
        </div>
      </div>
    </div>
  );
};
