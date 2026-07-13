/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Ticket, Plus, Sparkles } from 'lucide-react';
import { User, Booking } from '../types';

interface HeaderProps {
  activeTab: 'explore' | 'bookings';
  setActiveTab: (tab: 'explore' | 'bookings') => void;
  onHostClick: () => void;
  currentUser: User;
  bookings: Booking[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onHostClick,
  currentUser,
  bookings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('explore')} 
          className="flex cursor-pointer items-center space-x-2.5 group"
          id="brand-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Calendar className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">Event</span>
              <span className="font-display text-xl font-extrabold tracking-tight text-amber-500">Hub</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">Premium Curations</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            id="nav-explore-btn"
            onClick={() => setActiveTab('explore')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'explore'
                ? 'bg-amber-50 text-amber-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Explore Events</span>
          </button>
          <button
            id="nav-bookings-btn"
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 relative ${
              activeTab === 'bookings'
                ? 'bg-amber-50 text-amber-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>My Tickets</span>
            {bookings.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-bounce">
                {bookings.length}
              </span>
            )}
          </button>
        </nav>

        {/* User Profile & Call to Action */}
        <div className="flex items-center space-x-4">
          <button
            id="host-event-btn"
            onClick={onHostClick}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2.5 font-display text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-slate-800 transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-slate-900/10"
          >
            <Plus className="h-4 w-4" />
            <span>Host Event</span>
          </button>

          {/* User profile avatar badge */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-100">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[10px] font-medium text-slate-400 capitalize">{currentUser.role || 'Attendee'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-inner">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation bottom bar */}
      <div className="flex md:hidden border-t border-slate-100 bg-white">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] font-semibold transition-all ${
            activeTab === 'explore' ? 'text-amber-500' : 'text-slate-500'
          }`}
        >
          <Calendar className="h-4.5 w-4.5 mb-1" />
          Explore
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] font-semibold relative transition-all ${
            activeTab === 'bookings' ? 'text-amber-500' : 'text-slate-500'
          }`}
        >
          <Ticket className="h-4.5 w-4.5 mb-1" />
          Tickets
          {bookings.length > 0 && (
            <span className="absolute top-2 right-12 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
              {bookings.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
