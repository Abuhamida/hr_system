import { createClient } from './client'

export async function initializeChatSession(userId: string) {
  const supabase = createClient()
  
  // Create a new chat session
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert([
      {
        employee_id: userId,
        session_title: 'New Chat'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating chat session:', error)
    throw error
  }

  // Add welcome message
  const welcomeMessage = {
    session_id: session.id,
    message_text: "Hello! I'm your HR AI assistant. I can help you with employee data, attrition predictions, policy questions, and more. What would you like to know?",
    is_user_message: false,
    referenced_documents: { type: 'welcome' }
  }

  const { error: messageError } = await supabase
    .from('chat_messages')
    .insert([welcomeMessage])

  if (messageError) {
    console.error('Error adding welcome message:', messageError)
  }

  return session
}

export async function getOrCreateActiveSession(userId: string) {
  const supabase = createClient()
  
  // Try to get the most recent active session
  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('employee_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching sessions:', error)
    throw error
  }

  if (sessions && sessions.length > 0) {
    return sessions[0]
  }

  // Create a new session if none exists
  return await initializeChatSession(userId)
}