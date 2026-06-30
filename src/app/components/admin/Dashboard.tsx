import { useEffect, useState } from "react";
import { Users, UserCheck, MessageSquare, MessagesSquare, FileText, Activity } from "lucide-react";
import { apiFetch } from "../../lib/auth";

interface Stats {
  total_users: number;
  active_users: number;
  total_conversations: number;
  total_messages: number;
  total_audit_logs: number;
}

interface AuditLog {
  id: number;
  admin_username: string;
  action_type: string;
  target_entity: string;
  timestamp: string;
}

interface DashboardData {
  stats: Stats;
  recent_activity: AuditLog[];
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiFetch("/admin/dashboard");
        if (!response.ok) throw new Error("Failed to load dashboard data");
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB8E51]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: data?.stats.total_users, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Users", value: data?.stats.active_users, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Conversations", value: data?.stats.total_conversations, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Messages", value: data?.stats.total_messages, icon: MessagesSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Audit Logs", value: data?.stats.total_audit_logs, icon: FileText, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#BAAEAB]/20 rounded-lg">
          <Activity className="w-6 h-6 text-[#806B64]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Admin</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recent_activity.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.admin_username}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize">{log.target_entity}</td>
                </tr>
              ))}
              {data?.recent_activity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
