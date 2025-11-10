export interface Employee {
  id: string;
  auth_user_id: string;
  company_id: string;
  department_id?: string;
  job_role_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  hire_date: string;
  termination_date?: string;
  salary?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  status: 'active' | 'on_leave' | 'terminated' | 'resigned';
  manager_id?: string;
  date_of_birth?: string;
  gender?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
  department?: Department;
  job_role?: JobRole;
  manager?: Employee;
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
  manager?: Employee;
}

export interface JobRole {
  id: string;
  department_id: string;
  title: string;
  description?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  requirements?: string;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface AttritionPrediction {
  id: string;
  employee_id: string;
  prediction_date: string;
  attrition_probability: number;
  prediction: boolean;
  confidence_level: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  explanation?: string;
  model_version: string;
  created_at: string;
  employee?: Employee;
}

export interface ChatSession {
  id: string;
  title?: string;
  participant1_id: string;
  participant2_id: string;
  session_type: 'direct' | 'group' | 'support';
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  participant1?: Employee;
  participant2?: Employee;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  chat_session_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'file' | 'system';
  read_at?: string;
  created_at: string;
  sender?: Employee;
}