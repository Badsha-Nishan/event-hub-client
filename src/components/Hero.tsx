// src/components/Hero.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

// স্লাইডারের জন্য প্রোডাকশন-রেডি রিয়েল ডেটা (No placeholder!)
const SLIDE_DATA = [
  {
    id: 1,
    tag: "TECH & INNOVATION",
    title: "NextGen Developers Summit 2026",
    description:
      "Join 5,000+ global innovators, full-stack engineers, and tech leaders for the ultimate breakdown of future web architectures and AI automation.",
    bgImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Reserve Free Pass",
    color: "from-indigo-600/90 to-slate-900/95",
  },
  {
    id: 2,
    tag: "PREMIUM LIVE MUSIC",
    title: "Midnight Jazz Rooftop Sessions",
    description:
      "Experience an elite, intimate evening of live contemporary jazz overlooking the city skyline, featuring award-winning global ensembles and curated culinary pairings.",
    bgImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Book VIP Access",
    color: "from-amber-600/90 to-slate-900/95",
  },
  {
    id: 3,
    tag: "CREATIVE ENTERPRISE",
    title: "Global Design & UX Masterclass",
    description:
      "Elevate your product strategy with intensive design sprints, visual storytelling frameworks, and real-world case studies led by top-tier agency directors.",
    bgImage:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Register Online",
    color: "from-emerald-600/90 to-slate-900/95",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // অটো-প্লে স্লাইডার লজিক (প্রতি ৫ সেকেন্ড পর পর স্লাইড চেঞ্জ হবে)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % SLIDE_DATA.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDE_DATA.length) % SLIDE_DATA.length
    );

  const slide = SLIDE_DATA[currentSlide];

  return (
    <div className="relative h-[65vh] w-full overflow-hidden bg-slate-950 text-white shadow-xl">
      {/* Background Slides with Motion Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.bgImage})` }}
        >
          {/* Gradient overlay for text readability based on our theme */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-slate-950/80 to-slate-950`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Wrapper */}
      <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-left space-y-4">
          {/* Interactive Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={`tag-${currentSlide}`}
            className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-white border border-white/10 backdrop-blur-xs"
          >
            <Sparkles className="h-3 w-3 text-eventAccent animate-pulse" />
            <span>{slide.tag}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={`title-${currentSlide}`}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white"
          >
            {slide.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`desc-${currentSlide}`}
            className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl"
          >
            {slide.description}
          </motion.p>

          {/* Action Call To Action (CTA) Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            key={`cta-${currentSlide}`}
            className="flex flex-wrap gap-3 pt-2"
          >
            <a
              href="#explore"
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("explore")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center space-x-2 rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xs hover:bg-white/20 transition-all cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-slate-300" />
              <span>Explore Assemblies</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Manual Slider Controller Arrow Buttons */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-2 z-10">
        <button
          onClick={prevSlide}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 border border-white/5 cursor-pointer transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 border border-white/5 cursor-pointer transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Slide Progress Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
        {SLIDE_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? "w-6 bg-indigo-500" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
