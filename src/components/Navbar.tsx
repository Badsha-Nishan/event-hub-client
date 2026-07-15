// src/components/layout/Navbar.tsx
import React from "react";
import {
  Calendar,
  User as UserIcon,
  LogOut,
  Shield,
  MapPin,
  Sparkles,
} from "lucide-react";
import { User, Booking } from "../types";

interface NavbarProps {
  currentUser: User | null;
  bookings: Booking[];
  onLogout: () => void;
  onTabChange: (
    tab: "explore" | "bookings" | "manage" | "auth" | "about" | "contact"
  ) => void;
  activeTab: string;
}

export function Navbar({
  currentUser,
  bookings,
  onLogout,
  onTabChange,
  activeTab,
}: NavbarProps) {
  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "Administrator";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange("explore")}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          <div className="bg-indigo-600 text-white p-2 rounded-2xl shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-700 transition-all">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-black text-slate-900 leading-none tracking-tight">
              EVENT<span className="text-indigo-600">HUB</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Assemblies
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Routes (Requirement 3) */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl">
          {/* 1. Explore (সবার জন্য) */}
          <button
            onClick={() => onTabChange("explore")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "explore"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Explore
          </button>

          {/* 2. My Bookings (শুধুমাত্র লগড-ইন ইউজার) */}
          {currentUser && (
            <button
              onClick={() => onTabChange("bookings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "bookings"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              My Bookings
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">
                  {bookings.length}
                </span>
              )}
            </button>
          )}

          {/* 3. Manage Assemblies (শুধুমাত্র অ্যাডমিন ইউজার) */}
          {currentUser && isAdmin && (
            <button
              onClick={() => onTabChange("manage")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === "manage"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Manage</span>
            </button>
          )}

          {/* 4. About (সবার জন্য - Req 10) */}
          <button
            onClick={() => onTabChange("about")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "about"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            About Us
          </button>

          {/* 5. Contact (সবার জন্য - Req 10) */}
          <button
            onClick={() => onTabChange("contact")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Contact
          </button>
        </div>

        {/* User Session Interface */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-1.5 pl-3 rounded-2xl">
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-800 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all cursor-pointer border border-slate-100"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onTabChange("auth")}
              className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-slate-900/10 flex items-center space-x-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
