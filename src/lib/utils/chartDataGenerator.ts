import type { Employee, ChartData } from "@/lib/types";
import {
  createBarChartConfig,
  createLineChartConfig,
  createPieChartConfig,
  createRadarChartConfig,
  createDoughnutChartConfig,
} from "./chartConfigs";

export const generateDepartmentPerformanceChart = (employees: Employee[]) => {
  const currentEmployees = employees.filter((e) => !e.attrition);

  // Calculate department averages
  const departmentData = currentEmployees.reduce((acc, employee) => {
    const dept = employee.department || "Unknown";
    if (!acc[dept]) {
      acc[dept] = {
        department: dept,
        totalPerformance: 0,
        totalSatisfaction: 0,
        count: 0,
      };
    }

    acc[dept].totalPerformance += employee.performance_rating || 0;
    acc[dept].totalSatisfaction += employee.job_satisfaction || 0;
    acc[dept].count++;

    return acc;
  }, {} as Record<string, any>);

  // Convert to chart data
  const departments = Object.values(departmentData).map((dept: any) => ({
    department: dept.department,
    avgPerformance:
      dept.count > 0
        ? Math.round((dept.totalPerformance / dept.count) * 100) / 100
        : 0,
    avgSatisfaction:
      dept.count > 0
        ? Math.round((dept.totalSatisfaction / dept.count) * 100) / 100
        : 0,
    employeeCount: dept.count,
  }));

  // Filter out departments with no data
  const validDepartments = departments.filter((dept) => dept.employeeCount > 0);

  if (validDepartments.length === 0) {
    return null;
  }

  const radarData = {
    labels: validDepartments.map((d) => d.department),
    datasets: [
      {
        label: "Performance Rating",
        data: validDepartments.map((d) => d.avgPerformance),
        backgroundColor: "#3B82F630",
        borderColor: "#3B82F6",
        borderWidth: 2,
      },
      {
        label: "Job Satisfaction",
        data: validDepartments.map((d) => d.avgSatisfaction),
        backgroundColor: "#EF444430",
        borderColor: "#EF4444",
        borderWidth: 2,
      },
    ],
  };

  const chartConfig = createRadarChartConfig(
    radarData,
    "Department Performance vs Satisfaction"
  );

  // Generate insights
  const insights: string[] = [];
  const recommendations: string[] = [];

  const sortedByPerformance = [...validDepartments].sort(
    (a, b) => b.avgPerformance - a.avgPerformance
  );
  if (sortedByPerformance.length > 0) {
    insights.push(
      `🏆 Top performing department: ${sortedByPerformance[0].department} (${sortedByPerformance[0].avgPerformance}/4 rating)`
    );
    insights.push(
      `📉 Lowest performing department: ${
        sortedByPerformance[sortedByPerformance.length - 1].department
      } (${
        sortedByPerformance[sortedByPerformance.length - 1].avgPerformance
      }/4 rating)`
    );
  }

  const satisfactionGap = validDepartments.filter(
    (dept) => Math.abs(dept.avgPerformance - dept.avgSatisfaction) > 1
  );

  satisfactionGap.forEach((dept) => {
    recommendations.push(
      `⚖️ Address performance-satisfaction gap in ${dept.department} (Performance: ${dept.avgPerformance}, Satisfaction: ${dept.avgSatisfaction})`
    );
  });

  return {
    type: "radar" as const,
    title: "Department Performance vs Satisfaction",
    description:
      "Comparison of performance ratings and job satisfaction across departments",
    chartConfig,
    insights,
    recommendations,
    rawData: validDepartments,
  };
};

export const generateAttritionChart = (employees: Employee[]) => {
  const departmentAttrition = employees.reduce((acc, employee) => {
    const dept = employee.department || "Unknown";
    if (!acc[dept]) {
      acc[dept] = { total: 0, attrition: 0 };
    }
    acc[dept].total++;
    if (employee.attrition) acc[dept].attrition++;
    return acc;
  }, {} as Record<string, any>);

  const deptData = Object.entries(departmentAttrition)
    .map(([dept, data]) => ({
      department: dept,
      attritionRate: Math.round((data.attrition / data.total) * 100),
      totalEmployees: data.total,
      attritionCount: data.attrition,
    }))
    .filter((dept) => dept.totalEmployees >= 3);

  if (deptData.length === 0) {
    return null;
  }

  const barData = {
    labels: deptData.map((d) => d.department),
    datasets: [
      {
        label: "Attrition Rate (%)",
        data: deptData.map((d) => d.attritionRate),
        backgroundColor: deptData.map((d) =>
          d.attritionRate > 20
            ? "#EF4444"
            : d.attritionRate > 10
            ? "#F59E0B"
            : "#10B981"
        ),
      },
    ],
  };

  const chartConfig = createBarChartConfig(
    barData,
    "Attrition Rates by Department"
  );

  const insights: string[] = [];
  const recommendations: string[] = [];

  const highAttritionDepts = deptData.filter((d) => d.attritionRate > 15);
  const lowAttritionDepts = deptData.filter((d) => d.attritionRate < 5);

  if (highAttritionDepts.length > 0) {
    insights.push(
      `🚨 High attrition departments: ${highAttritionDepts
        .map((d) => `${d.department} (${d.attritionRate}%)`)
        .join(", ")}`
    );
    recommendations.push(
      `🎯 Immediate retention focus needed for: ${highAttritionDepts
        .map((d) => d.department)
        .join(", ")}`
    );
  }

  if (lowAttritionDepts.length > 0) {
    insights.push(
      `✅ Low attrition departments: ${lowAttritionDepts
        .map((d) => `${d.department} (${d.attritionRate}%)`)
        .join(", ")}`
    );
    recommendations.push(
      `🌟 Learn retention best practices from: ${lowAttritionDepts
        .map((d) => d.department)
        .join(", ")}`
    );
  }

  return {
    type: "bar" as const,
    title: "Employee Attrition by Department",
    description:
      "Department-wise employee turnover rates and retention analysis",
    chartConfig,
    insights,
    recommendations,
    rawData: deptData,
  };
};

export const generateTrainingImpactChart = (employees: Employee[]) => {
  const currentEmployees = employees.filter((e) => !e.attrition);

  // Group by training sessions
  const trainingGroups: Record<
    number,
    { count: number; totalPerformance: number; totalSatisfaction: number }
  > = {};

  currentEmployees.forEach((employee) => {
    const trainingCount = employee.training_times_last_year || 0;
    if (!trainingGroups[trainingCount]) {
      trainingGroups[trainingCount] = {
        count: 0,
        totalPerformance: 0,
        totalSatisfaction: 0,
      };
    }
    trainingGroups[trainingCount].count++;
    trainingGroups[trainingCount].totalPerformance +=
      employee.performance_rating || 0;
    trainingGroups[trainingCount].totalSatisfaction +=
      employee.job_satisfaction || 0;
  });

  const trainingData = Object.entries(trainingGroups)
    .map(([sessions, data]) => ({
      trainingSessions: parseInt(sessions),
      avgPerformance: data.totalPerformance / data.count,
      avgSatisfaction: data.totalSatisfaction / data.count,
      employeeCount: data.count,
    }))
    .filter((d) => d.employeeCount >= 2) // Only groups with sufficient data
    .sort((a, b) => a.trainingSessions - b.trainingSessions);

  if (trainingData.length === 0) {
    return null;
  }

  const lineData = {
    labels: trainingData.map((d) => `${d.trainingSessions} sessions`),
    datasets: [
      {
        label: "Average Performance",
        data: trainingData.map((d) => d.avgPerformance),
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F620",
        borderWidth: 3,
        tension: 0.1,
      },
      {
        label: "Average Satisfaction",
        data: trainingData.map((d) => d.avgSatisfaction),
        borderColor: "#10B981",
        backgroundColor: "#10B98120",
        borderWidth: 3,
        tension: 0.1,
      },
    ],
  };

  const chartConfig = createLineChartConfig(
    lineData,
    "Training Impact on Performance & Satisfaction"
  );

  const insights: string[] = [];
  const recommendations: string[] = [];

  // Calculate correlation
  const performanceCorrelation = calculateCorrelation(
    trainingData.map((d) => d.trainingSessions),
    trainingData.map((d) => d.avgPerformance)
  );

  if (performanceCorrelation > 0.3) {
    insights.push(
      `📈 Positive correlation between training and performance (r=${performanceCorrelation.toFixed(
        2
      )})`
    );
    recommendations.push(
      `🎓 Increase training investments - data shows positive impact on performance`
    );
  }

  const lowTrainingEmployees = currentEmployees.filter(
    (e) => (e.training_times_last_year || 0) < 2
  ).length;
  if (lowTrainingEmployees > currentEmployees.length * 0.3) {
    insights.push(
      `⚠️ ${lowTrainingEmployees} employees (${Math.round(
        (lowTrainingEmployees / currentEmployees.length) * 100
      )}%) received less than 2 training sessions`
    );
    recommendations.push(
      `📚 Implement minimum training standards across the organization`
    );
  }

  return {
    type: "line" as const,
    title: "Training Impact Analysis",
    description:
      "How training frequency correlates with employee performance and satisfaction",
    chartConfig,
    insights,
    recommendations,
    rawData: trainingData,
  };
};

// Helper function to calculate correlation
const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

export const generateChartFromQuery = (
  query: string,
  employees: Employee[]
): { text: string; chartData?: ChartData } => {
  const lowerQuery = query.toLowerCase();

  // Department performance chart
  if (lowerQuery.includes("performance") && lowerQuery.includes("department")) {
    const chart = generateDepartmentPerformanceChart(employees);
    if (chart) {
      return {
        text: "Here's the department performance comparison:",
        chartData: chart,
      };
    }
  }

  // Attrition analysis
  if (lowerQuery.includes("attrition") || lowerQuery.includes("turnover")) {
    const chart = generateAttritionChart(employees);
    if (chart) {
      return {
        text: "Here's the attrition analysis:",
        chartData: chart,
      };
    }
  }

  // Training impact
  if (
    lowerQuery.includes("training") &&
    (lowerQuery.includes("impact") || lowerQuery.includes("effect"))
  ) {
    const chart = generateTrainingImpactChart(employees);
    if (chart) {
      return {
        text: "Here's the training impact analysis:",
        chartData: chart,
      };
    }
  }

  // Default: department performance
  const chart = generateDepartmentPerformanceChart(employees);
  if (chart) {
    return {
      text: "Here's the HR data visualization you requested:",
      chartData: chart,
    };
  }

  return {
    text: "I couldn't generate a chart with the available data. Please ensure your employee data contains department information, performance ratings, and other relevant metrics.",
  };
};
