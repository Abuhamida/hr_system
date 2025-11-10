'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Filter,
  Download,
  Search,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
} from 'lucide-react';

const predictions = [
  {
    id: 1,
    name: 'Mike Rodriguez',
    role: 'Product Manager',
    department: 'Product',
    riskScore: 0.87,
    riskLevel: 'Critical',
    keyFactors: ['Low satisfaction', 'No promotion in 2 years', 'High workload'],
    lastReview: '2 days ago',
    predictedDate: '2024-02-15'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Senior Developer',
    department: 'Engineering',
    riskScore: 0.72,
    riskLevel: 'High',
    keyFactors: ['Market demand', 'Competitive offers', 'Moderate satisfaction'],
    lastReview: '1 week ago',
    predictedDate: '2024-03-01'
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'UX Designer',
    department: 'Design',
    riskScore: 0.65,
    riskLevel: 'High',
    keyFactors: ['Skill mismatch', 'Career growth concerns'],
    lastReview: '3 days ago',
    predictedDate: '2024-02-28'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Data Scientist',
    department: 'Engineering',
    riskScore: 0.45,
    riskLevel: 'Medium',
    keyFactors: ['Moderate workload', 'Good satisfaction'],
    lastReview: '2 weeks ago',
    predictedDate: '2024-04-15'
  },
];

export default function PredictionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attrition Predictions</h1>
          <p className="text-gray-600">AI-powered risk assessment and early warnings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            level: 'Critical',
            count: '12',
            color: 'bg-red-500',
            description: 'Immediate attention required'
          },
          {
            level: 'High',
            count: '23',
            color: 'bg-orange-500',
            description: 'High intervention priority'
          },
          {
            level: 'Medium',
            count: '45',
            color: 'bg-yellow-500',
            description: 'Monitor closely'
          },
          {
            level: 'Low',
            count: '156',
            color: 'bg-green-500',
            description: 'Stable situation'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.level} Risk</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.count}</p>
                <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
              </div>
              <div className={`w-12 h-12 ${metric.color} rounded-full flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Risk Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="design">Design</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Predictions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Factors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Predicted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction) => (
                <motion.tr
                  key={prediction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary-700">
                          {prediction.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {prediction.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prediction.role} • {prediction.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getRiskScoreColor(prediction.riskScore)}`}>
                        {(prediction.riskScore * 100).toFixed(0)}%
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {prediction.keyFactors.slice(0, 2).map((factor, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                      {prediction.keyFactors.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{prediction.keyFactors.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.lastReview}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(prediction.predictedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Intervene
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Interventions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Career Development Plans',
              description: 'Create personalized growth paths for high-risk employees',
              count: '8 employees',
              priority: 'High'
            },
            {
              title: 'Manager Training',
              description: 'Train managers on retention strategies and team engagement',
              count: '5 teams',
              priority: 'Medium'
            },
            {
              title: 'Compensation Review',
              description: 'Review and adjust compensation for key roles',
              count: '12 employees',
              priority: 'High'
            }
          ].map((intervention, index) => (
            <div key={intervention.title} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">{intervention.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{intervention.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{intervention.count}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  intervention.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {intervention.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}