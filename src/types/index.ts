// types/index.ts
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Dataset {
  id: string
  user_id: string
  name: string
  description?: string
  file_type: 'csv' | 'excel' | 'json' | 'kaggle'
  file_size: number
  row_count: number
  column_count: number
  raw_data: any[]
  processed_data: any[]
  column_profiles: ColumnProfile[]
  data_issues: DataIssue[]
  preprocessing_steps: PreprocessingStep[]
  status: 'uploaded' | 'processing' | 'processed' | 'error'
  created_at: string
  updated_at: string
}

export interface ColumnProfile {
  column: string
  type: 'numeric' | 'categorical' | 'date' | 'unknown'
  stats: {
    total: number
    missing: number
    min?: number
    max?: number
    mean?: number
    stdDev?: number
    unique?: number
    topValues?: { value: string; count: number }[]
  }
}

export interface DataIssue {
  type: 'missing' | 'duplicate' | 'outlier' | 'inconsistent' | 'format'
  column: string
  message: string
  severity: 'low' | 'medium' | 'high'
  count: number
  samples?: any[]
}

export interface PreprocessingStep {
  type: 'fill_missing' | 'remove_duplicates' | 'remove_outliers' | 'format_date' | 'standardize'
  column: string
  description: string
  applied_at: string
}

export interface Chart {
  id: string
  user_id: string
  dataset_id: string
  title: string
  description?: string
  chart_type: 'bar' | 'line' | 'pie' | 'scatter' | 'table' | 'heatmap' | 'area'
  chart_config: any
  data: any[]
  grid_position: GridPosition
  ai_generated: boolean
  analysis_context?: string
  created_at: string
  updated_at: string
}

export interface GridPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface Dashboard {
  id: string
  user_id: string
  name: string
  description?: string
  layout: any[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface AnalysisSession {
  id: string
  user_id: string
  dataset_id: string
  title: string
  insights: string[]
  recommendations: string[]
  created_at: string
}