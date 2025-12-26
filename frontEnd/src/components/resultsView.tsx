'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Stat } from '@/lib/types';

interface ResultsViewProps {
  stats: Stat[];
}

const COLORS = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
        <p className="font-bold text-gray-900 dark:text-gray-100">{data.label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          votes: <span className="font-mono font-medium">{data.count}</span>
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export function ResultsView({ stats }: ResultsViewProps) {
  // Transform data for Recharts if needed, but our stat shape is mostly fine.
  // We just need to ensure 'value' matches 'percentage' or 'count'.
  const data = stats.map(s => ({
    name: s.label,
    value: s.percentage,
    ...s
  }));

  return (
    <div className="w-full h-[400px] bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        Community Results
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-gray-600 dark:text-gray-300 font-medium ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
