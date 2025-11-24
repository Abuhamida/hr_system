import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Radar, Doughnut } from 'react-chartjs-2';
import { ChartResponse } from '@/lib/types/chart';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartRendererProps {
  chartData: ChartResponse;
  className?: string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  chartData, 
  className = "w-full h-96" 
}) => {
  const { chartConfig, title, description, insights, recommendations } = chartData;

  const renderChart = () => {
    switch (chartConfig.type) {
      case 'bar':
        return <Bar data={chartConfig.data} options={chartConfig.options} />;
      case 'line':
        return <Line data={chartConfig.data} options={chartConfig.options} />;
      case 'pie':
        return <Pie data={chartConfig.data} options={chartConfig.options} />;
      case 'radar':
        return <Radar data={chartConfig.data} options={chartConfig.options} />;
      case 'doughnut':
        return <Doughnut data={chartConfig.data} options={chartConfig.options} />;
      default:
        return <Bar data={chartConfig.data} options={chartConfig.options} />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>

      <div className="mb-6">
        {renderChart()}
      </div>

      {(insights.length > 0 || recommendations.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {insights.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">💡</span> Key Insights
              </h4>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start">
                    <span className="mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="mr-2">🎯</span> Recommendations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};