// src/components/LandingSections.tsx
import {
  Award,
  ShieldCheck,
  Flame,
  Star,
  Quote,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

// src/components/LandingSections.tsx (এর ভেতরে যুক্ত করো)
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Users, Ticket } from "lucide-react";

// Mock Data for Global Booking Trends over months
const MOCK_TREND_DATA = [
  { month: "Jan", Bookings: 120, PremiumPasses: 45 },
  { month: "Feb", Bookings: 210, PremiumPasses: 85 },
  { month: "Mar", Bookings: 180, PremiumPasses: 60 },
  { month: "Apr", Bookings: 340, PremiumPasses: 150 },
  { month: "May", Bookings: 310, PremiumPasses: 130 },
  { month: "Jun", Bookings: 480, PremiumPasses: 220 },
  { month: "Jul", Bookings: 590, PremiumPasses: 310 },
];

export function TrendChartSection() {
  return (
    <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6 text-left my-8">
      {/* Section Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            <TrendingUp className="w-3 h-3" />
            <span>Platform Metrics</span>
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Global Assembly Engagement & Reservations
          </h3>
          <p className="text-xs text-slate-400">
            Real-time visual ledger tracking platform-wide pass reservations and
            premium tier admissions.
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-4 text-[11px] font-bold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span>Total Bookings</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Premium Passes</span>
          </div>
        </div>
      </div>

      {/* Interactive Area Chart (Requirement 1) */}
      <div className="h-64 w-full text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={MOCK_TREND_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Area
              type="monotone"
              dataKey="Bookings"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
            <Area
              type="monotone"
              dataKey="PremiumPasses"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPremium)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- ৪. STATS SECTION ---
export function StatsSection() {
  const stats = [
    {
      id: 1,
      icon: Users,
      value: "45K+",
      label: "Active Event Goers",
      desc: "Verified community members interacting daily",
    },
    {
      id: 2,
      icon: Award,
      value: "1,200+",
      label: "Premium Hosts",
      desc: "Top-tier global enterprise & creative minds",
    },
    {
      id: 3,
      icon: ShieldCheck,
      value: "99.9%",
      label: "Secure Bookings",
      desc: "Instant verification with automated compliance",
    },
  ];

  return (
    <section className="py-12 bg-slate-50 rounded-3xl border border-slate-100/80 px-6 sm:px-12 my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-start space-x-4 text-left">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </h4>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-400 leading-normal mt-1">
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- ৫. FEATURED HIGHLIGHTS ---
export function FeaturedHighlights() {
  return (
    <section className="py-8 my-6 text-left">
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="space-y-3 max-w-xl relative z-10">
          <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Trending Assembly This Week</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Silicon Valley Venture Match 2026
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct elevator pitches to 50+ tier-1 venture capital groups.
            Limited to 200 accredited founders. Applications close in less than
            48 hours.
          </p>
        </div>
        <button
          onClick={() =>
            document
              .getElementById("explore")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="shrink-0 bg-white text-slate-900 font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer relative z-10 w-full md:w-auto text-center shadow-lg"
        >
          Check Seat Availability
        </button>
      </div>
    </section>
  );
}

// --- 💻 ৬. TESTIMONIALS SECTION ---
export function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Product Director at Meta",
      text: "EventHub shifted how we discover industry meetups. The automated routing interface and seamless UX is unmatched.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Independent Curator",
      text: "Hosting premium high-ticket workshops became effortless. Booking verifications are rapid, stable, and completely transparent.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <section className="py-10 my-6 text-left">
      <div className="text-center max-w-md mx-auto space-y-2 mb-8">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          Trusted by Industry Leaders
        </h3>
        <p className="text-xs text-slate-400">
          Discover experiences backed by thousands of five-star professional
          verifications.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-4 relative flex flex-col justify-between"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100 shrink-0" />
            <p className="text-xs text-slate-500 italic leading-relaxed relative z-10">
              "{rev.text}"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h5 className="text-xs font-bold text-slate-800">{rev.name}</h5>
                <p className="text-[10px] text-slate-400">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 🌐 ৭. FOOTER MATRIX SECTION ---
export function Footer() {
  return (
    <footer className="mt-20 border-t  border-slate-100 bg-white pt-12 pb-6 text-left">
      <div className="grid grid-cols-1 pl-5 mx-auto max-w-7xl md:grid-cols-4 gap-8 mb-8 text-xs justify-items-center">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs">
              E
            </div>
            <span className="font-display font-black text-sm text-slate-800 tracking-tight">
              EventHub
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            The unified infrastructure framework for premium corporate events,
            elite workshops, and cultural assemblies.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-slate-800 mb-3 tracking-wider uppercase text-[10px]">
            Discover
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a
                href="#explore"
                className="hover:text-indigo-600 transition-colors"
              >
                Tech Assemblies
              </a>
            </li>
            <li>
              <a
                href="#explore"
                className="hover:text-indigo-600 transition-colors"
              >
                Live Concerts
              </a>
            </li>
            <li>
              <a
                href="#explore"
                className="hover:text-indigo-600 transition-colors"
              >
                VIP Masterclasses
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-slate-800 mb-3 tracking-wider uppercase text-[10px]">
            Company
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Support Center
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h5 className="font-bold text-slate-800 tracking-wider uppercase text-[10px]">
            Stay Connected
          </h5>
          <div className="flex space-x-3 text-slate-400">
            <Twitter className="w-4 h-4 hover:text-indigo-600 cursor-pointer" />
            <Github className="w-4 h-4 hover:text-indigo-600 cursor-pointer" />
            <Linkedin className="w-4 h-4 hover:text-indigo-600 cursor-pointer" />
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            © 2026 EventHub Ecosystem Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
