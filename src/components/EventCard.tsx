/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Calendar, Star, Heart, Flame } from 'lucide-react';
import { EventItem } from '../types';
import { motion } from 'motion/react';

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
  isBooked: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, isBooked }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (!event.reviews || event.reviews.length === 0) return null;
    const total = event.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return (total / event.reviews.length).toFixed(1);
  }, [event.reviews]);

  // Map category to aesthetic color styling
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Music':
        return { bg: 'bg-blue-50 text-blue-600 border-blue-100/50', dot: 'bg-blue-400' };
      case 'Tech':
        return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100/50', dot: 'bg-emerald-400' };
      case 'Business':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100/50', dot: 'bg-amber-500' };
      case 'Arts':
        return { bg: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100/50', dot: 'bg-fuchsia-400' };
      case 'Food':
        return { bg: 'bg-rose-50 text-rose-600 border-rose-100/50', dot: 'bg-rose-400' };
      case 'Design':
        return { bg: 'bg-violet-50 text-violet-600 border-violet-100/50', dot: 'bg-violet-400' };
      case 'Sports':
        return { bg: 'bg-sky-50 text-sky-600 border-sky-100/50', dot: 'bg-sky-400' };
      default:
        return { bg: 'bg-slate-50 text-slate-600 border-slate-100/50', dot: 'bg-slate-400' };
    }
  };

  const catStyle = getCategoryStyles(event.category);
  const isLowSpots = event.spotsLeft !== undefined && event.spotsLeft <= 25;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-shadow duration-300 hover:shadow-md hover:border-slate-200/60"
      id={`event-card-${event.id}`}
    >
      {/* Event Banner Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

        {/* Category & Tags overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-xs ${catStyle.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${catStyle.dot}`} />
            <span>{event.tag}</span>
          </span>
          {isBooked && (
            <span className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-600 shadow-xs">
              Booked
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20 scale-105' 
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          id={`fav-btn-${event.id}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Spots Left Warning */}
        {isLowSpots && event.spotsLeft !== undefined && event.spotsLeft > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 rounded-md bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-xs">
            <Flame className="h-3 w-3 animate-pulse" />
            <span>{event.spotsLeft} SPOTS LEFT</span>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Date & Ratings line */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2.5">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{event.displayDate}</span>
          </div>
          {averageRating && (
            <div className="flex items-center space-x-1 bg-amber-50/50 border border-amber-100/30 px-1.5 py-0.5 rounded-md">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-amber-700 font-bold">{averageRating}</span>
              <span className="text-slate-400 text-[10px] font-normal">({event.reviews?.length})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-display text-base font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors duration-200 mb-2">
          {event.title}
        </h3>

        {/* Short Description */}
        <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Spacer */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          {/* Location */}
          <div className="flex items-center space-x-1 text-slate-500 max-w-[60%]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate text-xs font-medium">{event.location}</span>
          </div>

          {/* Pricing indicator */}
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">Tickets</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {event.price === 0 ? (
                <span className="text-emerald-600 font-sans">FREE</span>
              ) : (
                `$${event.price}`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Entire Card Trigger Overlay */}
      <button 
        onClick={onClick} 
        className="absolute inset-0 h-full w-full cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 rounded-2xl"
        aria-label={`View details for ${event.title}`}
      />
    </motion.div>
  );
};
