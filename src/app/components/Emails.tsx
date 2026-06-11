import { useState, useEffect } from "react";
import { Send, Sparkles, Copy, Check, Loader2, Mail, MessageSquare, History } from "lucide-react";
import { apiFetch } from "../lib/auth";

interface EmailHistoryItem {
  id: number;
  original_email: string;
  suggested_reply: string;
  timestamp: string;
}

export function Emails() {
  const [emailInput, setEmailInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<EmailHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/email-history");
        if (res.ok) setHistory(await res.json());
      } catch (e) {
        console.error("Failed to load email history", e);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, []);

  const handleGenerate = async () => {
    if (!emailInput.trim()) return;
    setLoading(true);
    setSuggestion("");

    try {
      const response = await apiFetch("/api/email-suggest", {
        method: "POST",
        body: JSON.stringify({ email_body: emailInput }),
      });

      const data = await response.json();
      setSuggestion(data.answer || "");

      // Refresh history
      const histRes = await apiFetch("/api/email-history");
      if (histRes.ok) setHistory(await histRes.json());
    } catch (err) {
      console.error("Suggestion fetch failed", err);
      setSuggestion("[Error generating suggestion. Make sure the backend is running.]");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (item: EmailHistoryItem) => {
    setEmailInput(item.original_email);
    setSuggestion(item.suggested_reply);
    setShowHistory(false);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-[#FFF8DC] to-[#F5F0E0]">
      {/* Left Panel — Email Input */}
      <div className="w-1/2 p-6 flex flex-col border-r border-[#E8DCC8]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#AB8E51] to-[#806B64] flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Paste Your Email</h2>
              <p className="text-xs text-gray-500">Paste the email you received and get a professional reply suggestion</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D4C9B0] bg-white text-sm text-gray-700 hover:bg-gray-50"
          >
            <History className="w-4 h-4" />
            History ({history.length})
          </button>
        </div>

        {showHistory && (
          <div className="mb-4 max-h-48 overflow-y-auto rounded-xl border border-[#D4C9B0] bg-white shadow-sm">
            {loadingHistory ? (
              <p className="p-4 text-sm text-gray-400">Loading…</p>
            ) : history.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">No past suggestions</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-[#FFF8DC] transition-colors"
                >
                  <p className="text-sm text-gray-800 truncate">
                    {item.original_email.slice(0, 120)}{item.original_email.length > 120 ? "…" : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : ""}
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={"Paste the email you received here...\n\nExample:\nDear Legal Team,\n\nWe need your review on the Q1 2026 compliance documentation..."}
            className="flex-1 w-full p-5 border border-[#D4C9B0] rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB8E51] focus:border-transparent resize-none text-gray-700 leading-relaxed placeholder:text-gray-400 placeholder:leading-relaxed"
            style={{ minHeight: "300px" }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !emailInput.trim()}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "linear-gradient(135deg, #9a8a6a, #7a6a5a)"
                : "linear-gradient(135deg, #AB8E51, #806B64)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating suggestion...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Reply Suggestion
              </>
            )}
          </button>

          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[#AB8E51]/10 border border-[#AB8E51]/20">
            <span className="text-xs text-[#806B64] leading-relaxed">
              🔒 <strong>Privacy:</strong> PII is anonymized server-side before the Groq API call and restored in the final suggestion.
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel — Generated Suggestion */}
      <div className="w-1/2 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD42D] to-[#F0C020] flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Suggested Reply</h2>
              <p className="text-xs text-gray-500">AI-generated professional response</p>
            </div>
          </div>

          {suggestion && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D4C9B0] text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 rounded-xl border border-[#D4C9B0] bg-white shadow-sm overflow-hidden flex flex-col">
          {suggestion ? (
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {suggestion}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FFD42D]/20 to-[#AB8E51]/10 flex items-center justify-center">
                  <Send className="w-8 h-8 text-[#AB8E51]/50" />
                </div>
                <p className="text-gray-400 font-medium">No suggestion yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Paste an email on the left and click &quot;Generate Reply Suggestion&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
