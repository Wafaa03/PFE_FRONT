import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import { Send, Upload, ExternalLink, Plus, Trash2, MessageSquare } from "lucide-react";
import { apiFetch } from "../lib/auth";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  sources?: { title: string; reference: string; text: string }[];
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

export function AIAssistant() {
  const location = useLocation();
  const stateSessionId = location.state?.sessionId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const loadSessions = useCallback(async () => {
    try {
      const res = await apiFetch("/history/chat-history");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error("Failed to load sessions", e);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const loadSessionMessages = useCallback(async (id: number) => {
    try {
      const res = await apiFetch(`/history/chat-history/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const loaded: Message[] = data.map((m: { id: number; role: string; content: string }, idx: number) => ({
        id: idx + 1,
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
      }));
      setMessages(loaded);
      setSessionId(id);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (stateSessionId && stateSessionId !== sessionId) {
      loadSessionMessages(stateSessionId);
    }
  }, [stateSessionId, sessionId, loadSessionMessages]);

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setInputValue("");
  };

  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiFetch(`/history/chat-history/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (sessionId === id) handleNewChat();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const formatSources = (sources: any[]) => {
    const formatted = (sources || []).map((src: any) => {
      const meta = src.metadata || {};
      const sourceTitle = meta.title || meta.sheet || "Legal Document";
      let cleanText = src.text || "No content available.";
      cleanText = cleanText.replace(/^Source:.*?Article[^:]*:\s*/i, "");

      const headerParts = [];
      if (meta.website) headerParts.push(`Source: ${meta.website}`);
      if (meta.type) headerParts.push(`Type: ${meta.type}`);
      if (meta.reference) headerParts.push(`Réf: ${meta.reference}`);
      if (meta.article_number) headerParts.push(`Article ${meta.article_number}`);

      return {
        title: headerParts.length > 0 ? headerParts.join(" | ") : "Document Légal",
        reference: sourceTitle !== "Legal Document" ? sourceTitle : "",
        text: cleanText.trim(),
      };
    });

    const uniqueSources = [];
    const seenText = new Set<string>();
    for (const source of formatted) {
      if (!seenText.has(source.text)) {
        seenText.add(source.text);
        uniqueSources.push(source);
      }
    }
    return uniqueSources;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userQuery = inputValue;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, type: "user", content: userQuery },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      const body: { query: string; session_id?: number } = { query: userQuery };
      if (sessionId) body.session_id = sessionId;

      const response = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, type: "ai", content: "Error: " + data.message },
        ]);
      } else {
        if (data.session_id && !sessionId) {
          setSessionId(data.session_id);
          loadSessions();
        }

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "ai",
            content: data.answer,
            sources: formatSources(data.sources),
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          content: "Network error. Please make sure the Flask backend is running on port 5050.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFF8DC]">
      {/* Session sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD42D] text-gray-900 rounded-lg hover:bg-[#FFD42D]/90 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 mb-2">
            History
          </p>
          {loadingSessions ? (
            <p className="text-sm text-gray-400 px-2">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-400 px-2">No conversations yet</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSessionMessages(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 group flex items-start gap-2 transition-colors ${
                  sessionId === s.id
                    ? "bg-[#FFD42D]/30 text-[#806B64]"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-60" />
                <span className="text-sm truncate flex-1">{s.title || "Conversation"}</span>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-[#806B64]">AI Legal Assistant</h1>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-1">Session #{sessionId} — context is remembered</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Ask a legal question to start a conversation</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-[#AB8E51] text-white rounded-lg px-6 py-4 max-w-2xl">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4 max-w-2xl">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {message.content}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="text-sm font-medium text-gray-900 mb-3">Sources</div>
                          <div className="space-y-2">
                            {message.sources.map((source, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-3 bg-[#FFF8DC] rounded-lg"
                              >
                                <ExternalLink className="w-4 h-4 text-[#AB8E51] mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {source.title}
                                  </div>
                                  <div className="text-xs text-gray-600 mb-2">{source.reference}</div>
                                  <div className="text-xs text-gray-700 bg-white/50 p-2 rounded border border-gray-100 max-h-32 overflow-y-auto whitespace-pre-wrap">
                                    {source.text}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-500 italic">
                    <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    <span className="ml-2">Searching legal database and generating response…</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a legal question, paste a document to summarize, or request a draft response..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent resize-none"
                  rows={3}
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <Upload className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="px-6 bg-[#FFD42D] text-gray-900 rounded-lg hover:bg-[#FFD42D]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
