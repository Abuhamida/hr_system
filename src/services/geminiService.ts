// import { GoogleGenAI, Chat, Type } from "@google/genai";
// import type { Employee } from "@/lib/types";

// const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// // Define proper types for the function declarations
// interface FunctionDeclaration {
//   name: string;
//   description: string;
//   parameters?: {
//     type: Type;
//     properties: Record<string, Schema>;
//     required: string[];
//   };
// }

// interface Schema {
//   type: Type;
//   description: string;
//   enum?: string[];
// }

// const tools = [
//   {
//     functionDeclarations: [
//       {
//         name: "get_attrition_employees",
//         description:
//           "Get a list of all employees who have left the company (attrition is true).",
//         // No parameters needed for this function
//       },
//       {
//         name: "get_employee_details",
//         description:
//           "Get the full details for a specific employee by their employee number.",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             employee_number: {
//               type: Type.INTEGER,
//               description: "The unique employee number.",
//             },
//           },
//           required: ["employee_number"],
//         },
//       },
//       {
//         name: "get_employees_by_training_count",
//         description:
//           "Get employees who attended a specific number of training sessions.",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             training_count: {
//               type: Type.INTEGER,
//               description:
//                 "The exact number of training sessions attended (e.g., 3 for employees who attended exactly 3 times).",
//             },
//             operator: {
//               type: Type.STRING,
//               description: "Comparison operator: 'exact', 'min', or 'max'.",
//               enum: ["exact", "min", "max"],
//             },
//           },
//           required: ["training_count"],
//         },
//       },
//       {
//         name: "rank_employees",
//         description:
//           "Rank employees based on a specific criterion like performance_rating, job_satisfaction, or monthly_income.",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             criteria: {
//               type: Type.STRING,
//               description:
//                 "The field to rank by (e.g., 'performance_rating', 'monthly_income', 'job_satisfaction').",
//             },
//             order: {
//               type: Type.STRING,
//               description:
//                 "The sort order: 'asc' for ascending, 'desc' for descending. Defaults to 'desc'.",
//               enum: ["asc", "desc"],
//             },
//             limit: {
//               type: Type.INTEGER,
//               description: "The number of employees to return. Defaults to 5.",
//             },
//           },
//           required: ["criteria"],
//         },
//       },
//       {
//         name: "suggest_action_for_employee",
//         description:
//           "Analyze an employee's data and suggest a data-driven HR action (e.g., promotion, training, performance review).",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             employee_number: {
//               type: Type.INTEGER,
//               description: "The unique employee number.",
//             },
//           },
//           required: ["employee_number"],
//         },
//       },
//     ] as FunctionDeclaration[],
//   },
// ];

// const chat: Chat = ai.chats.create({
//   model: "gemini-2.5-flash",
//   config: {
//     tools: tools,
//     systemInstruction: `You are a world-class, expert HR AI assistant. Your role is to analyze employee data by using the provided tools and answer questions with insightful, data-driven accuracy.
// Available capabilities:
// - Get employees who left (attrition)
// - Get details for specific employees by employee number
// - Rank employees by performance, income, satisfaction, etc.
// - Suggest actions for specific employees
// - Get employees by training session count (use get_employees_by_training_count)

// - **NEVER** answer from your own knowledge. **ALWAYS** use the provided functions to get information.
// - When asked to list employees (e.g., for attrition, training counts, or rankings), **ONLY return their Employee Numbers** in a clear list unless specifically asked for more details. This is very important.
// - When asked about training attendance, use the get_employees_by_training_count function.
// - If the user's query is unclear, ask for clarification or suggest what you can do for them based on the available tools.
// - Be professional, concise, and helpful.`,
//   },
// });

// // --- Local Tool Implementations ---

// const getAttritionEmployees = (employees: Employee[]) => {
//   return employees.filter((e) => e.attrition).map((e) => e.employee_number);
// };

// const getEmployeeDetails = (employees: Employee[], employeeNumber: number) => {
//   return employees.find((e) => e.employee_number === employeeNumber);
// };

// const rankEmployees = (
//   employees: Employee[],
//   criteria: keyof Employee,
//   order: "asc" | "desc" = "desc",
//   limit: number = 5
// ) => {
//   const sorted = [...employees].sort((a, b) => {
//     const valA = a[criteria];
//     const valB = b[criteria];

//     if (valA === null || valB === null) {
//       return 0;
//     }

//     if (typeof valA === "number" && typeof valB === "number") {
//       return order === "asc" ? valA - valB : valB - valA;
//     }
//     if (typeof valA === "string" && typeof valB === "string") {
//       return order === "asc"
//         ? valA.localeCompare(valB)
//         : valB.localeCompare(valA);
//     }
//     if (typeof valA === "boolean" && typeof valB === "boolean") {
//       return order === "asc"
//         ? valA === valB
//           ? 0
//           : valA
//           ? 1
//           : -1
//         : valA === valB
//         ? 0
//         : valA
//         ? -1
//         : 1;
//     }
//     return 0;
//   });

//   return sorted.slice(0, limit).map((e) => ({
//     employee_number: e.employee_number,
//     [criteria]: e[criteria],
//   }));
// };

// const getEmployeesByTrainingCount = (
//   employees: Employee[],
//   training_count: number,
//   operator: "exact" | "min" | "max" = "exact"
// ) => {
//   return employees
//     .filter((e) => {
//       const trainingTimes = e.training_times_last_year || 0;
//       switch (operator) {
//         case "exact":
//           return trainingTimes === training_count;
//         case "min":
//           return trainingTimes >= training_count;
//         case "max":
//           return trainingTimes <= training_count;
//         default:
//           return trainingTimes === training_count;
//       }
//     })
//     .map((e) => e.employee_number);
// };

// const suggestActionForEmployee = (
//   employees: Employee[],
//   employeeNumber: number
// ) => {
//   const employee = getEmployeeDetails(employees, employeeNumber);
//   if (!employee) {
//     return `Employee #${employeeNumber} not found.`;
//   }

//   let suggestions = [];

//   // Promotion/Raise Analysis
//   if (
//     employee.performance_rating === 4 &&
//     (employee.years_since_last_promotion || 0) > 2
//   ) {
//     suggestions.push(
//       `This employee has an 'Excellent' performance rating and hasn't been promoted in over 2 years. They may be a strong candidate for promotion or a salary review.`
//     );
//   }

//   // Attrition Risk Analysis
//   if ((employee.job_satisfaction || 0) <= 2 && employee.over_time) {
//     suggestions.push(
//       `With a low job satisfaction (Level ${employee.job_satisfaction}) and working overtime, this employee may be at risk of attrition. A check-in meeting is recommended.`
//     );
//   }

//   // Development Analysis
//   if ((employee.training_times_last_year || 0) < 2) {
//     suggestions.push(
//       `The employee has had less than two training sessions in the past year. Suggesting relevant training could boost engagement and skills.`
//     );
//   }

//   // Work-life balance concern
//   if (
//     (employee.work_life_balance || 0) <= 2 &&
//     employee.business_travel === "Frequently"
//   ) {
//     suggestions.push(
//       `This employee has poor work-life balance and travels frequently. Consider discussing travel frequency and workload balance.`
//     );
//   }

//   // High performer with low satisfaction
//   if (
//     (employee.performance_rating || 0) >= 4 &&
//     (employee.environment_satisfaction || 0) <= 2
//   ) {
//     suggestions.push(
//       `High performer with low environment satisfaction. Investigate workplace environment issues that may be affecting this employee.`
//     );
//   }

//   if (suggestions.length === 0) {
//     return `Employee #${employeeNumber} appears to be stable. Key metrics: Performance Rating: ${employee.performance_rating}, Job Satisfaction: ${employee.job_satisfaction}, Years Since Last Promotion: ${employee.years_since_last_promotion}.`;
//   }

//   return suggestions.join("\n- ");
// };

// export const getChatbotResponse = async (
//   query: string,
//   employees: Employee[]
// ): Promise<string> => {
//   try {
//     let response = await chat.sendMessage({ message: query });

//     while (response.functionCalls) {
//       const calls = response.functionCalls;
//       const functionResponseParts: object[] = [];

//       for (const call of calls) {
//         // Validate that call.args exists
//         if (!call.args) {
//           functionResponseParts.push({
//             functionResponse: {
//               name: call.name,
//               response: {
//                 content: {
//                   error: `Missing arguments for function ${call.name}`,
//                 },
//               },
//             },
//           });
//           continue;
//         }

//         let result: any;
//         switch (call.name) {
//           case "get_attrition_employees":
//             result = getAttritionEmployees(employees);
//             break;
//           case "get_employee_details":
//             if (typeof call.args.employee_number !== "number") {
//               result = {
//                 error: `Missing or invalid employee_number for ${call.name}`,
//               };
//             } else {
//               result = getEmployeeDetails(employees, call.args.employee_number);
//             }
//             break;
//           case "rank_employees":
//             if (typeof call.args.criteria !== "string") {
//               result = {
//                 error: `Missing or invalid criteria for ${call.name}`,
//               };
//             } else {
//               const order = call.args.order === "asc" ? "asc" : "desc";
//               const limit =
//                 typeof call.args.limit === "number" ? call.args.limit : 5;
//               result = rankEmployees(
//                 employees,
//                 call.args.criteria as keyof Employee,
//                 order,
//                 limit
//               );
//             }
//             break;
//           case "suggest_action_for_employee":
//             if (typeof call.args.employee_number !== "number") {
//               result = {
//                 error: `Missing or invalid employee_number for ${call.name}`,
//               };
//             } else {
//               result = suggestActionForEmployee(
//                 employees,
//                 call.args.employee_number
//               );
//             }
//             break;
//           case "get_employees_by_training_count":
//             if (typeof call.args.training_count !== "number") {
//               result = {
//                 error: `Missing or invalid training_count for ${call.name}`,
//               };
//             } else {
//               const operator = call.args.operator || "exact";
//               result = getEmployeesByTrainingCount(
//                 employees,
//                 call.args.training_count
//               );
//             }
//             break;
//           default:
//             result = { error: `Function ${call.name} not found.` };
//         }

//         functionResponseParts.push({
//           functionResponse: {
//             name: call.name,
//             response: { content: result },
//           },
//         });
//       }

//       response = await chat.sendMessage({ message: functionResponseParts });
//     }

//     return response.text ?? "";
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     return "Sorry, I encountered an error. The model might be unable to use the tools correctly for this query. Please try rephrasing your question.";
//   }
// };

import { GoogleGenAI, Chat } from "@google/genai";
import type { Employee } from "@/lib/types";
import { toolDefinitions } from "@/lib/tools/definitions";
import { executeTool } from "@/lib/tools/executor";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

const systemInstruction = `You are a world-class, expert HR AI assistant. Your role is to analyze employee data using the provided tools and answer questions with insightful, data-driven accuracy.

KEY RULES:
- **NEVER** answer from your own knowledge. **ALWAYS** use the provided functions.
- When listing employees, return ONLY their Employee Numbers unless asked for details.
- For employee-specific analysis, provide concise, actionable recommendations.
- If query is unclear, ask for clarification or suggest available tools.
- Be professional, concise, and helpful.

AVAILABLE CAPABILITIES:
- Employee lookup by number, department, job role, or training count
- Analytics: attrition, high performers, rankings, risk assessment
- HR recommendations: promotions, training, performance reviews
- Department statistics and comparisons
- **Promotion analysis**: recently promoted employees, promotion eligibility, promotion analytics

PROMOTION GUIDELINES:
- For "recently promoted" queries, use get_recently_promoted_employees with years=1
- For promotion eligibility, use get_employees_eligible_for_promotion
- For promotion trends, use get_promotion_analytics
- Consider years_since_last_promotion = 0 or 1 as recently promoted`;


export class ChatbotService {
  private chat: Chat;

  constructor() {
    this.chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        tools: toolDefinitions as unknown as any,
        systemInstruction,
      },
    });
  }

  async getResponse(query: string, employees: Employee[]): Promise<string> {
    try {
      // Send user query
      let response = await this.chat.sendMessage({ message: query });

      // Handle function calls if any
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponseParts: any[] = [];

        for (const call of response.functionCalls) {
          // ✅ Validate name
          if (!call.name) {
            functionResponseParts.push({
              functionResponse: {
                name: "unknown_function",
                response: {
                  content: { error: "Function name is missing." },
                },
              },
            });
            continue;
          }

          // ✅ Validate arguments
          if (!call.args) {
            functionResponseParts.push({
              functionResponse: {
                name: call.name,
                response: {
                  content: {
                    error: `Missing arguments for function ${call.name}`,
                  },
                },
              },
            });
            continue;
          }

          // ✅ Safe cast after validation
          const result = executeTool(
            call as unknown as import("@/lib/types").FunctionCall,
            employees
          );

          functionResponseParts.push({
            functionResponse: {
              name: call.name,
              response: { content: result },
            },
          });
        }

        // Send the function responses back to the AI
        response = await this.chat.sendMessage({
          message: functionResponseParts,
        });
      }

      // ✅ Return AI response or fallback message
      return (
        response.text ?? "I couldn't generate a response. Please try again."
      );
    } catch (error) {
      console.error("Chatbot service error:", error);
      return "Sorry, I encountered an error processing your request. Please try again.";
    }
  }
}

// ✅ Singleton instance
export const getChatbotResponse = new ChatbotService();
