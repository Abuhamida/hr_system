import type { Employee } from "@/lib/types";
import { ChartResponse, DashboardData } from "@/lib/types/chart";
import {
  createBarChartConfig,
  createLineChartConfig,
  createPieChartConfig,
  createRadarChartConfig,
  createDoughnutChartConfig
} from "@/lib/utils/chartConfigs";

// Performance Charts with Chart.js configs
export const generatePerformanceCharts = (
  employees: Employee[], 
  chartType: string, 
  metric: string
): ChartResponse => {
  const currentEmployees = employees.filter(e => !e.attrition);
  
  // Department performance data
  const departmentData = currentEmployees.reduce((acc, employee) => {
    const dept = employee.department || 'Unknown';
    if (!acc[dept]) {
      acc[dept] = {
        department: dept,
        employee_count: 0,
        total_performance: 0,
        total_satisfaction: 0,
        total_training: 0,
        high_performers: 0
      };
    }
    
    acc[dept].employee_count++;
    acc[dept].total_performance += employee.performance_rating || 0;
    acc[dept].total_satisfaction += employee.job_satisfaction || 0;
    acc[dept].total_training += employee.training_times_last_year || 0;
    
    if ((employee.performance_rating || 0) >= 4) {
      acc[dept].high_performers++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to chart data
  const departments = Object.values(departmentData).map((dept: any) => ({
    department: dept.department,
    avg_performance: Math.round((dept.total_performance / dept.employee_count) * 100) / 100,
    avg_satisfaction: Math.round((dept.total_satisfaction / dept.employee_count) * 100) / 100,
    avg_training: Math.round((dept.total_training / dept.employee_count) * 100) / 100,
    high_performer_rate: Math.round((dept.high_performers / dept.employee_count) * 100),
    employee_count: dept.employee_count
  }));

  let chartConfig: any;
  let title = '';
  let description = '';

  const insights: string[] = [];
  const recommendations: string[] = [];

  switch (chartType) {
    case 'bar':
      const barData = {
        labels: departments.map(d => d.department),
        datasets: [
          {
            label: `Average ${metric.replace('_', ' ').toUpperCase()}`,
            data: departments.map(d => (d as Record<string, any>)[`avg_${metric}`]),
          }
        ]
      };
      chartConfig = createBarChartConfig(barData, `Department ${metric.charAt(0).toUpperCase() + metric.slice(1)} Comparison`);
      title = `Department ${metric.charAt(0).toUpperCase() + metric.slice(1)} Comparison`;
      description = `Comparing average ${metric} scores across departments`;
      break;

    case 'radar':
      const radarData = {
        labels: departments.map(d => d.department),
        datasets: [
          {
            label: 'Performance Rating',
            data: departments.map(d => d.avg_performance),
          },
          {
            label: 'Job Satisfaction',
            data: departments.map(d => d.avg_satisfaction),
          }
        ]
      };
      chartConfig = createRadarChartConfig(radarData, 'Department Performance vs Satisfaction');
      title = 'Department Performance vs Satisfaction Radar';
      description = 'Multi-dimensional comparison of key metrics across departments';
      break;

    case 'pie':
      const highPerformerData = departments.map(dept => ({
        department: dept.department,
        high_performers: dept.high_performer_rate,
        count: Math.round((dept.high_performer_rate / 100) * dept.employee_count)
      }));

      const pieData = {
        labels: highPerformerData.map(d => d.department),
        datasets: [
          {
            data: highPerformerData.map(d => d.count),
          }
        ]
      };
      chartConfig = createPieChartConfig(pieData, 'High Performers Distribution by Department');
      title = 'High Performers Distribution by Department';
      description = 'Percentage of high performers in each department';
      break;

    case 'line':
      const lineData = {
        labels: departments.map(d => d.department),
        datasets: [
          {
            label: 'Performance Trend',
            data: departments.map(d => d.avg_performance),
          },
          {
            label: 'Satisfaction Trend',
            data: departments.map(d => d.avg_satisfaction),
          }
        ]
      };
      chartConfig = createLineChartConfig(lineData, 'Performance & Satisfaction Trends by Department');
      title = 'Performance & Satisfaction Trends';
      description = 'Trend analysis of key metrics across departments';
      break;
  }

  // Generate insights
  const sortedByPerformance = [...departments].sort((a, b) => b.avg_performance - a.avg_performance);
  
  if (sortedByPerformance.length > 0) {
    insights.push(`🏆 Top performing department: ${sortedByPerformance[0].department} (${sortedByPerformance[0].avg_performance}/4 rating)`);
    insights.push(`📉 Lowest performing department: ${sortedByPerformance[sortedByPerformance.length - 1].department} (${sortedByPerformance[sortedByPerformance.length - 1].avg_performance}/4 rating)`);
  }

  // Performance-Satisfaction correlation
  const satisfactionCorrelation = calculateCorrelation(
    departments.map(d => d.avg_performance),
    departments.map(d => d.avg_satisfaction)
  );

  if (satisfactionCorrelation > 0.5) {
    insights.push(`📈 Strong positive correlation between performance and satisfaction (r=${satisfactionCorrelation.toFixed(2)})`);
  }

  // Generate recommendations
  const lowPerformingDepts = departments.filter(d => d.avg_performance < 3);
  if (lowPerformingDepts.length > 0) {
    recommendations.push(`🎯 Focus performance improvement efforts on: ${lowPerformingDepts.map(d => d.department).join(', ')}`);
  }

  const highPerformerDepts = departments.filter(d => d.high_performer_rate > 40);
  if (highPerformerDepts.length > 0) {
    recommendations.push(`🌟 Learn from high-performing departments: ${highPerformerDepts.map(d => d.department).join(', ')}`);
  }

  return {
    type: chartType,
    title,
    description,
    chartConfig,
    insights,
    recommendations,
    rawData: departments
  };
};

// Department Comparison Charts with Chart.js
export const generateDepartmentComparisonChart = (
  employees: Employee[], 
  metrics: string[], 
  chartStyle: string
): ChartResponse => {
  const currentEmployees = employees.filter(e => !e.attrition);
  
  const departmentMetrics = currentEmployees.reduce((acc, employee) => {
    const dept = employee.department || 'Unknown';
    if (!acc[dept]) {
      acc[dept] = {
        department: dept,
        counts: { total: 0 },
        sums: {},
        averages: {}
      };
    }
    
    acc[dept].counts.total++;
    
    // Sum up all metrics
    metrics.forEach(metric => {
      const value = employee[metric as keyof Employee] as number;
      if (value !== null && value !== undefined) {
        acc[dept].sums[metric] = (acc[dept].sums[metric] || 0) + value;
      }
    });
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.values(departmentMetrics).forEach((dept: any) => {
    metrics.forEach(metric => {
      if (dept.sums[metric]) {
        dept.averages[metric] = Math.round((dept.sums[metric] / dept.counts.total) * 100) / 100;
      }
    });
  });

  const departments = Object.values(departmentMetrics);
  const labels = departments.map((d: any) => d.department);

  let chartConfig: any;
  let title = 'Department Comparison';
  let description = `Comparing ${metrics.join(', ')} across departments`;

  const insights: string[] = [];
  const recommendations: string[] = [];

  if (chartStyle === 'side_by_side' || chartStyle === 'bar') {
    const barData = {
      labels,
      datasets: metrics.map((metric, index) => ({
        label: metric.replace('_', ' ').toUpperCase(),
        data: departments.map((d: any) => d.averages[metric] || 0),
      }))
    };
    chartConfig = createBarChartConfig(barData, 'Department Metrics Comparison');
  } else if (chartStyle === 'radar') {
    const radarData = {
      labels,
      datasets: metrics.map((metric, index) => ({
        label: metric.replace('_', ' ').toUpperCase(),
        data: departments.map((d: any) => d.averages[metric] || 0),
      }))
    };
    chartConfig = createRadarChartConfig(radarData, 'Department Metrics Radar Comparison');
  }

  // Generate insights
  metrics.forEach(metric => {
    const sorted = [...departments].sort((a: any, b: any) => b.averages[metric] - a.averages[metric]);
    if (sorted.length > 0) {
      const bestDept = sorted[0];
      const worstDept = sorted[sorted.length - 1];
      insights.push(`📊 ${metric.replace('_', ' ')}: ${bestDept.department} leads (${bestDept.averages[metric]}) vs ${worstDept.department} (${worstDept.averages[metric]})`);
    }
  });

  // Generate recommendations
  if (metrics.includes('performance_rating') && metrics.includes('job_satisfaction')) {
    const satisfactionPerformanceGap = departments.map((dept: any) => ({
      department: dept.department,
      gap: Math.abs((dept.averages.performance_rating || 0) - (dept.averages.job_satisfaction || 0))
    })).filter(d => d.gap > 1);

    satisfactionPerformanceGap.forEach(dept => {
      recommendations.push(`⚖️ Address performance-satisfaction gap in ${dept.department} (gap: ${dept.gap.toFixed(1)} points)`);
    });
  }

  return {
    type: chartStyle,
    title,
    description,
    chartConfig,
    insights,
    recommendations,
    rawData: departments
  };
};

// Attrition Analysis Charts with Chart.js
export const generateAttritionAnalysisChart = (
  employees: Employee[], 
  analysisType: string
): ChartResponse => {
  const formerEmployees = employees.filter(e => e.attrition);
  const currentEmployees = employees.filter(e => !e.attrition);

  let chartConfig: any;
  let title = '';
  let description = '';
  const insights: string[] = [];
  const recommendations: string[] = [];

  switch (analysisType) {
    case 'departmental':
      const departmentAttrition = employees.reduce((acc, employee) => {
        const dept = employee.department || 'Unknown';
        if (!acc[dept]) {
          acc[dept] = { total: 0, attrition: 0 };
        }
        acc[dept].total++;
        if (employee.attrition) acc[dept].attrition++;
        return acc;
      }, {} as Record<string, any>);

      const deptData = Object.entries(departmentAttrition).map(([dept, data]) => ({
        department: dept,
        attrition_rate: Math.round((data.attrition / data.total) * 100),
        total_employees: data.total,
        attrition_count: data.attrition
      })).filter(dept => dept.total_employees >= 3);

      const barData = {
        labels: deptData.map(d => d.department),
        datasets: [
          {
            label: 'Attrition Rate (%)',
            data: deptData.map(d => d.attrition_rate),
          }
        ]
      };
      chartConfig = createBarChartConfig(barData, 'Attrition Rates by Department');
      title = 'Attrition Rates by Department';
      description = 'Department-wise employee turnover rates';

      // Insights
      const highAttritionDepts = deptData.filter(d => d.attrition_rate > 15);
      const lowAttritionDepts = deptData.filter(d => d.attrition_rate < 5);

      if (highAttritionDepts.length > 0) {
        insights.push(`🚨 High attrition departments: ${highAttritionDepts.map(d => `${d.department} (${d.attrition_rate}%)`).join(', ')}`);
        recommendations.push(`🎯 Immediate retention focus needed for: ${highAttritionDepts.map(d => d.department).join(', ')}`);
      }

      if (lowAttritionDepts.length > 0) {
        insights.push(`✅ Low attrition departments: ${lowAttritionDepts.map(d => `${d.department} (${d.attrition_rate}%)`).join(', ')}`);
        recommendations.push(`🌟 Learn retention best practices from: ${lowAttritionDepts.map(d => d.department).join(', ')}`);
      }
      break;

    case 'factors':
      // Analyze attrition risk factors
      const riskFactors = {
        low_satisfaction: currentEmployees.filter(e => (e.job_satisfaction || 0) <= 2).length,
        high_overtime: currentEmployees.filter(e => e.over_time).length,
        low_satisfaction_plus_overtime: currentEmployees.filter(e => (e.job_satisfaction || 0) <= 2 && e.over_time).length,
        frequent_travel: currentEmployees.filter(e => e.business_travel === 'Frequently').length
      };

      const doughnutData = {
        labels: ['Low Satisfaction', 'High Overtime', 'Low Sat + OT', 'Frequent Travel'],
        datasets: [
          {
            data: [
              riskFactors.low_satisfaction,
              riskFactors.high_overtime,
              riskFactors.low_satisfaction_plus_overtime,
              riskFactors.frequent_travel
            ],
          }
        ]
      };
      chartConfig = createDoughnutChartConfig(doughnutData, 'Attrition Risk Factors Analysis');
      title = 'Attrition Risk Factors Analysis';
      description = 'Current employees showing key attrition risk indicators';

      if (riskFactors.low_satisfaction_plus_overtime > 0) {
        insights.push(`🔴 ${riskFactors.low_satisfaction_plus_overtime} employees show HIGH attrition risk (low satisfaction + overtime)`);
        recommendations.push(`📞 Conduct stay interviews with high-risk employees immediately`);
      }

      if (riskFactors.low_satisfaction > currentEmployees.length * 0.2) {
        insights.push(`🟡 ${riskFactors.low_satisfaction} employees have low job satisfaction (${Math.round((riskFactors.low_satisfaction / currentEmployees.length) * 100)}% of workforce)`);
        recommendations.push(`💡 Implement satisfaction improvement programs across the organization`);
      }
      break;
  }

  return {
    type: analysisType === 'factors' ? 'doughnut' : 'bar',
    title,
    description,
    chartConfig,
    insights,
    recommendations,
    rawData: { formerEmployees: formerEmployees.length, currentEmployees: currentEmployees.length }
  };
};

// HR Dashboard with Chart.js
export const generateHRDashboard = (
  employees: Employee[], 
  dashboardType: string, 
  focusDepartment?: string
): DashboardData => {
  const currentEmployees = focusDepartment 
    ? employees.filter(e => !e.attrition && e.department?.toLowerCase() === focusDepartment.toLowerCase())
    : employees.filter(e => !e.attrition);

  const dashboard: DashboardData = {
    type: dashboardType,
    focus: focusDepartment || 'Company-wide',
    metrics: {
      total_employees: currentEmployees.length,
      avg_performance: calculateAverage(currentEmployees, 'performance_rating'),
      avg_satisfaction: calculateAverage(currentEmployees, 'job_satisfaction'),
      attrition_rate: Math.round((employees.filter(e => e.attrition).length / employees.length) * 100),
      high_performer_ratio: Math.round((currentEmployees.filter(e => (e.performance_rating || 0) >= 4).length / currentEmployees.length) * 100),
      avg_training: calculateAverage(currentEmployees, 'training_times_last_year'),
      promotion_eligible: currentEmployees.filter(e => (e.performance_rating || 0) >= 4 && (e.years_since_last_promotion || 0) >= 2).length
    },
    charts: [],
    alerts: [],
    recommendations: []
  };

  // Add key charts to dashboard
  dashboard.charts.push(
    generatePerformanceCharts(employees, 'bar', 'performance'),
    generateAttritionAnalysisChart(employees, 'departmental'),
    generateDepartmentComparisonChart(employees, ['performance_rating', 'job_satisfaction', 'training_times_last_year'], 'radar')
  );

  // Generate alerts
  if (dashboard.metrics.attrition_rate > 15) {
    dashboard.alerts.push(`🚨 High attrition rate: ${dashboard.metrics.attrition_rate}% (Industry avg: 10%)`);
  }

  if (dashboard.metrics.avg_satisfaction < 3) {
    dashboard.alerts.push(`😟 Low job satisfaction: ${dashboard.metrics.avg_satisfaction}/4 (Target: >3.2)`);
  }

  if (dashboard.metrics.avg_training < 2) {
    dashboard.alerts.push(`📚 Insufficient training: ${dashboard.metrics.avg_training} sessions/employee/year (Recommended: 3+)`);
  }

  if (dashboard.metrics.promotion_eligible > 5) {
    dashboard.alerts.push(`⭐ ${dashboard.metrics.promotion_eligible} high performers overdue for promotion`);
  }

  // Generate recommendations
  if (dashboard.metrics.high_performer_ratio < 25) {
    dashboard.recommendations.push("🎯 Implement programs to increase high performer ratio (Current: " + dashboard.metrics.high_performer_ratio + "%)");
  }

  if (dashboard.metrics.avg_performance < 3.2) {
    dashboard.recommendations.push("📈 Develop performance improvement initiatives");
  }

  if (dashboard.metrics.avg_training < 2.5) {
    dashboard.recommendations.push("🎓 Increase training budget and opportunities");
  }

  return dashboard;
};

// Helper functions
const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

const calculateAverage = (employees: Employee[], field: keyof Employee): number => {
  const validEmployees = employees.filter(e => e[field] !== null && e[field] !== undefined);
  if (validEmployees.length === 0) return 0;
  
  const sum = validEmployees.reduce((total, e) => total + (e[field] as number), 0);
  return Math.round((sum / validEmployees.length) * 100) / 100;
};



export const generateTrainingImpactChart = (
  employees: Employee[],
  chartType: string
): ChartResponse => {
  const currentEmployees = employees.filter(e => !e.attrition);

  // تجميع حسب عدد التدريبات
  const trainingGroups = currentEmployees.reduce((acc, e) => {
    const trainingCount = e.training_times_last_year ?? 0;
    if (!acc[trainingCount]) {
      acc[trainingCount] = { count: 0, totalPerformance: 0, totalSatisfaction: 0 };
    }
    acc[trainingCount].count++;
    acc[trainingCount].totalPerformance += e.performance_rating ?? 0;
    acc[trainingCount].totalSatisfaction += e.job_satisfaction ?? 0;
    return acc;
  }, {} as Record<number, { count: number; totalPerformance: number; totalSatisfaction: number }>);

  // حساب المتوسطات
  const dataPoints = Object.keys(trainingGroups).map(key => {
    const k = Number(key);
    const g = trainingGroups[k];
    return {
      trainingCount: k,
      avgPerformance: Math.round((g.totalPerformance / g.count) * 100) / 100,
      avgSatisfaction: Math.round((g.totalSatisfaction / g.count) * 100) / 100,
    };
  }).sort((a, b) => a.trainingCount - b.trainingCount);

  // إعداد بيانات الرسم البياني
  const chartData = {
    labels: dataPoints.map(d => `${d.trainingCount} Trainings`),
    datasets: [
      {
        label: "Average Performance",
        data: dataPoints.map(d => d.avgPerformance),
      },
      {
        label: "Average Job Satisfaction",
        data: dataPoints.map(d => d.avgSatisfaction),
      }
    ]
  };

  // إنشاء config بناءً على نوع الرسم المطلوب
  const chartConfig = chartType === "bar"
    ? createBarChartConfig(chartData, "Training Impact Analysis")
    : createLineChartConfig(chartData, "Training Impact Analysis");

  // تحليل النتائج
  const insights: string[] = [];
  const recommendations: string[] = [];

  const maxPerformance = Math.max(...dataPoints.map(d => d.avgPerformance));
  const bestTrainingLevel = dataPoints.find(d => d.avgPerformance === maxPerformance)?.trainingCount ?? 0;

  insights.push(`📈 Best performance achieved at around ${bestTrainingLevel} trainings per year.`);
  
  const correlation = calculateCorrelation(
    dataPoints.map(d => d.trainingCount),
    dataPoints.map(d => d.avgPerformance)
  );

  if (correlation > 0.5) {
    insights.push(`💪 Strong positive correlation between training frequency and performance (r=${correlation.toFixed(2)})`);
    recommendations.push(`🎓 Encourage employees to attend at least ${bestTrainingLevel} training sessions annually.`);
  } else if (correlation < 0) {
    insights.push(`⚠️ More training doesn’t always mean better performance (r=${correlation.toFixed(2)})`);
    recommendations.push(`🧩 Reassess training content and delivery quality.`);
  }

  return {
    type: chartType,
    title: "Training Impact on Performance & Satisfaction",
    description: "Shows how training frequency influences employee performance and satisfaction levels.",
    chartConfig,
    insights,
    recommendations,
    rawData: dataPoints
  };
};

