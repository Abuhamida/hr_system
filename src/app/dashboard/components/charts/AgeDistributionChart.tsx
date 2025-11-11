import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
  data: {
    name: string;
    count: number;
  }[];
}

const AgeDistributionChart: React.FC<ChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4"
        >
          <p className="font-bold text-gray-900 text-sm mb-2">Age Group: {label}</p>
          <p className="text-lg font-semibold text-gray-800">
            {payload[0].value} <span className="text-sm font-normal text-gray-600">employees</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  // Generate gradient colors based on age groups
  const getBarColor = (index: number, total: number) => {
    const colors = [
      '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(100, 116, 139, 0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
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
            radius={[6, 6, 0, 0]}
            barSize={36}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(index, data.length)}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Age Distribution Info */}
      <div className="flex justify-center mt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-sm text-blue-800 font-medium text-center">
            Total Employees: {data.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AgeDistributionChart;