import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // ✅ 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ 2. Check if employee already exists
    const { data: existingEmployee, error: existingError } = await supabase
      .from('employees')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (existingError) console.error('Error checking existing employee:', existingError)
    if (existingEmployee) {
      return NextResponse.json(
        { message: 'Employee already exists', employee: existingEmployee },
        { status: 200 }
      )
    }

    // ✅ 3. Get or create company
    const companyName = user.user_metadata?.company || 'Default Company'

    let { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('name', companyName)
      .maybeSingle()

    if (companyError) console.error('Error fetching company:', companyError)

    if (!company) {
      const { data: newCompany, error: createCompanyError } = await supabase
        .from('companies')
        .insert([
          {
            name: companyName,
            industry: 'Technology',
            size_range: '1-50 employees',
          },
        ])
        .select()
        .single()

      if (createCompanyError) {
        console.error('Error creating company:', createCompanyError)
        return NextResponse.json(
          { error: 'Failed to create company' },
          { status: 500 }
        )
      }

      company = newCompany
    }

    // ✅ 4. Get or create department
    let { data: department, error: deptError } = await supabase
      .from('departments')
      .select('id')
      .eq('company_id', company.id)
      .eq('name', 'General')
      .maybeSingle()

    if (deptError) console.error('Error fetching department:', deptError)

    if (!department) {
      const { data: newDepartment, error: createDeptError } = await supabase
        .from('departments')
        .insert([
          {
            company_id: company.id,
            name: 'General',
            description: 'Default department',
          },
        ])
        .select()
        .single()

      if (createDeptError) {
        console.error('Error creating department:', createDeptError)
        return NextResponse.json(
          { error: 'Failed to create department' },
          { status: 500 }
        )
      }

      department = newDepartment
    }

    // ✅ 5. Get or create job role
    let { data: jobRole, error: jobError } = await supabase
      .from('job_roles')
      .select('id')
      .eq('department_id', department.id)
      .eq('title', 'Employee')
      .maybeSingle()

    if (jobError) console.error('Error fetching job role:', jobError)

    if (!jobRole) {
      const { data: newJobRole, error: createJobError } = await supabase
        .from('job_roles')
        .insert([
          {
            department_id: department.id,
            title: 'Employee',
            level: 'Mid',
            description: 'Default employee role',
          },
        ])
        .select()
        .single()

      if (createJobError) {
        console.error('Error creating job role:', createJobError)
        return NextResponse.json(
          { error: 'Failed to create job role' },
          { status: 500 }
        )
      }

      jobRole = newJobRole
    }

    // ✅ 6. Count employees (for generating employee ID)
    const { count: employeeCount = 0, error: countError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })

    if (countError) console.error('Error counting employees:', countError)

    // ✅ 7. Create employee record
    const employeeId = `EMP${String((employeeCount ?? 0) + 1).padStart(4, '0')}`

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          auth_user_id: user.id,
          company_id: company.id,
          employee_id: employeeId,
          first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
          last_name: user.user_metadata?.last_name || '',
          email: user.email!,
          job_role_id: jobRole.id,
          hire_date: new Date().toISOString().split('T')[0],
          employment_type: 'Full-time',
          employment_status: 'Active',
          work_location: 'Remote',
          remote_ratio: 100,
          base_salary: 60000,
          salary_currency: 'USD',
        },
      ])
      .select()
      .single()

    if (employeeError) {
      console.error('Error creating employee:', employeeError)
      return NextResponse.json(
        { error: 'Failed to create employee record' },
        { status: 500 }
      )
    }

    // ✅ 8. Return success
    return NextResponse.json(
      { message: 'Employee created successfully', employee },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unhandled error in create-employee API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
