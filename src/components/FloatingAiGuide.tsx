import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, MessageSquare, X, Send, Bot, User, Trash2, Plus,
  ChevronRight, Compass, Heart, Wind, Flame, Check
} from 'lucide-react';
import { sendAiChatMessage, type AiChatMessage } from '../lib/n8n';
import { useAuth } from '../contexts/AuthContext';
import { useStreak } from '../contexts/StreakContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  messages: AiChatMessage[];
}

export const FloatingAiGuide: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStreak } = useStreak();

  const [isOpen, setIsOpen] = useState(false);
  const [showThreadSidebar, setShowThreadSidebar] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const makeWelcomeThread = (): ChatThread[] => [
      {
        id: 'thread_initial',
        title: 'Sanctuary Welcome & Grounding',
        createdAt: new Date().toISOString(),
        messages: [
          {
            role: 'assistant',
            content: 'Hello, I am your Balance Guide. Whether you are navigating workplace tension, seeking habit clarity, or simply need a mindful pause—I am here with you. How is your inner battery holding up right now?',
          },
        ],
      },
    ];

  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  // Fetch threads and messages from Supabase on mount
  useEffect(() => {
    const fetchChatData = async () => {
      if (isSupabaseConfigured && user) {
        // 1. Fetch threads
        const { data: threadData, error: threadError } = await supabase
          .from('chat_threads')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!threadError && threadData && threadData.length > 0) {
          const loadedThreads: ChatThread[] = await Promise.all(
            threadData.map(async (t) => {
              const { data: msgData } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('thread_id', t.id)
                .order('created_at', { ascending: true });

              return {
                id: t.id,
                title: t.title,
                createdAt: t.created_at,
                messages: (msgData || []).map(m => ({
                  role: m.role as 'user' | 'assistant' | 'system',
                  content: m.content
                }))
              };
            })
          );
          setThreads(loadedThreads);
          setActiveThreadId(loadedThreads[0].id);
        } else if (!threadError) { const welcome = makeWelcomeThread(); setThreads(welcome); setActiveThreadId(welcome[0].id); }
      } else if (user) {
        try {
          const saved = JSON.parse(localStorage.getItem(`balance_ai_threads_${user.id}`) || 'null');
          const restored = Array.isArray(saved) && saved.length ? saved : makeWelcomeThread();
          setThreads(restored); setActiveThreadId(restored[0].id);
        } catch { const welcome = makeWelcomeThread(); setThreads(welcome); setActiveThreadId(welcome[0].id); }
      } else {
        setThreads([]); setActiveThreadId('');
      }
    };

    fetchChatData();
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`balance_ai_threads_${user.id}`, JSON.stringify(threads));
  }, [threads, user]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeThread?.messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputMessage).trim();
    if (!msg || loading) return;

    const userMsg: AiChatMessage = { role: 'user', content: msg };

    // Add user message to active thread
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          const isFirstMessage = t.messages.length <= 1;
          return {
            ...t,
            title: isFirstMessage ? msg.substring(0, 32) + '...' : t.title,
            messages: [...t.messages, userMsg],
          };
        }
        return t;
      })
    );

    setInputMessage('');
    setLoading(true);

    try {
      // 1. Call n8n webhook relay
      const res = await sendAiChatMessage({
        message: msg,
        history: activeThread.messages,
        userId: user?.id,
        userContext: {
          currentStreak,
          currentRhythm: 'Mindful Midday',
          recentMood: 'Balanced',
        },
      });

      const assistantMsg: AiChatMessage = {
        role: 'assistant',
        content: res.reply,
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, assistantMsg],
            };
          }
          return t;
        })
      );

      // Persist to Supabase if configured and logged in
      if (isSupabaseConfigured && user) {
        supabase.from('chat_messages').insert([
          { thread_id: activeThreadId, user_id: user.id, role: 'user', content: msg },
          { thread_id: activeThreadId, user_id: user.id, role: 'assistant', content: res.reply },
        ]);
      }
    } catch (err) {
      console.error('Error contacting AI guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewThread = async () => {
    const newId = crypto.randomUUID();
    const newThread: ChatThread = {
      id: newId,
      title: 'New Grounding Session',
      createdAt: new Date().toISOString(),
      messages: [
        {
          role: 'assistant',
          content: 'I am here with a fresh space for you. Take a soft breath. What would you like to reflect on today?',
        },
      ],
    };

    if (isSupabaseConfigured && user) {
      await supabase.from('chat_threads').insert({
        id: newId,
        user_id: user.id,
        title: newThread.title
      });
      // Also insert the initial assistant message
      await supabase.from('chat_messages').insert({
        thread_id: newId,
        user_id: user.id,
        role: 'assistant',
        content: newThread.messages[0].content
      });
    }

    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    setShowThreadSidebar(false);
  };

  const handleDeleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (threads.length <= 1) return;

    if (isSupabaseConfigured && user) {
      await supabase.from('chat_threads').delete().eq('id', id);
    }

    const remaining = threads.filter((t) => t.id !== id);
    setThreads(remaining);
    if (activeThreadId === id) {
      setActiveThreadId(remaining[0].id);
    }
  };

  const PROMPT_SUGGESTIONS = [
    'I feel overwhelmed by back-to-back meetings',
    'Guide me through a 2-minute somatic reset',
    'How do I maintain my habit streak when tired?',
    'What is the difference between stress & burnout?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-700 hover:from-sage-600 hover:to-sage-800 text-white rounded-full shadow-lift hover:scale-105 transition-all duration-200"
          aria-label="Open Balance Guide"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-white animate-pulse" />
          </div>
          <span className="font-heading font-bold text-xs tracking-wide">
            Ask Balance Guide
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
            n8n AI
          </span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-ink-900 border border-sage-200/80 dark:border-ink-700 rounded-3xl shadow-lift flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-linen-100 dark:bg-ink-950 border-b border-sage-200/70 dark:border-ink-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowThreadSidebar(!showThreadSidebar)}
                className="p-1.5 rounded-xl hover:bg-sage-200/60 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200 transition"
                title="Toggle Conversations"
              >
                <Compass className="w-4 h-4 text-sage-600 dark:text-sage-400" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
                    Balance Guide
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-ink-700/60 dark:text-linen-200/60 flex items-center gap-1">
                  Empathetic Wellness AI • n8n Webhook
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCreateNewThread}
                className="p-1.5 rounded-xl hover:bg-sage-200/60 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200 transition"
                title="New Chat Session"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-sage-200/60 dark:hover:bg-ink-800 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body with Thread Sidebar Drawer */}
          <div className="relative flex-1 flex overflow-hidden">
            {/* Thread Sidebar */}
            {showThreadSidebar && (
              <div className="absolute inset-y-0 left-0 w-3/4 bg-linen-50 dark:bg-ink-950 border-r border-sage-200 dark:border-ink-800 z-20 flex flex-col p-3 animate-in slide-in-from-left duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-sage-200/60 dark:border-ink-800 text-xs font-bold font-heading text-ink-900 dark:text-linen-100">
                  <span>Chat Sessions</span>
                  <button
                    onClick={handleCreateNewThread}
                    className="p-1 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-ink-800 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5">
                  {threads.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setShowThreadSidebar(false);
                      }}
                      className={`group flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                        t.id === activeThreadId
                          ? 'bg-sage-500 text-white font-bold'
                          : 'hover:bg-sage-100 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200'
                      }`}
                    >
                      <span className="truncate pr-2">{t.title}</span>
                      {threads.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteThread(t.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-300 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {activeThread.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-950 text-sage-600 dark:text-sage-300 flex items-center justify-center shrink-0 mt-0.5 border border-sage-200/60">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-sage-500 text-white rounded-br-none shadow-soft'
                        : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-100 rounded-bl-none border border-sage-200/50 dark:border-ink-700'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-ink-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-center text-xs text-ink-700/60 dark:text-linen-200/60">
                  <div className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-950 text-sage-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-linen-100 dark:bg-ink-800 px-3 py-2 rounded-2xl rounded-bl-none border border-sage-200/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse delay-150" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Prompt Chips */}
          <div className="px-3 pt-2 pb-1 bg-white dark:bg-ink-900 border-t border-sage-100 dark:border-ink-800 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="inline-block px-2.5 py-1 rounded-full bg-linen-100 dark:bg-ink-800 hover:bg-sage-100 dark:hover:bg-ink-700 text-[10px] font-medium text-ink-800 dark:text-linen-200 border border-sage-200/60 dark:border-ink-700 transition shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-ink-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for guidance, somatic tips, focus advice..."
              className="flex-1 px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-2xl text-xs text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white transition shadow-soft"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
