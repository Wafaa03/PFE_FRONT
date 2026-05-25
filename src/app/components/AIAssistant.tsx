import { useState } from "react";
import { Send, Upload, ExternalLink } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  sources?: { title: string; reference: string }[];
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userQuery = inputValue;
    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: userQuery,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, type: "ai", content: "Error: " + data.message },
        ]);
      } else {
        const formattedSources = (data.sources || []).map((src: any) => {
          const meta = src.metadata || {};
          const sourceTitle = meta.title || meta.sheet || meta.website || "Legal Document";
          return {
            title: `${meta.type || "Doc"} - ${sourceTitle}`,
            reference: meta.article_number ? `Article ${meta.article_number}` : "Full Document",
            text: src.text || "No content available."
          };
        });

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "ai",
            content: data.answer,
            sources: formattedSources,
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
          content: "Network error. Please make sure the Flask backend is running on port 5000.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF8DC]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#806B64]">AI Legal Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scroll-smooth px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
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

                    {/* Sources */}
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
                  <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#AB8E51] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2">Searching legal database and generating response...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
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
              className="px-6 bg-[#FFD42D] text-gray-900 rounded-lg hover:bg-[#FFD42D]/90 transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
