import { useState } from "react";
import { Send, Sparkles, Copy, Check, Loader2, Mail, MessageSquare } from "lucide-react";

export function Emails() {
  const [emailInput, setEmailInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extractedNames, setExtractedNames] = useState<string[]>([]);

  // Privacy layer: extract names before sending
  const extractNames = (text: string): string[] => {
    const namePattern = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g;
    const matches = text.match(namePattern);
    return matches ? Array.from(new Set(matches)) : [];
  };

  // Redact personal info before sending to LLM
  const redactForPrivacy = (text: string): string => {
    let redacted = text.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "[REDACTED_EMAIL]"
    );
    redacted = redacted.replace(
      /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g,
      "[REDACTED_NAME]"
    );
    return redacted;
  };

  // Restore names in the LLM response
  const restoreNames = (text: string, names: string[]): string => {
    let restored = text;
    let nameIndex = 0;
    restored = restored.replace(/\[REDACTED_NAME\]/g, () => {
      if (nameIndex < names.length) {
        return names[nameIndex++];
      }
      return "[Name]";
    });
    return restored;
  };

  const handleGenerate = async () => {
    if (!emailInput.trim()) return;
    setLoading(true);
    setSuggestion("");

    try {
      // Step 1: Extract names for privacy
      const names = extractNames(emailInput);
      setExtractedNames(names);

      // Step 2: Redact personal info before sending to LLM
      const redactedEmail = redactForPrivacy(emailInput);

      // Step 3: Send redacted email to backend
      const response = await fetch("http://127.0.0.1:5000/api/email-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_body: redactedEmail }),
      });

      const data = await response.json();
      const rawAnswer = data.answer || "";

      // Step 4: Restore names in the response
      const restoredAnswer = restoreNames(rawAnswer, names);
      setSuggestion(restoredAnswer);
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

  return (
    <div className="flex h-full bg-gradient-to-br from-[#FFF8DC] to-[#F5F0E0]">
      {/* Left Panel — Email Input */}
      <div className="w-1/2 p-6 flex flex-col border-r border-[#E8DCC8]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#AB8E51] to-[#806B64] flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Paste Your Email</h2>
            <p className="text-xs text-gray-500">Paste the email you received and get a professional reply suggestion</p>
          </div>
        </div>

        {/* Email Input Area */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Paste the email you received here...&#10;&#10;Example:&#10;Dear Legal Team,&#10;&#10;We need your review on the Q1 2026 compliance documentation..."
            className="flex-1 w-full p-5 border border-[#D4C9B0] rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB8E51] focus:border-transparent resize-none text-gray-700 leading-relaxed placeholder:text-gray-400 placeholder:leading-relaxed"
            style={{ minHeight: "300px" }}
          />

          {/* Generate Button */}
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

          {/* Privacy Notice */}
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[#AB8E51]/10 border border-[#AB8E51]/20">
            <span className="text-xs text-[#806B64] leading-relaxed">
              🔒 <strong>Privacy:</strong> Names and email addresses are automatically redacted before being sent to the AI. They are restored in the final suggestion.
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel — Generated Suggestion */}
      <div className="w-1/2 p-6 flex flex-col">
        {/* Header */}
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

        {/* Suggestion Display */}
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

        {/* Extracted Names Info */}
        {extractedNames.length > 0 && suggestion && (
          <div className="mt-3 p-3 rounded-lg bg-white border border-[#D4C9B0] shadow-sm">
            <p className="text-xs font-medium text-gray-600 mb-1">🏷️ Detected Names (restored in reply):</p>
            <div className="flex flex-wrap gap-2">
              {extractedNames.map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-md bg-[#AB8E51]/10 text-[#806B64] border border-[#AB8E51]/20"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
