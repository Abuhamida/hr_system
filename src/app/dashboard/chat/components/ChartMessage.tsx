'use client';

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
import { ChartData, DashboardData } from '@/lib/types';

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

interface ChartMessageProps {
  data: ChartData | DashboardData;
}

export const ChartMessage: React.FC<ChartMessageProps> = ({ data }) => {
  const renderChart = (chartData: ChartData) => {
    const { chartConfig, title } = chartData;

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

  if ('charts' in data) {
    // This is a DashboardData
    const dashboard = data as DashboardData;
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Dashboard Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">{dashboard.type} Dashboard - {dashboard.focus}</h3>
          <p className="text-gray-600 mt-2">Comprehensive HR Analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dashboard.metrics).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {dashboard.charts.map((chart, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-4">{chart.title}</h4>
              <div className="h-64">
                {renderChart(chart)}
              </div>
              {chart.insights.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-green-700 mb-2">Insights:</h5>
                  <ul className="text-sm text-green-600 space-y-1">
                    {chart.insights.map((insight, idx) => (
                      <li key={idx}>• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {dashboard.recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recommendations:</h4>
            <ul className="space-y-2">
              {dashboard.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-700">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } else {
    // This is a single ChartData
    const chartData = data as ChartData;
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{chartData.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{chartData.description}</p>
        
        <div className="h-64 mb-4">
          {renderChart(chartData)}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {chartData.insights.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-medium text-green-700 mb-2">Insights:</h4>
              <ul className="text-sm text-green-600 space-y-1">
                {chartData.insights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>
          )}

          {chartData.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-700 mb-2">Recommendations:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                {chartData.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
};