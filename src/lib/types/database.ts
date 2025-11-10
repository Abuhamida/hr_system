export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          manager_id: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          manager_id?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          manager_id?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_roles: {
        Row: {
          id: string;
          department_id: string;
          title: string;
          description: string | null;
          salary_range_min: number | null;
          salary_range_max: number | null;
          requirements: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          title: string;
          description?: string | null;
          salary_range_min?: number | null;
          salary_range_max?: number | null;
          requirements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          title?: string;
          description?: string | null;
          salary_range_min?: number | null;
          salary_range_max?: number | null;
          requirements?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          auth_user_id: string | null;
          company_id: string;
          department_id: string | null;
          job_role_id: string | null;
          employee_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          hire_date: string;
          termination_date: string | null;
          salary: number | null;
          employment_type: "full_time" | "part_time" | "contract" | "intern";
          status: "active" | "on_leave" | "terminated" | "resigned";
          manager_id: string | null;
          date_of_birth: string | null;
          gender: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          company_id?: string;
          department_id?: string | null;
          job_role_id?: string | null;
          employee_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          hire_date?: string;
          termination_date?: string | null;
          salary?: number | null;
          employment_type?: "full_time" | "part_time" | "contract" | "intern";
          status?: "active" | "on_leave" | "terminated" | "resigned";
          manager_id?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          company_id?: string;
          department_id?: string | null;
          job_role_id?: string | null;
          employee_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          hire_date?: string;
          termination_date?: string | null;
          salary?: number | null;
          employment_type?: "full_time" | "part_time" | "contract" | "intern";
          status?: "active" | "on_leave" | "terminated" | "resigned";
          manager_id?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      performance_reviews: {
        Row: {
          id: string;
          employee_id: string;
          reviewer_id: string;
          review_date: string;
          rating: number | null;
          strengths: string | null;
          areas_for_improvement: string | null;
          goals: string | null;
          comments: string | null;
          status: "draft" | "submitted" | "approved";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          reviewer_id: string;
          review_date?: string;
          rating?: number | null;
          strengths?: string | null;
          areas_for_improvement?: string | null;
          goals?: string | null;
          comments?: string | null;
          status?: "draft" | "submitted" | "approved";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          reviewer_id?: string;
          review_date?: string;
          rating?: number | null;
          strengths?: string | null;
          areas_for_improvement?: string | null;
          goals?: string | null;
          comments?: string | null;
          status?: "draft" | "submitted" | "approved";
          created_at?: string;
          updated_at?: string;
        };
      };
      employee_surveys: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          survey_data: Json;
          created_by: string | null;
          start_date: string;
          end_date: string;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          survey_data: Json;
          created_by?: string | null;
          start_date: string;
          end_date: string;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          survey_data?: Json;
          created_by?: string | null;
          start_date?: string;
          end_date?: string;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employee_skills: {
        Row: {
          id: string;
          employee_id: string;
          skill_id: string;
          proficiency_level: number | null;
          years_of_experience: number | null;
          certified: boolean;
          certification_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          skill_id: string;
          proficiency_level?: number | null;
          years_of_experience?: number | null;
          certified?: boolean;
          certification_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          skill_id?: string;
          proficiency_level?: number | null;
          years_of_experience?: number | null;
          certified?: boolean;
          certification_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      training_programs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          provider: string | null;
          duration_hours: number | null;
          cost: number | null;
          skill_category: string | null;
          status: "active" | "inactive" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          provider?: string | null;
          duration_hours?: number | null;
          cost?: number | null;
          skill_category?: string | null;
          status?: "active" | "inactive" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          provider?: string | null;
          duration_hours?: number | null;
          cost?: number | null;
          skill_category?: string | null;
          status?: "active" | "inactive" | "completed";
          created_at?: string;
          updated_at?: string;
        };
      };
      employee_training: {
        Row: {
          id: string;
          employee_id: string;
          training_program_id: string;
          enrollment_date: string;
          completion_date: string | null;
          status: "enrolled" | "in_progress" | "completed" | "cancelled";
          score: number | null;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          training_program_id: string;
          enrollment_date?: string;
          completion_date?: string | null;
          status?: "enrolled" | "in_progress" | "completed" | "cancelled";
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          training_program_id?: string;
          enrollment_date?: string;
          completion_date?: string | null;
          status?: "enrolled" | "in_progress" | "completed" | "cancelled";
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attrition_features: {
        Row: {
          id: string;
          employee_id: string;
          feature_date: string;
          satisfaction_level: number | null;
          last_evaluation: number | null;
          number_of_projects: number | null;
          average_monthly_hours: number | null;
          time_spent_company_years: number | null;
          work_accident: boolean;
          promotion_last_5years: boolean;
          salary_level: "low" | "medium" | "high" | null;
          department: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          feature_date?: string;
          satisfaction_level?: number | null;
          last_evaluation?: number | null;
          number_of_projects?: number | null;
          average_monthly_hours?: number | null;
          time_spent_company_years?: number | null;
          work_accident?: boolean;
          promotion_last_5years?: boolean;
          salary_level?: "low" | "medium" | "high" | null;
          department?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          feature_date?: string;
          satisfaction_level?: number | null;
          last_evaluation?: number | null;
          number_of_projects?: number | null;
          average_monthly_hours?: number | null;
          time_spent_company_years?: number | null;
          work_accident?: boolean;
          promotion_last_5years?: boolean;
          salary_level?: "low" | "medium" | "high" | null;
          department?: string | null;
          created_at?: string;
        };
      };
      attrition_predictions: {
        Row: {
          id: string;
          employee_id: string;
          prediction_date: string;
          attrition_probability: number | null;
          prediction: boolean;
          confidence_level: number | null;
          risk_level: "low" | "medium" | "high" | "critical" | null;
          explanation: string | null;
          model_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          prediction_date?: string;
          attrition_probability?: number | null;
          prediction: boolean;
          confidence_level?: number | null;
          risk_level?: "low" | "medium" | "high" | "critical" | null;
          explanation?: string | null;
          model_version?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          prediction_date?: string;
          attrition_probability?: number | null;
          prediction?: boolean;
          confidence_level?: number | null;
          risk_level?: "low" | "medium" | "high" | "critical" | null;
          explanation?: string | null;
          model_version?: string | null;
          created_at?: string;
        };
      };
      attrition_events: {
        Row: {
          id: string;
          employee_id: string;
          event_date: string;
          event_type: "resignation" | "termination" | "retirement" | "layoff";
          reason: string | null;
          exit_interview_notes: string | null;
          rehire_eligible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          event_date?: string;
          event_type: "resignation" | "termination" | "retirement" | "layoff";
          reason?: string | null;
          exit_interview_notes?: string | null;
          rehire_eligible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          event_date?: string;
          event_type?: "resignation" | "termination" | "retirement" | "layoff";
          reason?: string | null;
          exit_interview_notes?: string | null;
          rehire_eligible?: boolean;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          employee_id: string;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          description: string | null;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          description?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          document_type?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          description?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          employee_id: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          title?: string | null;
          created_at?: string;
        };
      };

      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          sender: "employee" | "ai";
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          sender: "employee" | "ai";
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          sender?: "employee" | "ai";
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_employee_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_user_department: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_hr: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      update_chat_session_last_message: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
