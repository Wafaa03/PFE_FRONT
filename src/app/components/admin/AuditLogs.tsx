import { useEffect, useState } from "react";
import { FileText, Download, Search, Info } from "lucide-react";
import { apiFetch, authHeaders } from "../../lib/auth";
import { toast } from "sonner";

interface AuditLog {
  id: number;
  admin_username: string;
  action_type: string;
  target_entity: string;
  target_id: number;
  details: any;
  ip_address: string;
  timestamp: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        action_type: actionType,
        date_from: dateFrom,
        date_to: dateTo,
      });
      const res = await apiFetch(`/admin/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load audit logs");
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setActionTypes(data.action_types || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, actionType, dateFrom, dateTo]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        search,
        action_type: actionType,
        date_from: dateFrom,
        date_to: dateTo,
      });
      
      const response = await fetch(`http://127.0.0.1:5050/admin/audit-logs/export?${params.toString()}`, {
        headers: authHeaders(),
      });
      
      if (!response.ok) throw new Error("Failed to export logs");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "admin_audit_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Logs exported successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setExporting(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("UPDATE") || action.includes("CHANGE")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#BAAEAB]/20 rounded-lg">
            <FileText className="w-6 h-6 text-[#806B64]" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {exporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div> : <Download className="w-4 h-4" />}
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AB8E51] focus:border-[#AB8E51] text-sm outline-none"
            />
          </div>
          <select
            value={actionType}
            onChange={(e) => { setActionType(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#AB8E51] outline-none"
          >
            <option value="">All Actions</option>
            {actionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#AB8E51]"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#AB8E51]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Admin</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB8E51] mx-auto mb-4"></div>
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.admin_username}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${getActionColor(log.action_type)}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {log.target_entity} {log.target_id ? `(#${log.target_id})` : ''}
                  </td>
                  <td className="px-6 py-4">
                    {log.details ? (
                      <div className="relative group inline-block">
                        <button className="text-gray-400 hover:text-blue-600 flex items-center gap-1 text-xs">
                          <Info className="w-4 h-4" /> View Data
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-20 w-64 p-3 bg-gray-900 text-gray-100 rounded-lg shadow-xl text-xs overflow-hidden break-words pointer-events-none">
                          <pre className="whitespace-pre-wrap font-mono text-[10px]">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-500">
            Showing page {page} (Total {total} entries)
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={logs.length < 20} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-white disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
