import { createClient } from '@/lib/supabase/client';

export async function getChatHistory(employeeId: string, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_sessions')
    .select(`
      *,
      chat_messages(*)
    `)
    .eq('participant1_id', employeeId)
    .eq('session_type', 'ai_assistant')
    .order('last_message_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function clearChatHistory(sessionId: string) {
  const supabase = createClient();

  // Delete all messages in the session
  const { error: messagesError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('chat_session_id', sessionId);

  if (messagesError) throw messagesError;

  // Delete the session
  const { error: sessionError } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (sessionError) throw sessionError;
}

export async function updateSessionTitle(sessionId: string, title: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('chat_sessions')
    .update({ title })
    .eq('id', sessionId);

  if (error) throw error;
}