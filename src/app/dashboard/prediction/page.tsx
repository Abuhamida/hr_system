'use client';

import { useState } from 'react';

export default function PredictionPage() {
  const [formData, setFormData] = useState<Record<string, string | number>>({
    Age: 30,
    BusinessTravel: 'Travel_Rarely',
    DailyRate: 800,
    Department: 'Research & Development',
    DistanceFromHome: 10,
    Education: 3,
    EducationField: 'Life Sciences',
    EnvironmentSatisfaction: 3,
    Gender: 'Male',
    HourlyRate: 50,
    JobInvolvement: 3,
    JobLevel: 2,
    JobRole: 'Research Scientist',
    JobSatisfaction: 3,
    MaritalStatus: 'Married',
    MonthlyIncome: 5000,
    MonthlyRate: 15000,
    NumCompaniesWorked: 1,
    OverTime: 'No',
    PercentSalaryHike: 15,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 1,
    TotalWorkingYears: 10,
    TrainingTimesLastYear: 3,
    WorkLifeBalance: 3,
    YearsAtCompany: 5,
    YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 3,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Attrition Prediction
          </h1>
          <p className="text-gray-600">
            Analyze employee data to predict attrition risk and take proactive measures
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Numerical Fields */}
              {[
                'Age', 'DailyRate', 'DistanceFromHome', 'Education', 'EnvironmentSatisfaction',
                'HourlyRate', 'JobInvolvement', 'JobLevel', 'JobSatisfaction', 'MonthlyIncome',
                'MonthlyRate', 'NumCompaniesWorked', 'PercentSalaryHike', 'PerformanceRating',
                'RelationshipSatisfaction', 'StockOptionLevel', 'TotalWorkingYears',
                'TrainingTimesLastYear', 'WorkLifeBalance', 'YearsAtCompany', 'YearsInCurrentRole',
                'YearsSinceLastPromotion', 'YearsWithCurrManager'
              ].map(field => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              ))}

              {/* Categorical Fields */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Travel
                </label>
                <select 
                  name="BusinessTravel" 
                  value={formData.BusinessTravel} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Non-Travel">Non-Travel</option>
                  <option value="Travel_Frequently">Travel Frequently</option>
                  <option value="Travel_Rarely">Travel Rarely</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select 
                  name="Department" 
                  value={formData.Department} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Research & Development">Research & Development</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Education Field
                </label>
                <select 
                  name="EducationField" 
                  value={formData.EducationField} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Life Sciences">Life Sciences</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                  <option value="Technical Degree">Technical Degree</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select 
                  name="Gender" 
                  value={formData.Gender} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Role
                </label>
                <select 
                  name="JobRole" 
                  value={formData.JobRole} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Healthcare Representative">Healthcare Representative</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Laboratory Technician">Laboratory Technician</option>
                  <option value="Manager">Manager</option>
                  <option value="Manufacturing Director">Manufacturing Director</option>
                  <option value="Research Director">Research Director</option>
                  <option value="Research Scientist">Research Scientist</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Sales Representative">Sales Representative</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select 
                  name="MaritalStatus" 
                  value={formData.MaritalStatus} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Divorced">Divorced</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Over Time
                </label>
                <select 
                  name="OverTime" 
                  value={formData.OverTime} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Predicting...
                  </div>
                ) : (
                  'Predict Attrition Risk'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">Prediction Result</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-lg font-medium text-gray-900">Prediction:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.prediction === 1 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {result.prediction === 1 ? 'High Risk (Yes)' : 'Low Risk (No)'}
                </span>
              </div>

              {/* <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Probabilities</h3>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(result.probabilities, null, 2)}
                  </pre>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}