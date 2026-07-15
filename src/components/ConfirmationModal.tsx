// src/components/ConfirmationModal.tsx
import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-100 p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer shadow-md shadow-rose-600/10"
          >
            Yes, Cancel Pass
          </button>
        </div>
      </div>
    </div>
  );
}
