import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
  data: {
    name: string;
    'Total': number;
    'Attrition': number;
  }[];
}

const AttritionByDeptChart: React.FC<ChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0]?.payload?.Total || 0;
      const attrition = payload[0]?.value || 0;
      const attritionRate = total > 0 ? ((attrition / total) * 100).toFixed(1) : 0;

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4"
        >
          <p className="font-bold text-gray-900 text-sm mb-3">{label} Department</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Total Employees:</span>
              <span className="font-semibold text-gray-900">{total}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Attrition Count:</span>
              <span className="font-semibold text-red-600">{attrition}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Attrition Rate:</span>
              <span className="font-semibold text-red-600">{attritionRate}%</span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-md"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-semibold text-gray-700">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Calculate attrition rates for dynamic coloring
  const chartData = data.map(dept => ({
    ...dept,
    attritionRate: dept.Total > 0 ? (dept.Attrition / dept.Total) * 100 : 0
  }));

  const getBarColor = (attritionRate: number) => {
    if (attritionRate > 20) return '#dc2626'; // Critical - dark red
    if (attritionRate > 15) return '#ef4444'; // High - red
    if (attritionRate > 10) return '#f97316'; // Medium - orange
    if (attritionRate > 5) return '#eab308';  // Moderate - yellow
    return '#22c55e'; // Low - green
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[350px]"
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
          <Legend content={<CustomLegend />} />
          <Bar 
            dataKey="Attrition" 
            name="Employees Leaving" 
            radius={[6, 6, 0, 0]}
            barSize={32}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.attritionRate)}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Attrition Rate Legend */}
      <div className="flex justify-center gap-4 mt-6">
        {[
          { label: 'Low (<5%)', color: '#22c55e' },
          { label: 'Moderate (5-10%)', color: '#eab308' },
          { label: 'Medium (10-15%)', color: '#f97316' },
          { label: 'High (15-20%)', color: '#ef4444' },
          { label: 'Critical (>20%)', color: '#dc2626' }
        ].map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-semibold text-gray-700">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AttritionByDeptChart;