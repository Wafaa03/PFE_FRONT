import { useState, useEffect } from "react";
import { Mail, FileText, BookOpen, Activity, Search, Sparkles, MessageSquare, Clock, ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { apiFetch } from "../lib/auth";

export function Home() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [emailCount, setEmailCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch real chat sessions from the backend
        const chatRes = await apiFetch("/history/chat-history");
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChatHistory(chatData || []);
        }

        // Fetch emails drafted
        const emailRes = await apiFetch("/api/email-history");
        if (emailRes.ok) {
          const emailData = await emailRes.json();
          setEmailCount(emailData.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch real data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const summaryCards = [
    { title: "Total Emails Drafted", value: isLoading ? "-" : emailCount.toString(), icon: Mail, color: "#FFD42D", bg: "from-[#FFD42D]/20 to-[#FFD42D]/5" },
    { title: "Total Chat Sessions", value: isLoading ? "-" : chatHistory.length.toString(), icon: MessageSquare, color: "#AB8E51", bg: "from-[#AB8E51]/20 to-[#AB8E51]/5" },
    { title: "Estimated Hours Saved", value: isLoading ? "-" : Math.floor((chatHistory.length + emailCount) * 1.2).toString(), icon: Activity, color: "#BAAEAB", bg: "from-[#BAAEAB]/20 to-[#BAAEAB]/5" },
  ];

  // Map real chat history to the recent activities array
  const recentActivities = chatHistory.slice(0, 5).map((session: any) => ({
    type: "chat",
    id: session.id,
    title: session.title || "Legal AI Chat Session",
    time: new Date(session.created_at).toLocaleDateString(),
    icon: MessageSquare,
    color: "#AB8E51"
  }));

  if (recentActivities.length === 0 && !isLoading) {
    recentActivities.push({
      type: "none",
      id: "none",
      title: "No recent activities found",
      time: "Start a chat to see history",
      icon: Clock,
      color: "#BAAEAB"
    });
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#FAFAFA] to-[#F5F0E0] overflow-y-auto pb-10">
      {/* Top Header & Search Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E8DCC8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, Legal Team</h1>
            <p className="text-sm text-gray-500 mt-1">Here is what's happening with your intelligence system today.</p>
          </div>
        </div>
      </div>

      {/* Employee Strategy Presentation Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#806B64] to-[#5A4B46] text-white p-10 shadow-xl border border-[#D4C9B0]/20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#AB8E51]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-[#FFD42D]" /> Internal Strategy Initiative
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight flex items-center gap-3">
              Empowering Our Legal Operations
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-8 font-light">
              Our core strategy is to equip employees with intelligent, instant-access tools that eliminate administrative bottlenecks. By centralizing knowledge and automating routine communications, we enable our team to focus on what truly matters: <strong className="text-white font-semibold">strategic legal analysis and high-value decision making.</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/knowledge-base" className="px-6 py-3 bg-[#FFD42D] text-gray-900 font-semibold rounded-xl hover:bg-white transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300 flex items-center gap-2">
                Explore Knowledge Base <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/ai-assistant" className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-300 flex items-center gap-2">
                Start a New Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* Quick Actions Bar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#AB8E51]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link to="/emails" className="group block relative overflow-hidden rounded-2xl bg-white border border-[#D4C9B0] shadow-sm hover:shadow-lg hover:border-[#AB8E51] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD42D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD42D] to-[#F0C020] flex items-center justify-center shadow-inner flex-shrink-0">
                  <Mail className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#AB8E51] transition-colors flex items-center gap-1">
                    Draft an Email <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">Generate professional replies to complex legal inquiries instantly.</p>
                </div>
              </div>
            </Link>

            <Link to="/ai-assistant" className="group block relative overflow-hidden rounded-2xl bg-white border border-[#D4C9B0] shadow-sm hover:shadow-lg hover:border-[#AB8E51] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#AB8E51]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#AB8E51] to-[#806B64] flex items-center justify-center shadow-inner flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#AB8E51] transition-colors flex items-center gap-1">
                    Ask Legal Assistant <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">Chat with your AI to analyze documents and get legal insights.</p>
                </div>
              </div>
            </Link>

            <Link to="/knowledge-base" className="group block relative overflow-hidden rounded-2xl bg-white border border-[#D4C9B0] shadow-sm hover:shadow-lg hover:border-[#AB8E51] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#806B64]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#806B64] to-[#5A4B46] flex items-center justify-center shadow-inner flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#AB8E51] transition-colors flex items-center gap-1">
                    Manage Knowledge <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">Upload and organize documents for the AI to learn from.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Usage Stats - Real Data */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#AB8E51]" /> Live System Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {summaryCards.map((card) => (
                <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8DCC8] flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center flex-shrink-0 border border-white/50 shadow-inner`}>
                    <card.icon className="w-7 h-7" style={{ color: card.color }} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">
                      {isLoading ? <div className="w-8 h-8 rounded-full border-2 border-[#AB8E51] border-t-transparent animate-spin my-1" /> : card.value}
                    </div>
                    <div className="text-sm font-medium text-gray-500 mt-0.5">{card.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity - Real Data */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#AB8E51]" /> Your Recent Sessions
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8DCC8] overflow-hidden">
              <div className="divide-y divide-[#E8DCC8]">
                {isLoading ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                     <div className="w-8 h-8 rounded-full border-2 border-[#AB8E51] border-t-transparent animate-spin mb-3" />
                     <p className="text-sm text-gray-500">Loading your sessions...</p>
                  </div>
                ) : (
                  recentActivities.map((activity: any, index: number) => (
                    <Link
                      to={activity.type === "none" ? "#" : `/ai-assistant`}
                      state={activity.type === "chat" ? { sessionId: activity.id } : undefined}
                      key={index} 
                      className={`flex items-center gap-4 p-4 transition-colors group ${activity.type !== "none" ? "hover:bg-[#FAFAFA] cursor-pointer" : ""}`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: `${activity.color}15` }}>
                        <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-gray-900 truncate ${activity.type !== "none" ? "group-hover:text-[#AB8E51] transition-colors" : ""}`}>
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                      {activity.type !== "none" && (
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#AB8E51] transition-colors flex-shrink-0" />
                      )}
                    </Link>
                  ))
                )}
              </div>
              {!isLoading && recentActivities[0]?.type !== "none" && (
                <div className="bg-gray-50 px-4 py-3 border-t border-[#E8DCC8] text-center">
                  <Link to="/ai-assistant" className="text-sm font-semibold text-[#AB8E51] hover:text-[#806B64] transition-colors">
                    View all history
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
