/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, MapPin, DollarSign, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { EventItem, DaySchedule, ScheduleItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (event: Omit<EventItem, 'id' | 'organizer' | 'reviews'>) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Technology Summit',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaty1gCXF0LzTvSc85KSpN_r-Q_E8q5ITKj6jnFs9ytQtQKQ82v4BAIsoOHY10nBUq_hfuSfevHFVmSwx4tdBmIuLGmtk9Zk4yLB7bwCMrzR6fxUcqB6GnC1SbI785uFf517VYyjEmPXJ6BoIg0TyJY6X_Fz3D8bKZMofjurTSeDYpy5ph2y7L_AurFwmTX1GgtJH16oQfJ4almLLRtB8qiIF_LRak_D5j_bGu0tm9E71nj8UD6FuN'
  },
  {
    name: 'Music & Jazz Rooftop',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKzMpCQXGjZXnyJN66ufTbaas8cVeQ20yhuqzXjhJMyMG-89as1CJv_n2HZiKePN0FAshHjhvGpTRljmvehJ0sAJ3bhgKAvxhduUkDv1VphuHPuLr-IK-e5EW_-cZd1bkBNt442zE_LbiQtCIqAF_-C7ILXca7gjIcGaJSLVmOLhncLM9XK5Df2qvvidp5kbtRdENSm73x-mczOE8ToWLgStTx8wUg3uEVTB35ignCAoLZmz2_mjtU'
  },
  {
    name: 'Artisan Culinary Kitchen',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXWDNfgbGqCSn0La5i5oDpx7eojhS8TA2FPfP3q53CVMuqKC90KteXMck4J3N0bALamOlkuoxnkV_3eOjVr8hMVdnCbNG2udPIXMOiH9rgydiYdglZ3eGw62CdEFWy2NpUuXzH8SqGCtmP9jOUIgCA3LFSHgsROZvOCZlvHZjsME2DT1BfCSH93WeT3Ux9w3qjHvjIfTzNmcXa5BTdORMi0ya_QlJA1Qi1Hl_DBuPjPHk-vBX9uww'
  },
  {
    name: 'Interactive Arts Gallery',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7WYmF5_EJee3mfOj5MfM2-4sRwB7-mrPGZGdKA1xKvBBepNN3OPqyX4p5ofQQ2LawYGsH0qQheGeje9Sxh4MVa2qFrvOTqOWz1iyQYxyYqNEANQ-Yj8oO5w6-h3ER4VkoyJRf3S4X1-X_iWl4uNjSdFsjhRzQ_0Qdkw8t02Fiz9M10As04h7RXukj9hc3jjVBi1WsuCIAuYWvzZUyLD02uRIeq65pDncu_Y5gRuQ0jU-TqmJU2_W7'
  }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onCreate }) => {
  // Form Field States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventItem['category']>('Tech');
  const [tag, setTag] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [spots, setSpots] = useState<number>(100);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  
  // Custom Agenda Builder State (Draft)
  const [agendaItems, setAgendaItems] = useState<ScheduleItem[]>([]);
  const [newItemTime, setNewItemTime] = useState('09:00 AM');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const handleAddAgendaItem = () => {
    if (!newItemTitle.trim()) return;
    setAgendaItems([
      ...agendaItems,
      {
        time: newItemTime,
        title: newItemTitle,
        description: newItemDesc
      }
    ]);
    setNewItemTitle('');
    setNewItemDesc('');
  };

  const handleRemoveAgendaItem = (idx: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim() || !dateStr || !location.trim()) return;

    // Package event schedules
    const formattedSchedule: DaySchedule[] = agendaItems.length > 0 ? [
      {
        dayTitle: 'Main Agenda Schedule',
        date: displayDate || 'Event Day',
        items: agendaItems
      }
    ] : [];

    onCreate({
      title,
      category,
      tag: tag || category,
      description: shortDesc,
      longDescription: longDesc,
      date: dateStr,
      displayDate: displayDate || dateStr,
      location,
      price: Number(price),
      spotsLeft: Number(spots),
      image: imageUrl,
      schedule: formattedSchedule
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      id="create-event-modal"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/20">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">Host a Premium Gathering</h2>
            <p className="text-xs text-slate-400">Design your event timeline, ticketing tier, and publish instantly.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full cursor-pointer transition-all"
            id="create-modal-close-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main info card */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">1. Basic Manifest</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Symphony in the Park, VR Art Gala"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!tag) setTag(e.target.value.split(':')[0].substring(0, 15));
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Domain</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventItem['category'])}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 bg-white"
                >
                  {['Music', 'Tech', 'Business', 'Arts', 'Food', 'Design', 'Sports', 'Networking'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Display Tag / Badge text</label>
                <input
                  type="text"
                  placeholder="e.g. Cultural Gala, Classical"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exact Calendar Date</label>
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => {
                    setDateStr(e.target.value);
                    if (!displayDate) {
                      const d = new Date(e.target.value);
                      setDisplayDate(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Aesthetic Display Date text</label>
                <input
                  type="text"
                  placeholder="e.g. Oct 24, 2024 or Nov 02, 2024"
                  value={displayDate}
                  onChange={(e) => setDisplayDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Botanical Gardens, SF Hub"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Venue Capacity (Spots)</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={spots}
                  onChange={(e) => setSpots(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          {/* Banner configuration */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">2. Event Cover Image</h3>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Aesthetic Covered Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      imageUrl === preset.url ? 'border-amber-500 ring-2 ring-amber-500/25 scale-95' : 'border-slate-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 p-1 text-[8px] font-bold text-white text-center truncate">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Or Paste Custom Cover URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing tier */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">3. Ticketing Tier</h3>
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 block">General Admission Cost</span>
                <p className="text-[11px] text-slate-400">Set event ticket pricing. Keep at $0 to offer Free community reservations.</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-28 rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs font-bold font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">USD</span>
              </div>
            </div>
          </div>

          {/* Copywrite descriptions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">4. Editorial Narratives</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Short Punchy Description</label>
                <input
                  type="text"
                  required
                  placeholder="Capture user attention in 1-2 sentences."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Long-form Agenda Details</label>
                <textarea
                  rows={4}
                  placeholder="Expand on session highlights, speaker guidelines, and specific prerequisites..."
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Agenda schedule builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">5. Dynamic Live Timeline</h3>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">{agendaItems.length} Draft Sessions Added</span>
            </div>

            {/* Existing added items preview */}
            {agendaItems.length > 0 && (
              <div className="space-y-2 border border-slate-100 rounded-2xl p-4.5 bg-slate-50/20 max-h-[180px] overflow-y-auto">
                {agendaItems.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-2.5 bg-white border border-slate-50 rounded-xl">
                    <div className="space-y-0.5 max-w-[85%] text-left">
                      <span className="font-mono text-[10px] font-bold text-amber-600 block">{item.time}</span>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      {item.description && <p className="text-[11px] text-slate-400">{item.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAgendaItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 cursor-pointer transition-all shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline adder inputs */}
            <div className="p-4.5 border border-dashed border-slate-200 rounded-2xl bg-white space-y-3.5 text-left">
              <span className="text-[11px] font-bold text-slate-500 block">Add Agenda Timeline Block</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Time Indicator</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM, 11:30 AM"
                    value={newItemTime}
                    onChange={(e) => setNewItemTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Agenda Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Opening Keynote, Networking Panel"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Speaker: Dr. Thorne, panel moderator details..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddAgendaItem}
                  disabled={!newItemTitle.trim()}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Insert Agenda Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              Cancel Draft
            </button>
            <button
              type="submit"
              id="publish-event-btn"
              className="rounded-xl px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/10 tracking-wide transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Publish Gathering</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
