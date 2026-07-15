// src/pages/ManageItems.tsx
import React, { useMemo } from "react";
import {
  Trash2,
  Eye,
  ShieldAlert,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import { EventItem, User } from "../types";
import { useToast } from "../context/ToastContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ManageItemsProps {
  events: EventItem[];
  currentUser: User | null;
  onDeleteEvent: (id: string) => void;
  onViewEvent: (id: string) => void;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export function ManageItems({
  events,
  currentUser,
  onDeleteEvent,
  onViewEvent,
}: ManageItemsProps) {
  const { showToast } = useToast();

  // Authentication check (Requirement 3 & 9)
  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "Administrator")
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-500 rounded-full">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-base font-black text-slate-800">
          Access Unauthorized
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          The requested management dashboard requires elevated Administrative
          privileges. Please switch session to Admin.
        </p>
      </div>
    );
  }

  // 📊 Recharts Data Generation: Calculate seat availability & category distribution
  const chartData = useMemo(() => {
    // 1. Seats Left per Event (Bar Chart Data)
    const barData = events.slice(0, 6).map((e) => ({
      name: e.title.length > 12 ? `${e.title.substring(0, 10)}...` : e.title,
      "Spots Left": e.spotsLeft || 0,
    }));

    // 2. Event Category Distribution (Pie Chart Data)
    const categoryCounts: Record<string, number> = {};
    events.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    const pieData = Object.keys(categoryCounts).map((cat) => ({
      name: cat,
      value: categoryCounts[cat],
    }));

    return { barData, pieData };
  }, [events]);

  const handleDeleteClick = (id: string, title: string) => {
    onDeleteEvent(id);
    showToast(`✕ "${title}" has been permanently purged.`, "info");
  };

  return (
    <div className="space-y-8 text-left py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Manage Assemblies
        </h2>
        <p className="text-xs text-slate-400">
          Total active items cataloged: {events.length}
        </p>
      </div>

      {/* 📊 Requirement 1: Recharts Interactive Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart: Seat Availability */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Seat Availability (Top Events)
            </h3>
          </div>
          <div className="h-60 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.barData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                />
                <Bar
                  dataKey="Spots Left"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Category Distribution
            </h3>
          </div>
          <div className="h-60 w-full text-[10px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section (Requirement 9) */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Active Catalog List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Assembly details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Tariff</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-10 h-10 object-cover rounded-xl border border-slate-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {event.date} · {event.location}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-600">
                    {event.category}
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">
                    {event.price === 0 ? "FREE" : `$${event.price}`}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                        (event.spotsLeft ?? 0) > 0
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {(event.spotsLeft ?? 0) > 0
                        ? `${event.spotsLeft} Open`
                        : "Sold Out"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onViewEvent(event.id)}
                      className="p-2 inline-flex text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event.id, event.title)}
                      className="p-2 inline-flex text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Purge Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
