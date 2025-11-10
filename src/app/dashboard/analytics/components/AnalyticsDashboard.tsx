'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database } from '@/lib/types/database';

type Employee = Database['public']['Tables']['employees']['Row'];
type AttritionPrediction = Database['public']['Tables']['attrition_predictions']['Row'];
type Department = Database['public']['Tables']['departments']['Row'];

interface AnalyticsDashboardProps {
  employees: Employee[];
  attritionData: AttritionPrediction[];
  departments: Department[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard({ employees, attritionData, departments }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d');

  // Department distribution
  const departmentData = departments.map(dept => {
    const count = employees.filter(emp => emp.department_id === dept.id).length;
    return {
      name: dept.name,
      value: count,
    };
  });

  // Status distribution
  const statusData = Object.entries(
    employees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  // Attrition risk by department
  const attritionByDepartment = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
    const highRisk = attritionData.filter(pred => 
      deptEmployees.some(emp => emp.id === pred.employee_id && (pred.risk_level === 'high' || pred.risk_level === 'critical'))
    ).length;
    
    return {
      department: dept.name,
      highRisk,
      total: deptEmployees.length,
      riskPercentage: deptEmployees.length > 0 ? (highRisk / deptEmployees.length) * 100 : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Employees" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition Risk by Department */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attrition Risk by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attritionByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="highRisk" name="High Risk Employees" fill="#EF4444" />
                <Bar dataKey="total" name="Total Employees" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}