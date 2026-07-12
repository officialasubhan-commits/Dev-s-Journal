"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Data is now passed as a prop

export function VisitorsChart({ data }: { data: { name: string, visitors: number }[] }) {
  const hasData = data && data.some(d => d.visitors > 0);

  if (!hasData) {
    return (
      <div className="h-[300px] w-full mt-4 flex items-center justify-center border-dashed border-2 rounded-xl border-[var(--border-color)]">
        <p className="text-[var(--text-muted)] text-sm">No analytics data available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'var(--text-main)'
            }}
            itemStyle={{ color: 'var(--primary)' }}
          />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorVisitors)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
