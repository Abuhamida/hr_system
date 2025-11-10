'use client';

import { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { getAttritionPredictions } from '@/lib/supabase/queries';

interface Prediction {
  id: string;
  prediction_date: string;
  attrition_risk_score: number;
  risk_category: string;
  key_factors: any;
  employees: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    job_roles: {
      title: string;
      departments: {
        name: string;
      };
    } | null;
  };
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    async function loadPredictions() {
      try {
        const data = await getAttritionPredictions();

        // Normalize incoming data (HighRiskEmployee) to the Prediction interface
        const normalized: Prediction[] = (data || []).map((item: any) => ({
          id: item.id ?? item.employee_id ?? '',
          prediction_date: item.prediction_date ?? item.created_at ?? new Date().toISOString(),
          attrition_risk_score:
            typeof item.attrition_risk_score === 'number'
              ? item.attrition_risk_score
              : typeof item.risk_score === 'number'
              ? item.risk_score
              : 0,
          risk_category: item.risk_category ?? item.risk_level ?? 'Unknown',
          key_factors: item.key_factors ?? item.keyFactors ?? [],
          employees: {
            id: item.employees?.id ?? item.employee_id ?? item.id ?? '',
            first_name: item.employees?.first_name ?? item.first_name ?? item.fname ?? '',
            last_name: item.employees?.last_name ?? item.last_name ?? item.lname ?? '',
            email: item.employees?.email ?? item.email ?? '',
            job_roles:
              item.employees?.job_roles ??
              (item.job_role
                ? {
                    title: item.job_role,
                    departments: { name: item.department_name ?? 'Unknown' }
                  }
                : null)
          }
        }));

        setPredictions(normalized);
      } catch (error) {
        console.error('Error loading predictions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

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

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = 
      `${prediction.employees.first_name} ${prediction.employees.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.employees.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.employees.job_roles?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || prediction.risk_category.toLowerCase() === riskFilter;
    
    const matchesDepartment = departmentFilter === 'all' || 
      prediction.employees.job_roles?.departments.name.toLowerCase() === departmentFilter;

    return matchesSearch && matchesRisk && matchesDepartment;
  });

  const riskCounts = predictions.reduce((acc, prediction) => {
    acc[prediction.risk_category] = (acc[prediction.risk_category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading predictions...</span>
        </div>
      </div>
    );
  }

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
            count: riskCounts['Critical'] || 0,
            color: 'bg-red-500',
            description: 'Immediate attention required'
          },
          {
            level: 'High',
            count: riskCounts['High'] || 0,
            color: 'bg-orange-500',
            description: 'High intervention priority'
          },
          {
            level: 'Medium',
            count: riskCounts['Medium'] || 0,
            color: 'bg-yellow-500',
            description: 'Monitor closely'
          },
          {
            level: 'Low',
            count: riskCounts['Low'] || 0,
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
                  Last Prediction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPredictions.map((prediction) => (
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
                          {prediction.employees.first_name[0]}{prediction.employees.last_name[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {prediction.employees.first_name} {prediction.employees.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prediction.employees.job_roles?.title || 'No role'} • {prediction.employees.job_roles?.departments.name || 'No department'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getRiskScoreColor(prediction.attrition_risk_score)}`}>
                        {(prediction.attrition_risk_score * 100).toFixed(0)}%
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(prediction.risk_category)}`}>
                        {prediction.risk_category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {prediction.key_factors && Array.isArray(prediction.key_factors) ? (
                        prediction.key_factors.slice(0, 2).map((factor: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {factor}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No factors identified</span>
                      )}
                      {prediction.key_factors && Array.isArray(prediction.key_factors) && prediction.key_factors.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{prediction.key_factors.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(prediction.prediction_date).toLocaleDateString()}
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

        {filteredPredictions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No predictions found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}