'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';

type Employee = Database['public']['Tables']['employees']['Row'];
type ChatSession = Database['public']['Tables']['chat_sessions']['Row'] & {
  chat_messages: Database['public']['Tables']['chat_messages']['Row'][];
};

interface AIChatInterfaceProps {
  currentEmployee: Employee | null;
  initialSessions: ChatSession[];
}

interface ChatMessage {
  id: string;
  sender: 'employee' | 'ai';
  content: string;
  timestamp: Date;
  loading?: boolean;
}

export default function AIChatInterface({ currentEmployee, initialSessions }: AIChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Create a new chat session
  const createNewSession = async () => {
    if (!currentEmployee) return;

    const { data: newSession, error } = await supabase
      .from('chat_sessions')
      .insert({
        employee_id: currentEmployee.id,
        title: 'New Chat',
      })
      .select(`
        *,
        chat_messages(*)
      `)
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSession);
    setMessages([]);
  };

  // Delete a chat session
  const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      return;
    }

    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
      setMessages([]);
    }
  };

  // Send message to AI assistant
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentEmployee || !selectedSession) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessageObj: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'employee',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessageObj]);

    // Add AI loading message
    const aiLoadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      sender: 'ai',
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages(prev => [...prev, aiLoadingMessage]);

    try {
      // Save user message to database
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          sender: 'employee',
          message: userMessage,
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Call AI RAG endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: selectedSession.id,
          employeeId: currentEmployee.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.loading));

      // Add AI response to database
      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          sender: 'ai',
          message: data.response,
        })
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      // Add AI message to UI
      const aiMessageObj: ChatMessage = {
        id: aiMessageData.id,
        sender: 'ai',
        content: data.response,
        timestamp: new Date(aiMessageData.created_at),
      };

      setMessages(prev => [...prev, aiMessageObj]);

      // Update session title if it's the first message
      if (messages.length === 0) {
        const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
        await supabase
          .from('chat_sessions')
          .update({ title })
          .eq('id', selectedSession.id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          sender: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages when session changes
  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', selectedSession.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages: ChatMessage[] = messagesData.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.message,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(formattedMessages);
    };

    loadMessages();
  }, [selectedSession, supabase]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!selectedSession) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${selectedSession.id}`,
        },
        (payload) => {
          const newMessage = payload.new;
          const message: ChatMessage = {
            id: newMessage.id,
            sender: newMessage.sender,
            content: newMessage.message,
            timestamp: new Date(newMessage.created_at),
          };

          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-select first session if none selected
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, selectedSession]);

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl border border-gray-200">
      {/* Sidebar - Chat History */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewSession}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No chat history</p>
              <p className="text-sm">Start a new conversation with the AI assistant</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {session.title || 'New Chat'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {session.chat_messages[0]?.message || 'No messages yet'}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">AI HR Assistant</div>
                  <div className="text-sm text-gray-500">
                    Powered by RAG • Always learning
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How can I help you today?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Ask me about HR policies, employee information, company data, or anything else related to your workplace.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        "What's our remote work policy?",
                        "Show me team performance metrics",
                        "Explain our vacation policy",
                        "Who are the new hires this month?",
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setNewMessage(suggestion)}
                          className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'employee' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-3xl ${message.sender === 'employee' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        message.sender === 'employee' 
                          ? 'bg-primary-600' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }`}>
                        {message.sender === 'employee' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.sender === 'employee' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-2xl ${
                          message.sender === 'employee'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.loading ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>AI is thinking...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.sender === 'employee' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                  placeholder="Ask about HR policies, employee data, or company information..."
                  disabled={isLoading}
                  className="input-primary flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                AI assistant may produce inaccurate information about people, places, or facts
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}