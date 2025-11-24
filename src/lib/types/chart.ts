export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'radar' | 'doughnut';
  data: any;
  options: any;
}

export interface ChartResponse {
  type: string;
  title: string;
  description: string;
  chartConfig: ChartConfig;
  insights: string[];
  recommendations: string[];
  rawData?: any;
}

export interface DashboardData {
  type: string;
  focus: string;
  metrics: Record<string, number>;
  charts: ChartResponse[];
  alerts: string[];
  recommendations: string[];
}