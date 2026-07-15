"use client";

import { useState } from "react";
import { mockOrders } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Search, 
  DollarSign, 
  Percent, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter(ord => {
    const q = search.toLowerCase();
    const matchesSearch = 
      ord.id.toLowerCase().includes(q) || 
      ord.courseTitle.toLowerCase().includes(q);
    
    const matchesStatus = statusFilter === "All" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
          Sales & Order Ledger
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Monitor incoming customer payments, coupon usage rates, and enrollment completion stats.
        </p>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Gross Receipts", value: "$78.00", desc: "Month to date revenue" },
          { label: "Completed Enrollments", value: orders.length, desc: "Successful transactions" },
          { label: "Active Promos Used", value: "32 times", desc: "Coupon logs (WELCOME20)" }
        ].map((w, idx) => (
          <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 p-4 rounded-2xl shadow-sm space-y-1">
            <span className="text-xl md:text-2xl font-black text-[var(--text-main)] font-heading">{w.value}</span>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{w.label}</p>
            <p className="text-[9px] text-[var(--text-muted)] font-normal">{w.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-[var(--card)] border border-[var(--border-color)]/80 p-3 rounded-xl shadow-sm">
        <div className="w-full sm:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by receipt or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border-color)] pl-9 pr-4 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Status:</span>
          {["All", "Completed", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${statusFilter === status ? "bg-[var(--primary)] border-[var(--primary)]/10 text-white" : "border-[var(--border-color)] bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-main)]"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid Table */}
      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                <th className="p-4">Receipt ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Course Description</th>
                <th className="p-4">Date</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center italic text-[var(--text-muted)]">No orders logged matching selection filters.</td>
                </tr>
              ) : filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[var(--secondary-bg)]/10 transition-colors">
                  <td className="p-4 font-mono font-bold text-[var(--text-main)]">{ord.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-[var(--text-main)]">Jane Doe</div>
                    <div className="text-[10px] text-[var(--text-muted)]">jane@example.com</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-[var(--text-main)]">{ord.courseTitle}</div>
                    {ord.couponUsed && (
                      <div className="text-[10px] text-green-600 font-medium flex items-center gap-0.5 mt-0.5">
                        <Percent className="w-3 h-3" /> Coupon: {ord.couponUsed}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{ord.date}</td>
                  <td className="p-4 font-bold text-[var(--text-main)]">${ord.price}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-green-100 text-green-700">
                      {ord.status}
                    </span>
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
