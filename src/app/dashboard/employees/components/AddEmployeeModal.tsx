'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

interface AddEmployeeModalProps {
  children: React.ReactNode;
  departments: string[];
  jobRoles: string[];
}

export default function AddEmployeeModal({ children, departments, jobRoles }: AddEmployeeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    department: '',
    education: '',
    education_field: '',
    job_role: '',
    job_level: '',
    job_involvement: '',
    job_satisfaction: '',
    marital_status: '',
    business_travel: '',
    over_time: false,
    monthly_income: '',
    daily_rate: '',
    hourly_rate: '',
    years_at_company: '',
    total_working_years: '',
    performance_rating: '',
    environment_satisfaction: '',
    relationship_satisfaction: '',
    work_life_balance: '',
    distance_from_home: '',
    num_companies_worked: '',
    percent_salary_hike: '',
    training_times_last_year: '',
    years_with_curr_manager: '',
    years_since_last_promotion: '',
    attrition: false,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to appropriate types
      const employeeData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        department: formData.department || null,
        education: formData.education ? parseInt(formData.education) : null,
        education_field: formData.education_field || null,
        job_role: formData.job_role || null,
        job_level: formData.job_level ? parseInt(formData.job_level) : null,
        job_involvement: formData.job_involvement ? parseInt(formData.job_involvement) : null,
        job_satisfaction: formData.job_satisfaction ? parseInt(formData.job_satisfaction) : null,
        marital_status: formData.marital_status || null,
        business_travel: formData.business_travel || null,
        over_time: formData.over_time,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
        daily_rate: formData.daily_rate ? parseFloat(formData.daily_rate) : null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        years_at_company: formData.years_at_company ? parseInt(formData.years_at_company) : null,
        total_working_years: formData.total_working_years ? parseInt(formData.total_working_years) : null,
        performance_rating: formData.performance_rating ? parseInt(formData.performance_rating) : null,
        environment_satisfaction: formData.environment_satisfaction ? parseInt(formData.environment_satisfaction) : null,
        relationship_satisfaction: formData.relationship_satisfaction ? parseInt(formData.relationship_satisfaction) : null,
        work_life_balance: formData.work_life_balance ? parseInt(formData.work_life_balance) : null,
        distance_from_home: formData.distance_from_home ? parseInt(formData.distance_from_home) : null,
        num_companies_worked: formData.num_companies_worked ? parseInt(formData.num_companies_worked) : null,
        percent_salary_hike: formData.percent_salary_hike ? parseInt(formData.percent_salary_hike) : null,
        training_times_last_year: formData.training_times_last_year ? parseInt(formData.training_times_last_year) : null,
        years_with_curr_manager: formData.years_with_curr_manager ? parseInt(formData.years_with_curr_manager) : null,
        years_since_last_promotion: formData.years_since_last_promotion ? parseInt(formData.years_since_last_promotion) : null,
        attrition: formData.attrition,
      };

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) throw error;

      setIsOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      gender: '',
      age: '',
      department: '',
      education: '',
      education_field: '',
      job_role: '',
      job_level: '',
      job_involvement: '',
      job_satisfaction: '',
      marital_status: '',
      business_travel: '',
      over_time: false,
      monthly_income: '',
      daily_rate: '',
      hourly_rate: '',
      years_at_company: '',
      total_working_years: '',
      performance_rating: '',
      environment_satisfaction: '',
      relationship_satisfaction: '',
      work_life_balance: '',
      distance_from_home: '',
      num_companies_worked: '',
      percent_salary_hike: '',
      training_times_last_year: '',
      years_with_curr_manager: '',
      years_since_last_promotion: '',
      attrition: false,
    });
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200/60 bg-white/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                <p className="text-gray-600 mt-1">Fill in the employee details below</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <select
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Job Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Role</label>
                    <select
                      value={formData.job_role}
                      onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Role</option>
                      {jobRoles.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Level</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.job_level}
                      onChange={(e) => setFormData({ ...formData, job_level: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="1-5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Business Travel</label>
                    <select
                      value={formData.business_travel}
                      onChange={(e) => setFormData({ ...formData, business_travel: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Travel</option>
                      <option value="Non-Travel">Non-Travel</option>
                      <option value="Travel_Rarely">Travel Rarely</option>
                      <option value="Travel_Frequently">Travel Frequently</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation & Satisfaction */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-900">Compensation</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.monthly_income}
                        onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.daily_rate}
                          onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Percent Salary Hike</label>
                      <input
                        type="number"
                        value={formData.percent_salary_hike}
                        onChange={(e) => setFormData({ ...formData, percent_salary_hike: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-900">Satisfaction & Ratings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Job Satisfaction</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={formData.job_satisfaction}
                          onChange={(e) => setFormData({ ...formData, job_satisfaction: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="1-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Performance Rating</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={formData.performance_rating}
                          onChange={(e) => setFormData({ ...formData, performance_rating: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="1-4"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Environment</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={formData.environment_satisfaction}
                          onChange={(e) => setFormData({ ...formData, environment_satisfaction: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="1-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Relationship</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={formData.relationship_satisfaction}
                          onChange={(e) => setFormData({ ...formData, relationship_satisfaction: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="1-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Work-Life</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={formData.work_life_balance}
                          onChange={(e) => setFormData({ ...formData, work_life_balance: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="1-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding Employee...
                    </>
                  ) : (
                    'Add Employee'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}