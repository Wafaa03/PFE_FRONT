import { useEffect, useState } from "react";
import { History, Eye, Trash2, X, Search, Filter } from "lucide-react";
import { apiFetch } from "../../lib/auth";
import { toast } from "sonner";

interface Conversation {
  id: number;
  user_id: number;
  username: string;
  title: string;
  created_at: string;
  message_count: number;
}

interface Message {
  id: number;
  role: string;
  content: string;
  timestamp: string;
}

export function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Conversation | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        date_from: dateFrom,
        date_to: dateTo,
      });
      const res = await apiFetch(`/admin/conversations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = await res.json();
      setConversations(data.conversations);
      setTotal(data.total);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page, search, dateFrom, dateTo]);

  const handleViewMessages = async (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessagesLoading(true);
    try {
      const res = await apiFetch(`/admin/conversations/${conv.id}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data.messages);
    } catch (error: any) {
      toast.error(error.message);
      setSelectedConversation(null);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      const res = await apiFetch(`/admin/conversations/${showDeleteConfirm.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      toast.success("Conversation deleted successfully");
      setShowDeleteConfirm(null);
      if (selectedConversation?.id === showDeleteConfirm.id) {
        setSelectedConversation(null);
      }
      fetchConversations();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#BAAEAB]/20 rounded-lg">
          <History className="w-6 h-6 text-[#806B64]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[70vh]">
        {/* Left Side: List */}
        <div className={`flex flex-col border-r border-gray-100 transition-all duration-300 ${selectedConversation ? 'w-full md:w-1/3 hidden md:flex' : 'w-full'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search titles..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AB8E51] focus:border-[#AB8E51] text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-1/2 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#AB8E51]"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-1/2 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#AB8E51]"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white">
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#AB8E51]"></div>
              </div>
            ) : conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleViewMessages(conv)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-[#FFF8DC] border-l-4 border-l-[#AB8E51]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 truncate pr-2">{conv.title || "New Conversation"}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(conv.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="truncate">@{conv.username}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{conv.message_count} msgs</span>
                </div>
              </div>
            ))}
            {!loading && conversations.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
                <Filter className="w-8 h-8 mb-2 text-gray-300" />
                No conversations match filters.
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
            <span>Total: {total}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="hover:text-gray-900 disabled:opacity-50">Prev</button>
              <button disabled={conversations.length < 20} onClick={() => setPage(p => p + 1)} className="hover:text-gray-900 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>

        {/* Right Side: Messages */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedConversation.title || "New Conversation"}</h2>
                  <p className="text-xs text-gray-500">User: {selectedConversation.username} • {new Date(selectedConversation.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteConfirm(selectedConversation)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messagesLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB8E51]"></div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' ? 'bg-[#AB8E51] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {!messagesLoading && messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-10">No messages in this conversation.</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <Eye className="w-12 h-12 mb-4 text-gray-300" />
              <p>Select a conversation from the list to view its history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Conversation
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">Are you sure you want to delete this conversation?</p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone and will delete all messages within it.</p>
              <div className="pt-6 flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
