'use client';

import { Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Database } from '@/lib/types/database';

type Employee = Database['public']['Tables']['employees']['Row'];
type AttritionPrediction = Database['public']['Tables']['attrition_predictions']['Row'];

interface QuickStatsProps {
  employees: Employee[];
  attritionData: AttritionPrediction[];
}

export default function QuickStats({ employees, attritionData }: QuickStatsProps) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const highRiskEmployees = attritionData.filter(pred => pred.risk_level === 'high' || pred.risk_level === 'critical').length;
  const attritionRate = ((attritionData.filter(pred => pred.prediction).length / totalEmployees) * 100) || 0;

  const stats = [
    {
      name: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      color: 'blue',
      change: '+12%',
      trend: 'up' as const,
    },
    {
      name: 'Active Employees',
      value: activeEmployees,
      icon: TrendingUp,
      color: 'green',
      change: '+5%',
      trend: 'up' as const,
    },
    {
      name: 'High Risk',
      value: highRiskEmployees,
      icon: AlertTriangle,
      color: 'red',
      change: '+3%',
      trend: 'up' as const,
    },
    {
      name: 'Predicted Attrition',
      value: `${attritionRate.toFixed(1)}%`,
      icon: TrendingDown,
      color: 'orange',
      change: '+2%',
      trend: 'down' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'text-blue-600 bg-blue-50',
          green: 'text-green-600 bg-green-50',
          red: 'text-red-600 bg-red-50',
          orange: 'text-orange-600 bg-orange-50',
        }[stat.color];

        return (
          <div key={stat.name} className="bg-white overflow-hidden rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}