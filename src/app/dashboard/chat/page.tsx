import { createClient } from '@/lib/supabase/server';
import AIChatInterface from './components/AIChatInterface';

export default async function ChatPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to access the AI assistant</div>;
  }

  // Get current employee
  const { data: currentEmployee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', user.id)
    .single();
console.log('Current User:', user);
    console.log('Current Employee:', currentEmployee);

  if (!currentEmployee) {
    return <div>Employee profile not found</div>;
  }

  // Get chat sessions for this user
  const { data: chatSessions } = await supabase
    .from('chat_sessions')
    .select(`
      *,
      chat_messages(*)
    `)
    .eq('employee_id', currentEmployee.id)
    .order('created_at', { ascending: false });

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
        initialSessions={chatSessions || []}
      />
    </div>
  );
}