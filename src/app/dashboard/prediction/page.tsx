"use client";

import { useState } from "react";
import { InferenceSession, Tensor, env } from "onnxruntime-web";

// important: tell ort where the wasm files are

export default function PredictionPage() {
  const [formData, setFormData] = useState<Record<string, string | number>>({
    Age: 30,
    BusinessTravel: "Travel_Rarely",
    DailyRate: 800,
    Department: "Research & Development",
    DistanceFromHome: 10,
    Education: 3,
    EducationField: "Life Sciences",
    EnvironmentSatisfaction: 3,
    Gender: "Male",
    HourlyRate: 50,
    JobInvolvement: 3,
    JobLevel: 2,
    JobRole: "Research Scientist",
    JobSatisfaction: 3,
    MaritalStatus: "Married",
    MonthlyIncome: 5000,
    MonthlyRate: 15000,
    NumCompaniesWorked: 1,
    OverTime: "No",
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // >>>>>>>>>>>>>> THE REAL PREDICTION FUNCTION <<<<<<<<<<<<<<
  async function runClientPrediction() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Load model
      const session = await InferenceSession.create("/model/model.onnx");

      // Load mappings
      const mappings = await (await fetch("/model/label_encoder_mapping.json")).json();
      const featureNames = await (await fetch("/model/feature_names.json")).json();

      const processed: number[] = [];

      for (const feature of featureNames) {
        let v = formData[feature];

        // categorical encoding
        if (mappings[feature]) {
          const encoded = mappings[feature][v];
          v = encoded !== undefined ? encoded : 0;
        }

        const num = Number(v);
        if (isNaN(num)) throw new Error(`Invalid feature: ${feature}`);
        processed.push(num);
      }

      // Create tensor
      const tensor = new Tensor("float32", Float32Array.from(processed), [
        1,
        processed.length,
      ]);

      const inputName = session.inputNames[0];
      const out = await session.run({ [inputName]: tensor });

      const label = out[session.outputNames[0]];
      const prob = out[session.outputNames[1]];
      const p = prob.data as Float32Array;

      setResult({
        prediction: Number(label.data[0]),
        probabilities: { 0: p[0], 1: p[1] },
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    runClientPrediction();
  };

  // ------ UI BELOW (NO CHANGES) ------
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Attrition Prediction
          </h1>
          <p className="text-gray-600">
            Analyze employee data to predict attrition risk and take proactive measures.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* number fields */}
              {[
                "Age", "DailyRate", "DistanceFromHome", "Education", "EnvironmentSatisfaction",
                "HourlyRate", "JobInvolvement", "JobLevel", "JobSatisfaction", "MonthlyIncome",
                "MonthlyRate", "NumCompaniesWorked", "PercentSalaryHike", "PerformanceRating",
                "RelationshipSatisfaction", "StockOptionLevel", "TotalWorkingYears",
                "TrainingTimesLastYear", "WorkLifeBalance", "YearsAtCompany", "YearsInCurrentRole",
                "YearsSinceLastPromotion", "YearsWithCurrManager"
              ].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700">
                    {f.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="number"
                    name={f}
                    value={formData[f]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}

              {/* categorical fields */}
              {/* BusinessTravel */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Travel</label>
                <select
                  name="BusinessTravel"
                  value={formData.BusinessTravel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Non-Travel">Non-Travel</option>
                  <option value="Travel_Frequently">Travel Frequently</option>
                  <option value="Travel_Rarely">Travel Rarely</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Research & Development">Research & Development</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              {/* EducationField */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Education Field</label>
                <select
                  name="EducationField"
                  value={formData.EducationField}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Life Sciences">Life Sciences</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                  <option value="Technical Degree">Technical Degree</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              {/* JobRole */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Role</label>
                <select
                  name="JobRole"
                  value={formData.JobRole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
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

              {/* MaritalStatus */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select
                  name="MaritalStatus"
                  value={formData.MaritalStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Divorced">Divorced</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
              </div>

              {/* OverTime */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Over Time</label>
                <select
                  name="OverTime"
                  value={formData.OverTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                {loading ? "Predicting..." : "Predict Attrition Risk"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-200 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
