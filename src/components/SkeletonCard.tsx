// src/components/SkeletonCard.tsx
import React from "react";

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-4 h-[400px] flex flex-col justify-between">
      {/* Image Skeleton */}
      <div className="h-44 w-full bg-slate-200 rounded-xl" />

      <div className="space-y-3 flex-1 text-left">
        {/* Category Badge Skeleton */}
        <div className="h-4 w-1/4 bg-slate-200 rounded-md" />
        {/* Title Skeleton */}
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        {/* Description Skeleton */}
        <div className="h-3 w-full bg-slate-200 rounded-md" />
        <div className="h-3 w-5/6 bg-slate-200 rounded-md" />
      </div>

      {/* Meta Info Skeleton */}
      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
        <div className="h-4 w-1/4 bg-slate-200 rounded-md" />
      </div>

      {/* Button Skeleton */}
      <div className="h-9 w-full bg-slate-200 rounded-xl animate-none" />
    </div>
  );
}
