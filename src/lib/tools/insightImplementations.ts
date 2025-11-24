import type { Employee } from "@/lib/types";

// Performance Insights
export const generatePerformanceInsights = (
  employees: Employee[], 
  focusDepartment?: string,
  analysisType: string = "trends"
) => {
  const targetEmployees = focusDepartment 
    ? employees.filter(e => e.department?.toLowerCase() === focusDepartment.toLowerCase())
    : employees;

  if (targetEmployees.length === 0) {
    return { error: `No employees found for department: ${focusDepartment}` };
  }

  const insights = {
    analysis_scope: focusDepartment || "Company-wide",
    analysis_type: analysisType,
    key_findings: [] as string[],
    recommendations: [] as string[],
    metrics: {} as any
  };

  // Calculate key metrics
  const highPerformers = targetEmployees.filter(e => (e.performance_rating || 0) >= 4);
  const lowPerformers = targetEmployees.filter(e => (e.performance_rating || 0) <= 2);
  const avgPerformance = targetEmployees.reduce((sum, e) => sum + (e.performance_rating || 0), 0) / targetEmployees.length;

  insights.metrics = {
    total_employees: targetEmployees.length,
    high_performers_count: highPerformers.length,
    high_performers_percentage: Math.round((highPerformers.length / targetEmployees.length) * 100),
    low_performers_count: lowPerformers.length,
    low_performers_percentage: Math.round((lowPerformers.length / targetEmployees.length) * 100),
    average_performance_rating: Math.round(avgPerformance * 100) / 100
  };

  // Performance Correlations
  if (analysisType === "correlations" || analysisType === "comprehensive") {
    // Correlation: Training vs Performance
    const highPerformerTraining = highPerformers.reduce((sum, e) => sum + (e.training_times_last_year || 0), 0) / highPerformers.length;
    const overallTraining = targetEmployees.reduce((sum, e) => sum + (e.training_times_last_year || 0), 0) / targetEmployees.length;
    
    if (highPerformerTraining > overallTraining) {
      insights.key_findings.push(`High performers attend ${Math.round(highPerformerTraining - overallTraining)} more training sessions on average`);
    }

    // Correlation: Satisfaction vs Performance
    const highPerformerSatisfaction = highPerformers.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / highPerformers.length;
    const overallSatisfaction = targetEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / targetEmployees.length;
    
    if (highPerformerSatisfaction > overallSatisfaction) {
      insights.key_findings.push(`High performers report ${Math.round((highPerformerSatisfaction - overallSatisfaction) * 100) / 100} points higher job satisfaction`);
    }
  }

  // Department Benchmarks
  if (analysisType === "benchmarks" && !focusDepartment) {
    const departmentPerformance = employees.reduce((acc, e) => {
      const dept = e.department || 'Unknown';
      if (!acc[dept]) acc[dept] = { total: 0, sum: 0, count: 0 };
      acc[dept].sum += (e.performance_rating || 0);
      acc[dept].count++;
      acc[dept].average = acc[dept].sum / acc[dept].count;
      return acc;
    }, {} as Record<string, any>);

    insights.metrics.department_benchmarks = departmentPerformance;

    // Find best and worst performing departments
    const departments = Object.entries(departmentPerformance)
      .filter(([_, data]) => data.count >= 5) // Only departments with sufficient data
      .sort((a, b) => b[1].average - a[1].average);

    if (departments.length > 0) {
      insights.key_findings.push(`Top performing department: ${departments[0][0]} (avg rating: ${Math.round(departments[0][1].average * 100) / 100})`);
      insights.key_findings.push(`Lowest performing department: ${departments[departments.length - 1][0]} (avg rating: ${Math.round(departments[departments.length - 1][1].average * 100) / 100})`);
    }
  }

  // Generate recommendations
  if (lowPerformers.length > targetEmployees.length * 0.2) {
    insights.recommendations.push(`Address performance issues in ${lowPerformers.length} employees (${insights.metrics.low_performers_percentage}% of team)`);
  }

  if (insights.metrics.high_performers_percentage < 30) {
    insights.recommendations.push("Develop programs to increase high performer ratio");
  }

  return insights;
};

// Attrition Insights
export const generateAttritionInsights = (employees: Employee[], depth: string = "comprehensive") => {
  const currentEmployees = employees.filter(e => !e.attrition);
  const formerEmployees = employees.filter(e => e.attrition);

  if (formerEmployees.length === 0) {
    return { message: "No attrition data available for analysis" };
  }

  const insights = {
    analysis_depth: depth,
    attrition_rate: Math.round((formerEmployees.length / employees.length) * 100),
    key_risk_factors: [] as string[],
    predictive_insights: [] as string[],
    retention_recommendations: [] as string[],
    department_breakdown: {} as Record<string, any>
  };

  // Analyze risk factors in current employees
  const atRiskEmployees = currentEmployees.filter(e => 
    (e.job_satisfaction || 0) <= 2 && e.over_time
  );

  if (atRiskEmployees.length > 0) {
    insights.key_risk_factors.push(`${atRiskEmployees.length} employees show high attrition risk (low satisfaction + overtime)`);
  }

  // Department analysis
  const departmentAttrition = employees.reduce((acc, e) => {
    const dept = e.department || 'Unknown';
    if (!acc[dept]) acc[dept] = { total: 0, attrition: 0 };
    acc[dept].total++;
    if (e.attrition) acc[dept].attrition++;
    acc[dept].rate = Math.round((acc[dept].attrition / acc[dept].total) * 100);
    return acc;
  }, {} as Record<string, any>);

  insights.department_breakdown = departmentAttrition;

  // Find departments with highest attrition
  const highAttritionDepts = Object.entries(departmentAttrition)
    .filter(([_, data]) => data.rate > 15) // More than 15% attrition
    .sort((a, b) => b[1].rate - a[1].rate);

  highAttritionDepts.forEach(([dept, data]) => {
    insights.key_risk_factors.push(`${dept} department has ${data.rate}% attrition rate`);
  });

  // Predictive insights for comprehensive analysis
  if (depth === "comprehensive" || depth === "predictive") {
    const avgTenureLeaving = formerEmployees.reduce((sum, e) => sum + (e.years_at_company || 0), 0) / formerEmployees.length;
    insights.predictive_insights.push(`Employees typically leave after ${Math.round(avgTenureLeaving * 10) / 10} years on average`);
    
    const commonSatisfaction = formerEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / formerEmployees.length;
    insights.predictive_insights.push(`Departing employees had average job satisfaction of ${Math.round(commonSatisfaction * 100) / 100}/4`);
  }

  // Generate recommendations
  if (highAttritionDepts.length > 0) {
    insights.retention_recommendations.push(`Focus retention efforts on: ${highAttritionDepts.map(([dept]) => dept).join(', ')}`);
  }

  if (atRiskEmployees.length > 0) {
    insights.retention_recommendations.push(`Conduct stay interviews with ${atRiskEmployees.length} high-risk employees`);
  }

  return insights;
};

// Training Impact Insights
export const generateTrainingImpactInsights = (employees: Employee[], minTrainingSessions: number = 2) => {
  const trainedEmployees = employees.filter(e => (e.training_times_last_year || 0) >= minTrainingSessions);
  const untrainedEmployees = employees.filter(e => (e.training_times_last_year || 0) < minTrainingSessions);

  if (trainedEmployees.length === 0) {
    return { message: `No employees with ${minTrainingSessions}+ training sessions found` };
  }

  const insights = {
    training_threshold: minTrainingSessions,
    roi_analysis: {} as any,
    performance_impact: {} as any,
    department_training_gaps: [] as string[],
    recommendations: [] as string[]
  };

  // ROI Analysis: Compare trained vs untrained
  const trainedPerformance = trainedEmployees.reduce((sum, e) => sum + (e.performance_rating || 0), 0) / trainedEmployees.length;
  const untrainedPerformance = untrainedEmployees.reduce((sum, e) => sum + (e.performance_rating || 0), 0) / untrainedEmployees.length;
  const performanceGap = trainedPerformance - untrainedPerformance;

  insights.performance_impact = {
    trained_employees_avg_performance: Math.round(trainedPerformance * 100) / 100,
    untrained_employees_avg_performance: Math.round(untrainedPerformance * 100) / 100,
    performance_gap: Math.round(performanceGap * 100) / 100,
    performance_improvement_percentage: Math.round((performanceGap / untrainedPerformance) * 100)
  };

  // Satisfaction impact
  const trainedSatisfaction = trainedEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / trainedEmployees.length;
  const untrainedSatisfaction = untrainedEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / untrainedEmployees.length;
  
  insights.roi_analysis = {
    trained_employees_avg_satisfaction: Math.round(trainedSatisfaction * 100) / 100,
    untrained_employees_avg_satisfaction: Math.round(untrainedSatisfaction * 100) / 100,
    satisfaction_improvement: Math.round((trainedSatisfaction - untrainedSatisfaction) * 100) / 100
  };

  // Department training gaps
  const departmentTraining = employees.reduce((acc, e) => {
    const dept = e.department || 'Unknown';
    if (!acc[dept]) acc[dept] = { total: 0, trained: 0, avg_training: 0 };
    acc[dept].total++;
    if ((e.training_times_last_year || 0) >= minTrainingSessions) acc[dept].trained++;
    acc[dept].training_rate = Math.round((acc[dept].trained / acc[dept].total) * 100);
    return acc;
  }, {} as Record<string, any>);

  const lowTrainingDepts = Object.entries(departmentTraining)
    .filter(([_, data]) => data.training_rate < 50)
    .sort((a, b) => a[1].training_rate - b[1].training_rate);

  lowTrainingDepts.forEach(([dept, data]) => {
    insights.department_training_gaps.push(`${dept}: Only ${data.training_rate}% received adequate training`);
  });

  // Recommendations
  if (performanceGap > 0.5) {
    insights.recommendations.push(`Training shows strong ROI: ${insights.performance_impact.performance_improvement_percentage}% performance improvement`);
  }

  if (lowTrainingDepts.length > 0) {
    insights.recommendations.push(`Priority training departments: ${lowTrainingDepts.map(([dept]) => dept).join(', ')}`);
  }

  return insights;
};

// Comprehensive HR Report
export const generateComprehensiveHRReport = (employees: Employee[], reportType: string = "executive") => {
  const currentEmployees = employees.filter(e => !e.attrition);
  
  const report = {
    report_type: reportType,
    executive_summary: [] as string[],
    key_metrics: {} as any,
    critical_insights: [] as string[],
    strategic_recommendations: [] as string[],
    risk_alerts: [] as string[]
  };

  // Key Metrics
  report.key_metrics = {
    total_workforce: currentEmployees.length,
    overall_attrition_rate: Math.round((employees.filter(e => e.attrition).length / employees.length) * 100),
    avg_performance_rating: Math.round((currentEmployees.reduce((sum, e) => sum + (e.performance_rating || 0), 0) / currentEmployees.length) * 100) / 100,
    avg_job_satisfaction: Math.round((currentEmployees.reduce((sum, e) => sum + (e.job_satisfaction || 0), 0) / currentEmployees.length) * 100) / 100,
    high_performer_ratio: Math.round((currentEmployees.filter(e => (e.performance_rating || 0) >= 4).length / currentEmployees.length) * 100)
  };

  // Executive Summary
  if (report.key_metrics.high_performer_ratio >= 30) {
    report.executive_summary.push(`Strong performance culture: ${report.key_metrics.high_performer_ratio}% high performers`);
  } else {
    report.executive_summary.push(`Performance opportunity: Only ${report.key_metrics.high_performer_ratio}% high performers`);
  }

  if (report.key_metrics.overall_attrition_rate > 15) {
    report.executive_summary.push(`High attrition concern: ${report.key_metrics.overall_attrition_rate}% turnover rate`);
  }

  // Critical Insights
  const atRiskCount = currentEmployees.filter(e => (e.job_satisfaction || 0) <= 2 && e.over_time).length;
  if (atRiskCount > 0) {
    report.critical_insights.push(`${atRiskCount} employees at high attrition risk (low satisfaction + overtime)`);
  }

  const promotionEligible = currentEmployees.filter(e => 
    (e.performance_rating || 0) >= 4 && (e.years_since_last_promotion || 0) >= 2
  ).length;
  
  if (promotionEligible > 0) {
    report.critical_insights.push(`${promotionEligible} high performers overdue for promotion (2+ years since last promotion)`);
  }

  // Strategic Recommendations
  if (report.key_metrics.avg_job_satisfaction < 3) {
    report.strategic_recommendations.push("Implement satisfaction improvement program - current average is below 3/4");
  }

  if (report.key_metrics.overall_attrition_rate > 10) {
    report.strategic_recommendations.push("Develop comprehensive retention strategy");
  }

  // Risk Alerts
  const departmentsWithHighAttrition = Object.entries(
    employees.reduce((acc, e) => {
      const dept = e.department || 'Unknown';
      if (!acc[dept]) acc[dept] = { total: 0, attrition: 0 };
      acc[dept].total++;
      if (e.attrition) acc[dept].attrition++;
      return acc;
    }, {} as Record<string, any>)
  ).filter(([_, data]) => (data.attrition / data.total) > 0.2);

  departmentsWithHighAttrition.forEach(([dept, data]) => {
    report.risk_alerts.push(`${dept} department: ${Math.round((data.attrition / data.total) * 100)}% attrition rate`);
  });

  return report;
};