import type { Employee, FunctionCall } from "@/lib/types";
import * as implementations from "./implementations";

export const executeTool = (call: FunctionCall, employees: Employee[]) => {
  const { name, args } = call;

  // Validate employees array
  if (!employees || !Array.isArray(employees) || employees.length === 0) {
    return { error: "No employee data available" };
  }

  try {
    switch (name) {
      // Employee Query Tools
      case "get_employee_details":
        if (typeof args.employee_number !== "number") {
          return { error: "Missing or invalid employee_number" };
        }
        const employee = implementations.getEmployeeDetails(
          employees,
          args.employee_number
        );
        return (
          employee || { error: `Employee #${args.employee_number} not found` }
        );

      case "search_employees_by_department":
        if (typeof args.department !== "string") {
          return { error: "Missing or invalid department" };
        }
        return implementations.searchEmployeesByDepartment(
          employees,
          args.department
        );

      case "search_employees_by_job_role":
        if (typeof args.job_role !== "string") {
          return { error: "Missing or invalid job_role" };
        }
        return implementations.searchEmployeesByJobRole(
          employees,
          args.job_role
        );

      case "get_employees_by_training_count":
        if (typeof args.training_count !== "number") {
          return { error: "Missing or invalid training_count" };
        }
        const operator =
          args.operator === "min" || args.operator === "max"
            ? args.operator
            : "exact";
        return implementations.getEmployeesByTrainingCount(
          employees,
          args.training_count,
          operator
        );

      // Analytics Tools
      case "get_attrition_employees":
        return implementations.getAttritionEmployees(employees);

      case "get_high_performers":
        if (typeof args.min_rating !== "number") {
          return { error: "Missing or invalid min_rating" };
        }
        if (args.min_rating < 1 || args.min_rating > 4) {
          return { error: "min_rating must be between 1 and 4" };
        }
        return implementations.getHighPerformers(employees, args.min_rating);

      case "rank_employees":
        if (typeof args.criteria !== "string") {
          return { error: "Missing or invalid criteria" };
        }
        const validCriteria = [
          "performance_rating",
          "monthly_income",
          "job_satisfaction",
          "years_at_company",
          "total_working_years",
          "training_times_last_year",
          "years_since_last_promotion",
        ];
        if (!validCriteria.includes(args.criteria)) {
          return {
            error: `Invalid criteria. Must be one of: ${validCriteria.join(
              ", "
            )}`,
          };
        }
        const order = args.order === "asc" ? "asc" : "desc";
        const limit =
          typeof args.limit === "number" ? Math.min(args.limit, 20) : 5; // Cap at 20
        return implementations.rankEmployees(
          employees,
          args.criteria as keyof Employee,
          order,
          limit
        );

      // HR Recommendation Tools
      case "suggest_action_for_employee":
        if (typeof args.employee_number !== "number") {
          return { error: "Missing or invalid employee_number" };
        }
        return implementations.suggestActionForEmployee(
          employees,
          args.employee_number
        );

      case "identify_at_risk_employees":
        const maxSatisfaction =
          typeof args.max_job_satisfaction === "number"
            ? Math.max(1, Math.min(4, args.max_job_satisfaction))
            : 2;
        const includeOvertime =
          typeof args.include_overtime === "boolean"
            ? args.include_overtime
            : true;
        return implementations.identifyAtRiskEmployees(
          employees,
          maxSatisfaction,
          includeOvertime
        );

      // Department Analysis Tools
      case "get_department_stats":
        if (typeof args.department !== "string") {
          return { error: "Missing or invalid department" };
        }
        return implementations.getDepartmentStats(employees, args.department);

      // Promotion Analysis Tools
      case "get_recently_promoted_employees":
        if (typeof args.years !== "number") {
          return { error: "Missing or invalid years parameter" };
        }
        return implementations.getRecentlyPromotedEmployees(
          employees,
          args.years
        );

      case "get_employees_eligible_for_promotion":
        if (
          typeof args.min_performance_rating !== "number" ||
          typeof args.max_years_since_promotion !== "number"
        ) {
          return { error: "Missing or invalid parameters" };
        }
        return implementations.getEmployeesEligibleForPromotion(
          employees,
          args.min_performance_rating,
          args.max_years_since_promotion
        );

      case "get_promotion_analytics":
        const department =
          typeof args.department === "string" ? args.department : undefined;
        return implementations.getPromotionAnalytics(employees, department);

      default:
        return { error: `Function ${name} not found.` };
    }
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return {
      error: `Failed to execute ${name}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
