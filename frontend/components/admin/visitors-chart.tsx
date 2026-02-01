'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visitors: 400, pageViews: 2400 },
  { name: 'Tue', visitors: 300, pageViews: 1398 },
  { name: 'Wed', visitors: 200, pageViews: 9800 },
  { name: 'Thu', visitors: 278, pageViews: 3908 },
  { name: 'Fri', visitors: 189, pageViews: 4800 },
  { name: 'Sat', visitors: 239, pageViews: 1800 },
  { name: 'Sun', visitors: 349, pageViews: 2300 },
];

export function VisitorsChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Visitors</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Bar dataKey="visitors" fill="var(--accent)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="pageViews" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
