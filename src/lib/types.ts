// Employee type matching Supabase schema
export interface Employee {
  id: string; // same as auth.user.id
  employee_number: number;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  age: number | null;
  department: string | null;
  education: number | null;
  education_field: string | null;
  job_role: string | null;
  job_level: number | null;
  job_involvement: number | null;
  job_satisfaction: number | null;
  marital_status: string | null;
  business_travel: string | null;
  over_time: boolean | null;
  monthly_income: number | null;
  daily_rate: number | null;
  hourly_rate: number | null;
  years_at_company: number | null;
  total_working_years: number | null;
  performance_rating: number | null;
  environment_satisfaction: number | null;
  relationship_satisfaction: number | null;
  work_life_balance: number | null;
  distance_from_home: number | null;
  num_companies_worked: number | null;
  percent_salary_hike: number | null;
  training_times_last_year: number | null;
  years_with_curr_manager: number | null;
  years_since_last_promotion: number | null;
  attrition: boolean | null;
  phone:string | null;
  address:string | null;
  created_at: string;
}

// Chat session type
export interface ChatSession {
  id: string;
  employee_id: string;
  title: string;
  created_at: string;
}

// Chat message type
export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

// Knowledge base entry type (for RAG)
export interface KnowledgeBaseEntry {
  id: string;
  content: string;
  embedding: number[]; // vector(1536)
  metadata: Record<string, any>;
  created_at: string;
}

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

// Utility type for insert/update operations
export type InsertEmployee = Omit<Employee, 'id' | 'created_at'>;
export type InsertChatSession = Omit<ChatSession, 'id' | 'created_at'>;
export type InsertChatMessage = Omit<ChatMessage, 'id' | 'created_at'>;
export type InsertKnowledgeBaseEntry = Omit<KnowledgeBaseEntry, 'id' | 'created_at'>;
