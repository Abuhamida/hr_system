// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Briefcase, 
  DollarSign,
  Award,
  TrendingUp,
  Clock,
  GraduationCap,
  Heart,
  Users,
  Edit,
  Save,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Employee } from '@/lib/types';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    department: '',
    job_role: '',
  });

  const supabase = createClient();

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: employeeData } = await supabase
          .from('employees')
          .select('*')
          .eq('id', user.id)
          .single();

        setEmployee(employeeData);
        setFormData({
          first_name: employeeData?.first_name || '',
          last_name: employeeData?.last_name || '',
          phone: employeeData?.phone || '',
          address: employeeData?.address || '',
          department: employeeData?.department || '',
          job_role: employeeData?.job_role || '',
        });
      }
      setLoading(false);
    };

    initializeData();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh employee data
      const { data: employeeData } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single();

      setEmployee(employeeData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: employee?.first_name || '',
      last_name: employee?.last_name || '',
      phone: employee?.phone || '',
      address: employee?.address || '',
      department: employee?.department || '',
      job_role: employee?.job_role || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Employee data not found.</p>
      </div>
    );
  }

  const satisfactionLevels = [
    { label: 'Job Satisfaction', value: employee.job_satisfaction, color: 'text-blue-600 bg-blue-100' },
    { label: 'Environment', value: employee.environment_satisfaction, color: 'text-green-600 bg-green-100' },
    { label: 'Relationship', value: employee.relationship_satisfaction, color: 'text-purple-600 bg-purple-100' },
    { label: 'Work-Life Balance', value: employee.work_life_balance, color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal and professional information</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600">Your basic personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="input-primary"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{employee.first_name || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="input-primary"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{employee.last_name || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-600 capitalize">{employee.gender?.toLowerCase() || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{employee.age || 'Not set'} years</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <p className="text-gray-600 capitalize">{employee.marital_status?.toLowerCase() || 'Not set'}</p>
              </div>
            </div>
          </motion.div>

          {/* Job Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Job Information</h3>
                <p className="text-sm text-gray-600">Your professional details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-primary"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{employee.department || 'Not set'}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Role</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                    className="input-primary"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{employee.job_role || 'Not set'}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Level</label>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">Level {employee.job_level || 'Not set'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employee Number</label>
                <p className="text-gray-600 font-mono">#{employee.employee_number}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Stats & Satisfaction */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Years at Company</p>
                    <p className="text-xl font-bold text-gray-900">{employee.years_at_company || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Performance Rating</p>
                    <p className="text-xl font-bold text-gray-900">{employee.performance_rating || 'N/A'}/4</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="text-xl font-bold text-gray-900">
                      {employee.monthly_income ? `$${employee.monthly_income.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Satisfaction Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Satisfaction Levels</h3>
            </div>
            <div className="space-y-3">
              {satisfactionLevels.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                    {item.value || 'N/A'}/4
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Travel</span>
                <span className="text-gray-900 font-medium capitalize">
                  {employee.business_travel?.toLowerCase().replace('_', ' ') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overtime</span>
                <span className={`font-medium ${employee.over_time ? 'text-green-600' : 'text-gray-600'}`}>
                  {employee.over_time ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training (Last Year)</span>
                <span className="text-gray-900 font-medium">
                  {employee.training_times_last_year || 0} times
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance from Home</span>
                <span className="text-gray-900 font-medium">
                  {employee.distance_from_home || 0} miles
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}