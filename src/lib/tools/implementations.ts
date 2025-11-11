import type { Employee } from "@/lib/types";

// Utility function for safe string comparison
const safeStringCompare = (value: string | null, target: string): boolean => {
  if (!value) return false;
  return value.toLowerCase() === target.toLowerCase();
};

// Utility function for safe number comparison
const safeNumberCompare = (value: number | null, target: number): boolean => {
  if (value === null || value === undefined) return false;
  return value === target;
};

// Employee Query Implementations
export const getEmployeeDetails = (employees: Employee[], employeeNumber: number) => {
  return employees.find((e) => e.employee_number === employeeNumber);
};

export const searchEmployeesByDepartment = (employees: Employee[], department: string) => {
  return employees
    .filter((e) => safeStringCompare(e.department, department))
    .map((e) => e.employee_number);
};

export const searchEmployeesByJobRole = (employees: Employee[], jobRole: string) => {
  return employees
    .filter((e) => safeStringCompare(e.job_role, jobRole))
    .map((e) => e.employee_number);
};

export const getEmployeesByTrainingCount = (
  employees: Employee[], 
  trainingCount: number, 
  operator: "exact" | "min" | "max" = "exact"
) => {
  return employees
    .filter((e) => {
      const trainingTimes = e.training_times_last_year || 0;
      switch (operator) {
        case "exact":
          return safeNumberCompare(trainingTimes, trainingCount);
        case "min":
          return trainingTimes >= trainingCount;
        case "max":
          return trainingTimes <= trainingCount;
        default:
          return safeNumberCompare(trainingTimes, trainingCount);
      }
    })
    .map((e) => e.employee_number);
};

// Analytics Implementations
export const getAttritionEmployees = (employees: Employee[]) => {
  return employees
    .filter((e) => e.attrition === true)
    .map((e) => e.employee_number);
};

export const getHighPerformers = (employees: Employee[], minRating: number) => {
  return employees
    .filter((e) => (e.performance_rating || 0) >= minRating)
    .map((e) => e.employee_number);
};

export const rankEmployees = (
  employees: Employee[],
  criteria: keyof Employee,
  order: "asc" | "desc" = "desc",
  limit: number = 5
) => {
  // Filter out employees with null values for the criteria
  const validEmployees = employees.filter((e) => {
    const value = e[criteria];
    return value !== null && value !== undefined;
  });

  const sorted = [...validEmployees].sort((a, b) => {
    const valA = a[criteria];
    const valB = b[criteria];

    if (valA === null || valB === null) return 0;

    if (typeof valA === "number" && typeof valB === "number") {
      return order === "asc" ? valA - valB : valB - valA;
    }
    if (typeof valA === "string" && typeof valB === "string") {
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  return sorted.slice(0, limit).map((e) => ({
    employee_number: e.employee_number,
    [criteria]: e[criteria],
    name: `${e.first_name} ${e.last_name}`,
  }));
};

// HR Recommendation Implementations
export const suggestActionForEmployee = (employees: Employee[], employeeNumber: number) => {
  const employee = getEmployeeDetails(employees, employeeNumber);
  if (!employee) {
    return `Employee #${employeeNumber} not found.`;
  }

  const suggestions: string[] = [];

  // Promotion/Raise Analysis
  if ((employee.performance_rating || 0) === 4 && (employee.years_since_last_promotion || 0) > 2) {
    suggestions.push(
      `High performer with no promotion in over 2 years. Consider promotion or salary review.`
    );
  }

  // Attrition Risk Analysis
  if ((employee.job_satisfaction || 0) <= 2 && employee.over_time) {
    suggestions.push(
      `Low job satisfaction (Level ${employee.job_satisfaction}) with overtime. At risk of attrition - recommend check-in meeting.`
    );
  }

  // Development Analysis
  if ((employee.training_times_last_year || 0) < 2) {
    suggestions.push(
      `Limited training (${employee.training_times_last_year} sessions) in past year. Suggest skill development opportunities.`
    );
  }

  // Work-life balance concern
  if ((employee.work_life_balance || 0) <= 2 && employee.business_travel === "Frequently") {
    suggestions.push(
      `Poor work-life balance (Level ${employee.work_life_balance}) with frequent travel. Review travel schedule and workload.`
    );
  }

  // High performer with low satisfaction
  if ((employee.performance_rating || 0) >= 4 && (employee.environment_satisfaction || 0) <= 2) {
    suggestions.push(
      `High performer with low environment satisfaction (Level ${employee.environment_satisfaction}). Investigate workplace environment issues.`
    );
  }

  if (suggestions.length === 0) {
    return `Employee #${employeeNumber} (${employee.first_name} ${employee.last_name}) appears stable. Key metrics: Performance Rating: ${employee.performance_rating || 'N/A'}, Job Satisfaction: ${employee.job_satisfaction || 'N/A'}, Years Since Last Promotion: ${employee.years_since_last_promotion || 'N/A'}.`;
  }

  return `Recommendations for ${employee.first_name} ${employee.last_name} (#${employee.employee_number}):\n- ${suggestions.join("\n- ")}`;
};

export const identifyAtRiskEmployees = (
  employees: Employee[], 
  maxJobSatisfaction: number = 2, 
  includeOvertime: boolean = true
) => {
  return employees
    .filter((e) => {
      const jobSatisfaction = e.job_satisfaction || 0;
      const lowSatisfaction = jobSatisfaction <= maxJobSatisfaction;
      const overtimeRisk = includeOvertime ? e.over_time : true;
      return lowSatisfaction && overtimeRisk;
    })
    .map((e) => e.employee_number);
};

// Department Analysis Implementations
export const getDepartmentStats = (employees: Employee[], department: string) => {
  const deptEmployees = employees.filter((e) => 
    safeStringCompare(e.department, department)
  );
  
  if (deptEmployees.length === 0) {
    return { 
      error: `Department '${department}' not found or has no employees.`,
      department 
    };
  }

  const validSatisfactionEmployees = deptEmployees.filter(e => e.job_satisfaction !== null);
  const validIncomeEmployees = deptEmployees.filter(e => e.monthly_income !== null);

  const satisfactionSum = validSatisfactionEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0);
  const incomeSum = validIncomeEmployees.reduce((sum, e) => sum + (e.monthly_income || 0), 0);
  const attritionCount = deptEmployees.filter((e) => e.attrition).length;

  return {
    department,
    employee_count: deptEmployees.length,
    avg_job_satisfaction: validSatisfactionEmployees.length > 0 
      ? Math.round((satisfactionSum / validSatisfactionEmployees.length) * 100) / 100 
      : 0,
    avg_monthly_income: validIncomeEmployees.length > 0 
      ? Math.round(incomeSum / validIncomeEmployees.length) 
      : 0,
    attrition_rate: Math.round((attritionCount / deptEmployees.length) * 100),
    attrition_count: attritionCount,
  };
};


// Promotion Analysis Implementations
export const getRecentlyPromotedEmployees = (employees: Employee[], years: number) => {
  return employees
    .filter((e) => {
      const yearsSincePromotion = e.years_since_last_promotion || 0;
      // If years_since_last_promotion is 0 or 1, they were promoted recently
      return yearsSincePromotion <= years && yearsSincePromotion >= 0;
    })
    .map((e) => ({
      employee_number: e.employee_number,
      name: `${e.first_name} ${e.last_name}`,
      department: e.department,
      job_role: e.job_role,
      years_since_last_promotion: e.years_since_last_promotion,
      performance_rating: e.performance_rating,
    }));
};

export const getEmployeesEligibleForPromotion = (
  employees: Employee[], 
  minPerformanceRating: number,
  maxYearsSincePromotion: number
) => {
  return employees
    .filter((e) => {
      const performance = e.performance_rating || 0;
      const yearsSincePromo = e.years_since_last_promotion || 0;
      
      return performance >= minPerformanceRating && 
             yearsSincePromo >= maxYearsSincePromotion;
    })
    .map((e) => ({
      employee_number: e.employee_number,
      name: `${e.first_name} ${e.last_name}`,
      department: e.department,
      job_role: e.job_role,
      performance_rating: e.performance_rating,
      years_since_last_promotion: e.years_since_last_promotion,
      current_job_level: e.job_level,
    }));
};

export const getPromotionAnalytics = (employees: Employee[], department?: string) => {
  const filteredEmployees = department 
    ? employees.filter(e => safeStringCompare(e.department, department))
    : employees;

  const totalEmployees = filteredEmployees.length;
  const promotedLastYear = filteredEmployees.filter(e => (e.years_since_last_promotion || 0) <= 1).length;
  const eligibleForPromotion = filteredEmployees.filter(e => {
    const performance = e.performance_rating || 0;
    const yearsSincePromo = e.years_since_last_promotion || 0;
    return performance >= 3 && yearsSincePromo >= 2;
  }).length;

  // Department-wise promotion rates
  const departmentPromotionRates = employees.reduce((acc, e) => {
    const dept = e.department || 'Unknown';
    if (!acc[dept]) {
      acc[dept] = { total: 0, promoted: 0 };
    }
    acc[dept].total++;
    if ((e.years_since_last_promotion || 0) <= 1) {
      acc[dept].promoted++;
    }
    return acc;
  }, {} as Record<string, { total: number; promoted: number }>);

  const departmentRates = Object.entries(departmentPromotionRates).map(([dept, stats]) => ({
    department: dept,
    promotion_rate: Math.round((stats.promoted / stats.total) * 100),
    total_employees: stats.total,
    promoted_count: stats.promoted,
  }));

  return {
    scope: department ? `Department: ${department}` : 'Company-wide',
    total_employees: totalEmployees,
    promoted_last_year: promotedLastYear,
    promotion_rate: Math.round((promotedLastYear / totalEmployees) * 100),
    eligible_for_promotion: eligibleForPromotion,
    department_breakdown: departmentRates,
  };
};