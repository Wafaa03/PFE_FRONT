import { createBrowserRouter, Outlet } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Emails } from "./components/Emails";
import { AIAssistant } from "./components/AIAssistant";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { AdminRoute } from "./components/admin/AdminRoute";
import { Dashboard } from "./components/admin/Dashboard";
import { Users } from "./components/admin/Users";
import { Conversations } from "./components/admin/Conversations";
import { AuditLogs } from "./components/admin/AuditLogs";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Home },
      { path: "emails", Component: Emails },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "knowledge-base", Component: KnowledgeBase },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ),
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "users", Component: Users },
          { path: "conversations", Component: Conversations },
          { path: "audit-logs", Component: AuditLogs },
        ],
      },
    ],
  },
]);
