import { createClient } from './client'

export interface DashboardStats {
  totalEmployees: number;
  highRiskEmployees: number;
  avgSatisfaction: number;
  attritionRate: number;
}

export interface HighRiskEmployee {
  id: string;
  employees: {
    first_name: string;
    last_name: string;
    job_roles: {
      title: string;
    } | null;
  };
  risk_level: string;
  prediction_date: string;
}

export async function getEmployees() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        job_roles (
          title,
          departments (
            name
          )
        ),
        manager:employees!employees_manager_id_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching employees:', error)
    return []
  }
}

export async function getEmployeeById(id: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        job_roles (
          title,
          level,
          departments (
            name,
            id
          )
        ),
        manager:employees!employees_manager_id_fkey(first_name, last_name, email),
        performance_reviews (
          id,
          review_date,
          performance_rating,
          key_strengths,
          development_areas,
          goals,
          reviewer:employees!performance_reviews_reviewer_id_fkey(first_name, last_name)
        ),
        employee_skills (
          id,
          proficiency_level,
          years_of_experience,
          skills (
            name,
            category
          )
        ),
        attrition_predictions (
          id,
          prediction_date,
          attrition_risk_score,
          risk_category,
          key_factors
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching employee by ID:', error)
    return null
  }
}

export async function getAttritionPredictions(): Promise<HighRiskEmployee[]> {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('attrition_predictions')
      .select(`
        id,
        risk_category,
        prediction_date,
        employees (
          first_name,
          last_name,
          job_roles (
            title
          )
        )
      `)
      .in('risk_category', ['High', 'Critical'])
      .order('prediction_date', { ascending: false })
      .limit(10)

    if (error) throw error

    // Transform data to match HighRiskEmployee interface
    return (data || []).map((item: any) => {
      const emp = Array.isArray(item.employees) ? item.employees[0] : item.employees
      return {
        id: item.id,
        risk_level: item.risk_category,
        prediction_date: item.prediction_date,
        employees: {
          first_name: emp?.first_name || 'Unknown',
          last_name: emp?.last_name || 'Employee',
          job_roles: emp?.job_roles || null
        }
      }
    })
  } catch (error) {
    console.error('Error fetching attrition predictions:', error)
    return []
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()
  
  try {
    // Total active employees
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('id, employment_status')
      .eq('employment_status', 'Active')

    // High risk employees from attrition predictions
    const { data: highRisk, error: riskError } = await supabase
      .from('attrition_predictions')
      .select(`
        id,
        risk_category,
        employees!inner (
          employment_status
        )
      `)
      .in('risk_category', ['High', 'Critical'])
      .eq('employees.employment_status', 'Active')

    // Average satisfaction from surveys
    const { data: satisfaction, error: satisfactionError } = await supabase
      .from('employee_surveys')
      .select('job_satisfaction')
      .order('survey_date', { ascending: false })
      .limit(100)

    // Get attrition events for current year to calculate attrition rate
    const currentYear = new Date().getFullYear()
    const startOfYear = `${currentYear}-01-01`
    
    const { data: attritionEvents, error: attritionError } = await supabase
      .from('attrition_events')
      .select('id')
      .gte('event_date', startOfYear)

    if (employeesError) {
      console.error('Error fetching employees:', employeesError)
    }
    if (riskError) {
      console.error('Error fetching high risk employees:', riskError)
    }
    if (satisfactionError) {
      console.error('Error fetching satisfaction data:', satisfactionError)
    }
    if (attritionError) {
      console.error('Error fetching attrition events:', attritionError)
    }

    const totalEmployees = employees?.length || 0
    const highRiskEmployees = highRisk?.length || 0
    
    // Calculate average satisfaction (1-5 scale)
    let avgSatisfaction = 0
    if (satisfaction && satisfaction.length > 0) {
      const totalSatisfaction = satisfaction.reduce((acc, curr) => {
        return acc + (curr.job_satisfaction || 0)
      }, 0)
      avgSatisfaction = Number((totalSatisfaction / satisfaction.length).toFixed(1))
    }

    // Calculate actual attrition rate
    let attritionRate = 8.2 // Default fallback
    if (totalEmployees > 0 && attritionEvents) {
      attritionRate = Number(((attritionEvents.length / totalEmployees) * 100).toFixed(1))
    }

    return {
      totalEmployees,
      highRiskEmployees,
      avgSatisfaction,
      attritionRate
    }
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    return {
      totalEmployees: 0,
      highRiskEmployees: 0,
      avgSatisfaction: 0,
      attritionRate: 0
    }
  }
}

export async function getDepartments() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        job_roles (
          employees (
            id
          )
        )
      `)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching departments:', error)
    return []
  }
}

export async function createEmployee(employeeData: any) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating employee:', error)
    throw error
  }
}

export async function updateEmployee(id: string, employeeData: any) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating employee:', error)
    throw error
  }
}

// Additional utility queries
export async function getAllAttritionPredictions() {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('attrition_predictions')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          email,
          job_roles (
            title,
            departments (
              name
            )
          )
        )
      `)
      .order('prediction_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching all predictions:', error)
    return []
  }
}

export async function getEmployeeSkills(employeeId: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('employee_skills')
      .select(`
        *,
        skills (
          name,
          category,
          description
        )
      `)
      .eq('employee_id', employeeId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching employee skills:', error)
    return []
  }
}

export async function getPerformanceReviews(employeeId: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('performance_reviews')
      .select(`
        *,
        reviewer:employees!performance_reviews_reviewer_id_fkey(
          first_name,
          last_name,
          email
        )
      `)
      .eq('employee_id', employeeId)
      .order('review_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching performance reviews:', error)
    return []
  }
}