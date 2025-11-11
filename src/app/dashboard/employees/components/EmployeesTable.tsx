'use client';

import { useState } from 'react';
import { Eye, Edit, MoreVertical, Search, Filter } from 'lucide-react';
import type { Employee } from '@/lib/types';

interface EmployeesTableProps {
  employees: Employee[];
  departments: string[];
  jobRoles: string[];
}

export default function EmployeesTable({ employees, departments, jobRoles }: EmployeesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [attritionFilter, setAttritionFilter] = useState('all');

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_number?.toString().includes(searchTerm) ||
      employee.job_role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    const matchesAttrition = attritionFilter === 'all' || 
      (attritionFilter === 'active' && !employee.attrition) ||
      (attritionFilter === 'left' && employee.attrition);

    return matchesSearch && matchesDepartment && matchesAttrition;
  });

  const getSatisfactionColor = (rating: number | null) => {
    if (!rating) return 'text-gray-800 bg-gray-100';
    const colors = {
      1: 'text-red-800 bg-red-100',
      2: 'text-orange-800 bg-orange-100',
      3: 'text-yellow-800 bg-yellow-100',
      4: 'text-green-800 bg-green-100',
    };
    return colors[rating as keyof typeof colors] || 'text-gray-800 bg-gray-100';
  };

  const getPerformanceColor = (rating: number | null) => {
    if (!rating) return 'text-gray-800 bg-gray-100';
    const colors = {
      1: 'text-red-800 bg-red-100',
      2: 'text-orange-800 bg-orange-100',
      3: 'text-blue-800 bg-blue-100',
      4: 'text-green-800 bg-green-100',
    };
    return colors[rating as keyof typeof colors] || 'text-gray-800 bg-gray-100';
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, employee number, or job role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary pl-10"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input-primary"
          >
            <option value="all">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            value={attritionFilter}
            onChange={(e) => setAttritionFilter(e.target.value)}
            className="input-primary"
          >
            <option value="all">All Employees</option>
            <option value="active">Active</option>
            <option value="left">Left Company</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department & Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compensation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satisfaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {employee.first_name?.[0]}{employee.last_name?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        #{employee.employee_number}
                      </div>
                      <div className="text-xs text-gray-400">
                        {employee.gender} • {employee.age} years
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {employee.department || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.job_role || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Level {employee.job_level}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(employee.monthly_income)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {employee.years_at_company} yrs at company
                  </div>
                  <div className="text-xs text-gray-500">
                    {employee.total_working_years} total yrs
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Job:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSatisfactionColor(employee.job_satisfaction)}`}>
                        {employee.job_satisfaction || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Env:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSatisfactionColor(employee.environment_satisfaction)}`}>
                        {employee.environment_satisfaction || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Balance:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSatisfactionColor(employee.work_life_balance)}`}>
                        {employee.work_life_balance || 'N/A'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Rating:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(employee.performance_rating)}`}>
                        {employee.performance_rating || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last promo: {employee.years_since_last_promotion || 0}y ago
                    </div>
                    <div className="text-xs text-gray-500">
                      Training: {employee.training_times_last_year || 0} times
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.attrition 
                        ? 'text-red-800 bg-red-100' 
                        : 'text-green-800 bg-green-100'
                    }`}>
                      {employee.attrition ? 'LEFT COMPANY' : 'ACTIVE'}
                    </span>
                    {employee.over_time && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                        OVERTIME
                      </span>
                    )}
                    {employee.business_travel && (
                      <div className="text-xs text-gray-500 capitalize">
                        {employee.business_travel.toLowerCase().replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit Employee"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No employees found</div>
          <div className="text-sm text-gray-400 mt-1">
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Summary */}
      {filteredEmployees.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
            {attritionFilter !== 'all' && (
              <span className="ml-2">
                • {attritionFilter === 'active' ? 'Active' : 'Former'} employees
              </span>
            )}
            {departmentFilter !== 'all' && (
              <span className="ml-2">
                • {departmentFilter} department
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}