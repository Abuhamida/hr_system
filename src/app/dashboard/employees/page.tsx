import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import EmployeesTable from "./components/EmployeesTable";
import AddEmployeeModal from "./components/AddEmployeeModal";

export default async function EmployeesPage() {
  const supabase = await createClient();

  const { data: employees, error } = await supabase
    .from("employees")
    .select(
      `
    *,
    departments!employees_department_id_fkey(name),
    job_roles(title)
  `
    )
    .order("created_at", { ascending: false });

  const { data: departments } = await supabase.from("departments").select("*");

  const { data: jobRoles } = await supabase.from("job_roles").select("*");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">Manage your workforce</p>
        </div>
        <AddEmployeeModal
          departments={departments || []}
          jobRoles={jobRoles || []}
        >
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </AddEmployeeModal>
      </div>

      <EmployeesTable
        employees={employees || []}
        departments={departments || []}
        jobRoles={jobRoles || []}
      />
    </div>
  );
}
