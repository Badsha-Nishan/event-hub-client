// src/components/CreateEventModal.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Image,
  Tag,
  FileText,
} from "lucide-react";
import { EventItem } from "../types";

// ১. Zod Schema তৈরি করা (Requirement 8 - Form Validation)
const eventSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters long" }),
  date: z.string().min(1, { message: "Event date is required" }),
  location: z
    .string()
    .min(3, { message: "Location/Platform details are required" }),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Price cannot be negative" })
  ),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEvent: Omit<EventItem, "id">) => void;
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      price: 0,
      category: "Tech",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: EventFormValues) => {
    onSubmit(data);
    reset(); // সাবমিট শেষে ফর্ম ক্লিয়ার করা
    onClose(); // মডাল বন্ধ করা
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-base font-bold text-slate-800 text-left">
            Create Premium Assembly
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-left"
        >
          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">
              Assembly Title
            </label>
            <div className="relative">
              <input
                {...register("title")}
                type="text"
                placeholder="e.g., Silicon Beach Tech Conference"
                className={`w-full text-xs rounded-xl border ${
                  errors.title
                    ? "border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:ring-indigo-100"
                } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3`}
              />
            </div>
            {errors.title && (
              <p className="text-[10px] font-semibold text-rose-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Grid for Category, Date & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
              >
                <option value="Tech">Tech</option>
                <option value="Music">Music</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Date input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">
                Event Date
              </label>
              <input
                {...register("date")}
                type="date"
                className={`w-full text-xs rounded-xl border ${
                  errors.date ? "border-rose-400" : "border-slate-200"
                } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100`}
              />
              {errors.date && (
                <p className="text-[10px] font-semibold text-rose-500">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Price input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">
                Ticket Fee ($)
              </label>
              <input
                {...register("price")}
                type="number"
                placeholder="0 for Free"
                className={`w-full text-xs rounded-xl border ${
                  errors.price ? "border-rose-400" : "border-slate-200"
                } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100`}
              />
              {errors.price && (
                <p className="text-[10px] font-semibold text-rose-500">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">
              Location / Platform Info
            </label>
            <input
              {...register("location")}
              type="text"
              placeholder="e.g., Grand Hyatt Ballroom, NY or Zoom Link"
              className={`w-full text-xs rounded-xl border ${
                errors.location ? "border-rose-400" : "border-slate-200"
              } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100`}
            />
            {errors.location && (
              <p className="text-[10px] font-semibold text-rose-500">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Image URL input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">
              Cover Image URL
            </label>
            <input
              {...register("image")}
              type="text"
              placeholder="https://images.unsplash.com/... or similar"
              className={`w-full text-xs rounded-xl border ${
                errors.image ? "border-rose-400" : "border-slate-200"
              } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100`}
            />
            {errors.image && (
              <p className="text-[10px] font-semibold text-rose-500">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Description details */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">
              Detailed Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Provide a breakdown of the schedule, key hosts, and what the members will experience..."
              className={`w-full text-xs rounded-xl border ${
                errors.description ? "border-rose-400" : "border-slate-200"
              } px-3.5 py-2.5 outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 resize-none`}
            />
            {errors.description && (
              <p className="text-[10px] font-semibold text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-indigo-600 transition-all cursor-pointer shadow-md"
            >
              Publish Assembly
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
