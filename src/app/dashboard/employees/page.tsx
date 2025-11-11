'use client';

import { Plus } from "lucide-react";
import EmployeesTable from "./components/EmployeesTable";
import AddEmployeeModal from "./components/AddEmployeeModal";
import type { Employee } from "@/lib/types";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get employees list
        const employeesRes = await fetch("/api/employees");
        const employeesData = await employeesRes.json();
        setEmployees(employeesData.data || employeesData || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Employees data:", employees);

  // Since department and job_role are now text fields in employees table,
  // we can extract unique values for dropdowns if needed
  const uniqueDepartments = employees 
    ? [...new Set(employees.map(emp => emp.department).filter(Boolean) as string[])]
    : [];

  const uniqueJobRoles = employees 
    ? [...new Set(employees.map(emp => emp.job_role).filter(Boolean) as string[])]
    : [];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-2">Manage your workforce</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} in your workforce
          </p>
        </div>
        <AddEmployeeModal
          departments={uniqueDepartments}
          jobRoles={uniqueJobRoles}
        >
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </AddEmployeeModal>
      </div>

      <EmployeesTable
        employees={employees}
        departments={uniqueDepartments}
        jobRoles={uniqueJobRoles}
      />
    </div>
  );
}