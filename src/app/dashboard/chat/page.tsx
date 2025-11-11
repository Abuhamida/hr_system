'use client';

import { createClient } from '@/lib/supabase/client';
import AIChatInterface from './components/AIChatInterface';
import type { Employee } from '@/lib/types';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        // Get current employee
        const { data: employee } = await supabase
          .from('employees')
          .select('*')
          .eq('id', user.id) // or 'employee_id'
          .single();

        setCurrentEmployee(employee || null);

        // Get employees list
        const employeesRes = await fetch('/api/employees');
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);

        // Get chat sessions
        const { data: sessions } = await supabase
          .from('chat_sessions')
          .select('*, chat_messages(*)')
          .eq('employee_id', employee?.id)
          .order('created_at', { ascending: false });

        setChatSessions(sessions || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to access the AI assistant</div>;
  if (!currentEmployee) return <div>Employee profile not found</div>;

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI HR Assistant</h1>
          <p className="text-gray-600 mt-2">
            Get instant answers about HR policies, employee data, and company information
          </p>
        </div>
      </div>

      <AIChatInterface 
        currentEmployee={currentEmployee}
        initialSessions={chatSessions}
        employees={employees}
      />
    </div>
  );
}
