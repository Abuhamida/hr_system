import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
  data: {
    name: string;
    count: number;
  }[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
const LABELS = ['Low', 'Good', 'Excellent', 'Outstanding'];

const PerformanceRatingChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = data.map((entry, index) => ({
    ...entry,
    name: LABELS[index] || entry.name,
    fill: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3"
        >
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{payload[0].value}</span> employees
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="90%">
        <BarChart 
          data={chartData} 
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(100, 116, 139, 0.1)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            axisLine={false} 
            tickLine={false}
            tickMargin={8}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            axisLine={false} 
            tickLine={false}
            tickMargin={8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }} />
          <Bar 
            dataKey="count" 
            name="Employees" 
            barSize={36} 
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 ">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-xs text-gray-600 font-medium">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformanceRatingChart;