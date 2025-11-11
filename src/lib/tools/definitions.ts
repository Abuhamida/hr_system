import { Type } from "@google/genai";

export const toolDefinitions = [
  {
    functionDeclarations: [
      // Employee Query Tools
      {
        name: "get_employee_details",
        description:
          "Get the full details for a specific employee by their employee number.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            employee_number: {
              type: Type.INTEGER,
              description: "The unique employee number.",
            },
          },
          required: ["employee_number"],
        },
      },
      {
        name: "search_employees_by_department",
        description: "Get employees filtered by department.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            department: {
              type: Type.STRING,
              description: "The department to filter by.",
            },
          },
          required: ["department"],
        },
      },
      {
        name: "search_employees_by_job_role",
        description: "Get employees filtered by job role.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            job_role: {
              type: Type.STRING,
              description: "The job role to filter by.",
            },
          },
          required: ["job_role"],
        },
      },

      {
        name: "get_recently_promoted_employees",
        description: "Get employees who were promoted within the last X years.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            years: {
              type: Type.INTEGER,
              description:
                "Number of years to look back for promotions (e.g., 1 for last year).",
            },
          },
          required: ["years"],
        },
      },
      {
        name: "get_employees_eligible_for_promotion",
        description:
          "Get employees who are eligible for promotion based on performance and time since last promotion.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            min_performance_rating: {
              type: Type.INTEGER,
              description: "Minimum performance rating required (1-4).",
            },
            max_years_since_promotion: {
              type: Type.INTEGER,
              description:
                "Maximum years since last promotion to be considered eligible.",
            },
          },
          required: ["min_performance_rating", "max_years_since_promotion"],
        },
      },
      {
        name: "get_promotion_analytics",
        description:
          "Get analytics about promotions across departments and job levels.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            department: {
              type: Type.STRING,
              description: "Specific department to analyze (optional).",
            },
          },
        },
      },

      {
        name: "get_employees_by_training_count",
        description:
          "Get employees who attended a specific number of training sessions.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            training_count: {
              type: Type.INTEGER,
              description: "The number of training sessions attended.",
            },
            operator: {
              type: Type.STRING,
              description: "Comparison operator: 'exact', 'min', or 'max'.",
              enum: ["exact", "min", "max"],
            },
          },
          required: ["training_count"],
        },
      },

      // Analytics Tools
      {
        name: "get_attrition_employees",
        description:
          "Get a list of all employees who have left the company (attrition is true).",
      },
      {
        name: "get_high_performers",
        description: "Get employees with high performance ratings.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            min_rating: {
              type: Type.INTEGER,
              description: "Minimum performance rating (1-4).",
            },
          },
          required: ["min_rating"],
        },
      },
      {
        name: "rank_employees",
        description:
          "Rank employees based on criteria like performance_rating, monthly_income, job_satisfaction, etc.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            criteria: {
              type: Type.STRING,
              description: "The field to rank by.",
            },
            order: {
              type: Type.STRING,
              description: "Sort order: 'asc' or 'desc'.",
              enum: ["asc", "desc"],
            },
            limit: {
              type: Type.INTEGER,
              description: "Number of employees to return.",
            },
          },
          required: ["criteria"],
        },
      },

      // HR Recommendation Tools
      {
        name: "suggest_action_for_employee",
        description:
          "Analyze an employee's data and suggest HR actions like promotion, training, or performance review.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            employee_number: {
              type: Type.INTEGER,
              description: "The unique employee number.",
            },
          },
          required: ["employee_number"],
        },
      },
      {
        name: "identify_at_risk_employees",
        description:
          "Identify employees at risk of attrition based on satisfaction scores and other factors.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            max_job_satisfaction: {
              type: Type.INTEGER,
              description:
                "Maximum job satisfaction level to consider as risk (1-4).",
            },
            include_overtime: {
              type: Type.BOOLEAN,
              description: "Include overtime as a risk factor.",
            },
          },
        },
      },

      // Department Analysis Tools
      {
        name: "get_department_stats",
        description: "Get statistics for a specific department.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            department: {
              type: Type.STRING,
              description: "Department name to analyze.",
            },
          },
          required: ["department"],
        },
      },
    ],
  },
];
