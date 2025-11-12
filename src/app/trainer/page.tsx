"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { loadChatConversationFromFirestore, syncChatConversationToFirestore } from "@/lib/firestore";
import { nanoid } from "nanoid";
import type { ChatMessage, ChatConversation } from "@/lib/types";
import { Send, Loader2, Sparkles } from "lucide-react";

export default function TrainerPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    if (!user) return;

    const loadConversation = async () => {
      try {
        const conversation = await loadChatConversationFromFirestore(user.uid);
        if (conversation && conversation.messages.length > 0) {
          setMessages(conversation.messages);
          setConversationId(conversation.id);
        } else {
          // Create new conversation
          const newId = nanoid();
          setConversationId(newId);
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            id: nanoid(),
            role: "assistant",
            content: "Hi! I'm Your Personal Trainer. I'm here to help you with fitness, nutrition, training, and diet questions. What would you like to know?",
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        const newId = nanoid();
        setConversationId(newId);
        const welcomeMessage: ChatMessage = {
          id: nanoid(),
          role: "assistant",
          content: "Hi! I'm Your Personal Trainer. I'm here to help you with fitness, nutrition, training, and diet questions. What would you like to know?",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      } finally {
        setInitialLoad(false);
      }
    };

    loadConversation();
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save conversation to Firestore when messages change
  useEffect(() => {
    if (!user || !conversationId || initialLoad || messages.length === 0) return;

    const saveConversation = async () => {
      try {
        const conversation: ChatConversation = {
          id: conversationId,
          userId: user.uid,
          messages,
          createdAt: messages[0]?.timestamp || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await syncChatConversationToFirestore(user.uid, conversation);
      } catch (error) {
        console.error("Error saving conversation:", error);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveConversation, 1000);
    return () => clearTimeout(timeoutId);
  }, [messages, user, conversationId, initialLoad]);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.message) {
        throw new Error("No message in response");
      }
      
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: `Sorry, I'm having trouble responding right now. ${error.message || "Please try again later."}`,
        timestamp: new Date().toISOString(),
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <AuthGuard>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] animate-fadeIn">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Your Personal Trainer
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Your AI fitness and nutrition coach
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Messages container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          >
            {initialLoad ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  <div className="text-sm text-neutral-400">Loading conversation...</div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <div className="text-sm text-neutral-400">Start a conversation with your trainer</div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mt-1">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white"
                          : "bg-neutral-800/80 text-neutral-100 border border-neutral-700/50"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1.5 px-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center mt-1 text-white text-sm font-semibold">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="bg-neutral-800/80 rounded-2xl px-4 py-3 border border-neutral-700/50 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-neutral-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-neutral-800/50 bg-neutral-900/30 p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask your trainer a question..."
                  className="w-full bg-neutral-950/50 border border-neutral-700/50 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none transition-all overflow-y-auto"
                  rows={1}
                  disabled={loading}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 disabled:hover:shadow-none"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 ml-1">
              Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
