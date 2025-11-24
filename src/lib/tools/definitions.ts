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

      {
        name: "generate_performance_insights",
        description:
          "Generate deep insights about employee performance patterns and correlations.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            focus_department: {
              type: Type.STRING,
              description: "Specific department to analyze (optional).",
            },
            analysis_type: {
              type: Type.STRING,
              description:
                "Type of analysis: 'trends', 'correlations', 'benchmarks', 'root_causes'.",
              enum: ["trends", "correlations", "benchmarks", "root_causes"],
            },
          },
        },
      },
      {
        name: "generate_attrition_insights",
        description:
          "Generate insights about employee attrition patterns and risk factors.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            depth: {
              type: Type.STRING,
              description:
                "Depth of analysis: 'quick', 'comprehensive', 'predictive'.",
              enum: ["quick", "comprehensive", "predictive"],
            },
          },
        },
      },
      {
        name: "generate_training_impact_insights",
        description:
          "Analyze the impact of training on employee performance and satisfaction.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            min_training_sessions: {
              type: Type.INTEGER,
              description:
                "Minimum training sessions to consider for analysis.",
            },
          },
        },
      },
      {
        name: "generate_workforce_optimization_insights",
        description:
          "Generate strategic insights for workforce planning and optimization.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            timeframe: {
              type: Type.STRING,
              description:
                "Timeframe for planning: 'short_term', 'medium_term', 'long_term'.",
              enum: ["short_term", "medium_term", "long_term"],
            },
          },
        },
      },
      {
        name: "generate_comprehensive_hr_report",
        description:
          "Generate a comprehensive HR insights report with key metrics and recommendations.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            report_type: {
              type: Type.STRING,
              description:
                "Type of report: 'executive', 'departmental', 'strategic', 'operational'.",
              enum: ["executive", "departmental", "strategic", "operational"],
            },
          },
        },
      },
      {
        name: "generate_performance_charts",
        description:
          "Generate charts and visualizations for performance data across departments and roles.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            chart_type: {
              type: Type.STRING,
              description:
                "Type of chart: 'bar', 'line', 'pie', 'radar', 'comparison'.",
              enum: ["bar", "line", "pie", "radar", "comparison"],
            },
            metric: {
              type: Type.STRING,
              description:
                "Metric to visualize: 'performance', 'satisfaction', 'attrition', 'training'.",
            },
          },
          required: ["chart_type", "metric"],
        },
      },
      {
        name: "generate_department_comparison_chart",
        description: "Create comparison charts across different departments.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.ARRAY,
              description: "Array of metrics to compare.",
              items: {
                type: Type.STRING,
              },
            },
            chart_style: {
              type: Type.STRING,
              description: "Chart style: 'side_by_side', 'stacked', 'radar'.",
              enum: ["side_by_side", "stacked", "radar"],
            },
          },
          required: ["metrics"],
        },
      },
      {
        name: "generate_attrition_analysis_chart",
        description:
          "Create visualizations for attrition patterns and risk factors.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            analysis_type: {
              type: Type.STRING,
              description:
                "Type of analysis: 'trends', 'factors', 'predictive', 'departmental'.",
              enum: ["trends", "factors", "predictive", "departmental"],
            },
          },
          required: ["analysis_type"],
        },
      },
      {
        name: "generate_training_impact_chart",
        description:
          "Visualize training impact on performance and satisfaction.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            visualization_type: {
              type: Type.STRING,
              description:
                "Type of visualization: 'correlation', 'before_after', 'roi', 'department_gaps'.",
              enum: ["correlation", "before_after", "roi", "department_gaps"],
            },
          },
          required: ["visualization_type"],
        },
      },
      {
        name: "generate_hr_dashboard",
        description:
          "Generate a complete HR dashboard with multiple charts and metrics.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            dashboard_type: {
              type: Type.STRING,
              description:
                "Type of dashboard: 'executive', 'department', 'comprehensive'.",
              enum: ["executive", "department", "comprehensive"],
            },
            focus_department: {
              type: Type.STRING,
              description:
                "Specific department for department dashboard (optional).",
            },
          },
        },
      },
    ],
  },
];
