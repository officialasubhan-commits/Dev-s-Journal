"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Search, 
  Mail, 
  BookOpen, 
  Award, 
  ChevronRight, 
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const mockStudents = [
    {
      id: "std-992",
      name: "Jane Doe",
      email: "jane@example.com",
      joined: "2026-06-12",
      enrolledCount: 2,
      certificatesCount: 1,
      lastActive: "Just now",
      progressPercent: 82
    },
    {
      id: "std-993",
      name: "John Smith",
      email: "john@example.com",
      joined: "2026-07-02",
      enrolledCount: 1,
      certificatesCount: 0,
      lastActive: "2 days ago",
      progressPercent: 12
    }
  ];

  const filteredStudents = mockStudents.filter(std => 
    std.name.toLowerCase().includes(search.toLowerCase()) || 
    std.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Monitor student registrations, view course progress curves, and track certification badges.
          </p>
        </div>

        <Button 
          variant="outline"
          className="h-10 px-5 rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
          onClick={() => alert("Exporting student records to CSV spreadsheet...")}
        >
          <FileSpreadsheet className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center bg-[var(--card)] border border-[var(--border-color)]/80 p-3 rounded-xl shadow-sm max-w-sm">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border-color)] pl-9 pr-4 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
          />
        </div>
      </div>

      {/* Students Data Grid Table */}
      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                <th className="p-4">Student Details</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Courses & Badges</th>
                <th className="p-4">Overall Syllabus Progress</th>
                <th className="p-4 text-right">Last Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center italic text-[var(--text-muted)]">No students logged.</td>
                </tr>
              ) : filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-[var(--secondary-bg)]/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center font-bold text-xs text-[var(--primary)] shrink-0">
                        {std.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[var(--text-main)]">{std.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1"><Mail className="w-3 h-3" /> {std.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{std.joined}</td>
                  <td className="p-4 space-y-1 text-[10px] font-semibold text-[var(--text-main)]">
                    <div className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" /> {std.enrolledCount} enrolled</div>
                    <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-green-600" /> {std.certificatesCount} certificates</div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 max-w-[150px]">
                      <div className="flex justify-between text-[9px] font-bold text-[var(--text-main)]">
                        <span>Progress</span>
                        <span>{std.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1 bg-[var(--secondary-bg)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--primary)] rounded-full" 
                          style={{ width: `${std.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">{std.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
