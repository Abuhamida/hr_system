'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Database } from '@/lib/types/database';

type AttritionPrediction = Database['public']['Tables']['attrition_predictions']['Row'];

interface AttritionRiskChartProps {
  data: AttritionPrediction[];
}

export default function AttritionRiskChart({ data }: AttritionRiskChartProps) {
  // Process data for chart
  const riskData = data.reduce((acc, prediction) => {
    const riskLevel = prediction.risk_level;
    if (typeof riskLevel === 'string') {
      if (!acc[riskLevel]) {
        acc[riskLevel] = 0;
      }
      acc[riskLevel]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Low', count: riskData.low || 0, fill: '#10B981' },
    { name: 'Medium', count: riskData.medium || 0, fill: '#F59E0B' },
    { name: 'High', count: riskData.high || 0, fill: '#EF4444' },
    { name: 'Critical', count: riskData.critical || 0, fill: '#7C2D12' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attrition Risk Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Number of Employees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}