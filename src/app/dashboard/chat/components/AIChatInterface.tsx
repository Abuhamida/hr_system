'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Plus, Trash2, Loader2, Brain } from 'lucide-react';
import type { Employee, ChatSession, ChatMessage as ChatMessageType } from '@/lib/types';
import { getChatbotResponse } from '@/services/geminiService';
import { createClient } from '@/lib/supabase/client';

interface AIChatInterfaceProps {
  currentEmployee: Employee | null;
  initialSessions: ChatSession[];
  employees: Employee[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  loading?: boolean;
}

export default function AIChatInterface({
  currentEmployee,
  initialSessions,
  employees,
}: AIChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Initialize chat session
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
    setIsInitializing(false);
  }, [sessions, selectedSession]);

  // Create a new chat session
  const createNewSession = async () => {
    if (!currentEmployee) return;

    const { data: newSession, error } = await supabase
      .from("chat_sessions")
      .insert({
        employee_id: currentEmployee.id,
        title: "New Chat",
      })
      .select(`
        *,
        chat_messages(*)
      `)
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return;
    }

    setSessions((prev) => [newSession, ...prev]);
    setSelectedSession(newSession);
    setMessages([]);
  };

  // Delete a chat session
  const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      console.error("Error deleting session:", error);
      return;
    }

    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    if (selectedSession?.id === sessionId) {
      setSelectedSession(sessions.find(s => s.id !== sessionId) || null);
    }
  };

  // Send message to AI assistant
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentEmployee || !selectedSession) return;

    const userMessage = newMessage.trim();
    setNewMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessageObj: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessageObj]);

    // Save user message to database
    const { data: userMessageData, error: userMessageError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: selectedSession.id,
        sender: 'user',
        message: userMessage,
      })
      .select()
      .single();

    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
    }

    // Add AI loading message
    const aiLoadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      sender: 'ai',
      content: "",
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, aiLoadingMessage]);

    try {
      // Get AI response using your existing service
      const response = await getChatbotResponse.getResponse(userMessage, employees);

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => !msg.loading));

      // Add AI response to database
      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: selectedSession.id,
          sender: 'ai',
          message: response,
        })
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      // Add AI message to UI
      const aiMessageObj: ChatMessage = {
        id: aiMessageData.id,
        sender: 'ai',
        content: response,
        timestamp: new Date(aiMessageData.created_at),
      };

      setMessages((prev) => [...prev, aiMessageObj]);

      // Update session title if it's the first message
      if (messages.length === 0) {
        const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "");
        await supabase
          .from("chat_sessions")
          .update({ title })
          .eq("id", selectedSession.id);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove loading message and show error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.loading);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          sender: 'ai',
          content: "Sorry, I encountered an error. Please try again.",
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
        .from("chat_messages")
        .select("*")
        .eq("session_id", selectedSession.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      const formattedMessages: ChatMessage[] = messagesData.map((msg) => ({
        id: msg.id,
        sender: msg.sender as 'user' | 'ai',
        content: msg.message,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(formattedMessages);
    };

    loadMessages();
  }, [selectedSession, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        sendMessage();
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initializing chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md">
      {/* Sidebar - Chat History */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewSession}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No chat history</p>
              <p className="text-sm">
                Start a new conversation with the AI assistant
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? "bg-primary-50 border border-primary-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {session.title || "New Chat"}
                      </div>
                      {/* <div className="text-xs text-gray-500 truncate">
                        {session.chat_messages?.[0]?.message || "No messages yet"}
                      </div> */}
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
                </motion.div>
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
            <div className="p-6 border-b border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">HR AI Agent</h3>
                  <p className="text-sm text-gray-600">Ask me anything about your employee data</p>
                </div>
              </motion.div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
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
                          "List employees with attrition risk",
                          "Show employee performance rankings",
                          "Get details for employee #1001",
                          "Suggest HR actions for my team",
                        ].map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setNewMessage(suggestion)}
                            className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' ? 'bg-primary-600' : 'bg-gray-200'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-primary-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          {message.loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3"
              >
                <div className="flex-grow relative">
                  <textarea
                    rows={1}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-50 dark:border-gray-200 dark:text-gray-900 resize-none"
                    placeholder="e.g., 'List employees with attrition risk'"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    style={{
                      minHeight: '48px',
                      maxHeight: '120px',
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendMessage}
                  className="p-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                  disabled={isLoading || newMessage.trim() === ''}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
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