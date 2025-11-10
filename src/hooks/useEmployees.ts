import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';

type Employee = Database['public']['Tables']['employees']['Row'];

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();

    if (error) throw error;
    if (data) setEmployees(prev => [data, ...prev]);
    return data;
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
    }
    return data;
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    refresh: fetchEmployees,
  };
}