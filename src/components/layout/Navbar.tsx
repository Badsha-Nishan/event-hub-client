// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import {
  Menu,
  X,
  Calendar,
  PlusCircle,
  Settings,
  LogIn,
  LogOut,
  Info,
  Phone,
  Compass,
  BookmarkCheck,
} from "lucide-react";
import { User, Booking } from "../../types";

interface NavbarProps {
  currentUser: User | null;
  bookings: Booking[];
  onLogout: () => void;
  onLoginDemo: (role: "user" | "admin") => void;
  onAddEventClick: () => void; // ⚡ মডাল ওপেন করার নতুন প্রপ্স
  onTabChange: (tab: "explore" | "bookings") => void; // ⚡ ট্যাব চেঞ্জ করার প্রপ্স
}

export function Navbar({
  currentUser,
  bookings,
  onLogout,
  onLoginDemo,
  onAddEventClick,
  onTabChange,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // লগড-আউট ইউজারদের লিংক
  const loggedOutLinks = [
    { name: "Home", icon: <Compass className="w-4 h-4" />, href: "#" },
    {
      name: "Explore",
      icon: <Calendar className="w-4 h-4" />,
      href: "#explore",
    },
    { name: "About", icon: <Info className="w-4 h-4" />, href: "#about" },
    { name: "Contact", icon: <Phone className="w-4 h-4" />, href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onTabChange("explore")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Event<span className="text-indigo-600">Hub</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {currentUser ? (
              <>
                {/* Explore (সব রোলই দেখতে পারবে) */}
                <button
                  onClick={() => {
                    onTabChange("explore");
                    document
                      .getElementById("explore")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </button>

                {/* My Bookings (সব রোলই দেখতে পারবে) */}
                <button
                  onClick={() => onTabChange("bookings")}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>My Bookings</span>
                  {bookings.length > 0 && (
                    <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-extrabold text-white animate-pulse">
                      {bookings.length}
                    </span>
                  )}
                </button>

                {/* 🔒 শুধুমাত্র ADMIN দেখতে পারবে: Add Event & Manage Items */}
                {currentUser.role === "admin" && (
                  <>
                    <button
                      onClick={onAddEventClick}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50/60 cursor-pointer transition-all bg-emerald-50/30 border border-emerald-100/50"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Event</span>
                    </button>
                    <a
                      href="#manage"
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Items</span>
                    </a>
                  </>
                )}

                {/* User Profile Info & Logout */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      {currentUser.name}
                    </p>
                    <span
                      className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        currentUser.role === "admin"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {loggedOutLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}

                {/* Demo Logins for Testing Roles */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-200">
                  <button
                    onClick={() => onLoginDemo("user")}
                    className="flex items-center space-x-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer transition-all"
                  >
                    <span>User Login</span>
                  </button>
                  <button
                    onClick={() => onLoginDemo("admin")}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Admin Login</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-all"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-inner text-left">
          {currentUser ? (
            <>
              <button
                onClick={() => {
                  onTabChange("explore");
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </button>

              <button
                onClick={() => {
                  onTabChange("bookings");
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <BookmarkCheck className="w-4 h-4" />
                  <span>My Bookings</span>
                </div>
                {bookings.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {bookings.length}
                  </span>
                )}
              </button>

              {currentUser.role === "admin" && (
                <>
                  <button
                    onClick={() => {
                      onAddEventClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </>
              )}

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between px-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    {currentUser.role}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {loggedOutLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onLoginDemo("user");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <span>User Login</span>
                </button>
                <button
                  onClick={() => {
                    onLoginDemo("admin");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin Login</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
