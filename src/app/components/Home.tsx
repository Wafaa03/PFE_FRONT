import { Mail, FileText, BookOpen, Activity } from "lucide-react";

export function Home() {
  const summaryCards = [
    { title: "Total Emails Processed", value: "2,847", icon: Mail, color: "#FFD42D" },
    { title: "Contracts Analyzed", value: "156", icon: FileText, color: "#AB8E51" },
    { title: "Documents in Knowledge Base", value: "1,234", icon: BookOpen, color: "#806B64" },
    { title: "Recent Activities", value: "89", icon: Activity, color: "#BAAEAB" },
  ];

  const recentActivities = [
    { action: "Contract analyzed", document: "Vendor Agreement - Tech Corp", time: "2 hours ago" },
    { action: "Email draft generated", document: "Response to compliance inquiry", time: "4 hours ago" },
    { action: "Legal question answered", document: "Data privacy regulation query", time: "5 hours ago" },
    { action: "Contract analyzed", document: "Employment Agreement - Senior Manager", time: "1 day ago" },
    { action: "Email draft generated", document: "External counsel communication", time: "1 day ago" },
    { action: "Legal question answered", document: "Anti-money laundering guidelines", time: "2 days ago" },
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#806B64] mb-2">Legal AI Platform</h1>
        <p className="text-gray-600">Internal legal intelligence and document analysis system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#806B64] mb-6">Activity Timeline</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-[#AB8E51] mt-2"></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{activity.action}</div>
                <div className="text-sm text-gray-600">{activity.document}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
