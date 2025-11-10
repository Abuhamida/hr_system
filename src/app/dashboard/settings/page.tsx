'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  Shield,
  Database,
  PiIcon,
  Bell,
  CreditCard,
  Users,
  Key,
  Download,
  Upload,
  Save,
  Loader2
} from 'lucide-react';

interface CompanySettings {
  id: string;
  name: string;
  industry: string;
  size_range: string;
  headquarters: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information and preferences',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'company',
    title: 'Company Settings',
    description: 'Configure company-wide settings and information',
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'security',
    title: 'Security & Permissions',
    description: 'Manage user roles, permissions, and security settings',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect with other tools and services',
    icon: Database,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'api',
    title: 'API & Developers',
    description: 'Manage API keys and developer settings',
    icon: PiIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email and in-app notifications',
    icon: Bell,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    industry: '',
    companySize: '',
    headquarters: ''
  });
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user profile
      const { data: profile } = await supabase
        .from('employees')
        .select('first_name, last_name, email')
        .eq('auth_user_id', user.id)
        .single();

      // Load company settings (assuming single company for now)
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .single();

      setUserProfile(
        profile
          ? {
              id: (profile as any).id ?? user.id,
              first_name: profile.first_name ?? '',
              last_name: profile.last_name ?? '',
              email: profile.email ?? user.email ?? ''
            }
          : null
      );
      setCompanySettings(company);

      // Set form data
      if (profile) {
        setFormData(prev => ({
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || user.email || ''
        }));
      }

      if (company) {
        setFormData(prev => ({
          ...prev,
          companyName: company.name || '',
          industry: company.industry || '',
          companySize: company.size_range || '',
          headquarters: company.headquarters || ''
        }));
      }

    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update employee record
      const { error } = await supabase
        .from('employees')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;

      // Update auth email if changed
      if (formData.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (authError) throw authError;
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      // Update company settings
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          industry: formData.industry,
          size_range: formData.companySize,
          headquarters: formData.headquarters,
          updated_at: new Date().toISOString()
        })
        .eq('id', companySettings?.id);

      if (error) throw error;

      alert('Company settings updated successfully!');
    } catch (error) {
      console.error('Error updating company settings:', error);
      alert('Error updating company settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Export employee data
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*');

      if (error) throw error;

      const blob = new Blob([JSON.stringify(employees, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${section.bgColor}`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{section.title}</p>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-700">
                      {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <button className="btn-primary">Change Photo</button>
                    <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'company' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select 
                    value={formData.companySize}
                    onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Size</option>
                    <option value="1-50 employees">1-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="501-1000 employees">501-1000 employees</option>
                    <option value="1000+ employees">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="City, State"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={handleSaveCompany}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Permissions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </button>
                    
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
                      <p className="text-red-700 text-sm mb-3">
                        Permanently delete all company data. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}