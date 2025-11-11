import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
  data: {
    role: string;
    avgIncome: number;
  }[];
}

const AverageIncomeByRoleChart: React.FC<ChartProps> = ({ data }) => {
  // Take top 10 for better readability and sort by income
  const top10Data = data
    .slice(0, 10)
    .sort((a, b) => b.avgIncome - a.avgIncome);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4"
        >
          <p className="font-bold text-gray-900 text-sm mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Average Income: <span className="font-semibold text-gray-900">
                ${payload[0].value.toLocaleString()}
              </span>
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Generate gradient colors based on income levels
  const getBarColor = (value: number, maxValue: number) => {
    const ratio = value / maxValue;
    if (ratio > 0.8) return '#22c55e'; // High income - green
    if (ratio > 0.6) return '#a3e635'; // Medium-high - lime
    if (ratio > 0.4) return '#eab308'; // Medium - yellow
    if (ratio > 0.2) return '#f97316'; // Medium-low - orange
    return '#ef4444'; // Low income - red
  };

  const maxIncome = Math.max(...top10Data.map(item => item.avgIncome));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          layout="vertical" 
          data={top10Data} 
          margin={{ top: 5, right: 10, left: 120, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(100, 116, 139, 0.1)" 
            horizontal={false}
          />
          <XAxis 
            type="number" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            axisLine={false} 
            tickLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis 
            dataKey="role" 
            type="category" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            axisLine={false} 
            tickLine={false}
            tickMargin={8}
            width={115}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }} />
          <Bar 
            dataKey="avgIncome" 
            name="Average Monthly Income" 
            barSize={24}
            radius={[0, 6, 6, 0]}
            animationDuration={1500}
          >
            {top10Data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.avgIncome, maxIncome)}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Income Level Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600 font-medium">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-600 font-medium">Medium-Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600 font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lime-500" />
          <span className="text-xs text-gray-600 font-medium">Medium-High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600 font-medium">High</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AverageIncomeByRoleChart;