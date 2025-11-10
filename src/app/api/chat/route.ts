import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, employeeId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get relevant context from your RAG system
    const ragContext = await getRAGContext(message, employeeId);

    // Call your AI model (replace with your actual AI service)
    const aiResponse = await generateAIResponse(message, ragContext);

    return NextResponse.json({
      response: aiResponse,
      context: ragContext, // Optional: for debugging
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock RAG context function - replace with your actual RAG implementation
async function getRAGContext(query: string, employeeId: string) {
  const supabase = await createClient();

  // Example: Search relevant HR policies
  const { data: policies } = await supabase
    .from('documents')
    .select('*')
    .textSearch('content', query)
    .limit(3);

  // Example: Get employee data if query is about employees
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .limit(5);

  // Example: Get company information
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .limit(1);

  return {
    policies: policies || [],
    employees: employees || [],
    company: company?.[0] || null,
    timestamp: new Date().toISOString(),
  };
}

// Mock AI response generation - replace with your actual AI service
async function generateAIResponse(userMessage: string, context: any) {
  // This is where you'd integrate with your AI service (OpenAI, Anthropic, etc.)
  // For now, returning a mock response based on context

  const { policies, employees, company } = context;

  // Simple response logic - replace with actual AI model call
  if (userMessage.toLowerCase().includes('policy') && policies.length > 0) {
    return `Based on our HR policies, I found ${policies.length} relevant documents. ${policies[0]?.description || 'Please refer to the HR handbook for detailed information.'}`;
  }

  if (userMessage.toLowerCase().includes('employee') && employees.length > 0) {
    const employeeNames = employees.map((emp: any) => `${emp.first_name} ${emp.last_name}`).join(', ');
    return `I found ${employees.length} employees matching your query: ${employeeNames}. They are part of our organization.`;
  }

  if (userMessage.toLowerCase().includes('company') && company) {
    return `Our company ${company.name} is located at ${company.address}. You can contact us at ${company.phone} or ${company.email}.`;
  }

  // Default response
  return `Thank you for your question about "${userMessage}". I've analyzed our HR data and company information to provide you with the most accurate response. Based on my search through our policies and employee database, I can help you with this. Is there anything specific you'd like to know about our HR policies or employee information?`;
}