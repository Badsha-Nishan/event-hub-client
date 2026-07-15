// src/pages/StaticPages.tsx
import React from "react";
import { Sparkles, MapPin, Phone, Mail, Globe } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-left space-y-8 animate-in fade-in duration-200">
      <div className="space-y-3">
        <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
          <Sparkles className="w-3 h-3" />
          <span>Our Vision</span>
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Connecting Communities Globally
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          EventHub is the premier platform designed to assemble active minds,
          creative thinkers, and industry leaders. We empower hosts to create
          seamless events and attendees to reserve credentials effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-800">
            1. Instant Credentialing
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Our proprietary ticket reservation pipeline manages inventory and
            distributes passes instantly without third-party fees.
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-800">
            2. Highly Curated List
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Every single premium screening and assembly listed is strictly
            verified for quality control and genuine community build.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-left space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Get in Touch
        </h2>
        <p className="text-xs text-slate-500">
          Have questions about an assembly or hosting credentials? Our support
          desk is open 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <p>Dhaka, Bangladesh</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <Phone className="w-5 h-5 text-indigo-600" />
          <p>+880 1234 56789</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <p>support@eventhub.com</p>
        </div>
      </div>
    </div>
  );
}
