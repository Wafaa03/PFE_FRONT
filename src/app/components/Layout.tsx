import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, Mail, MessageSquare, FileText, BookOpen, LogOut } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();
  const menuItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/emails", label: "Emails", icon: Mail },
    { path: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },

    { path: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  ];

  const handleLogout = () => {
    localStorage.removeItem("legalAI_authenticated");
    localStorage.removeItem("legalAI_user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#FFF8DC]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-[#806B64]">Legal AI Platform</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#FFD42D] text-[#806B64]"
                        : "text-gray-700 hover:bg-[#BAAEAB]/20"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Legal Team</div>
                <div className="text-xs text-gray-500">Banking Division</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#AB8E51] flex items-center justify-center text-white font-medium">
                LT
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}