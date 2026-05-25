import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Emails } from "./components/Emails";
import { AIAssistant } from "./components/AIAssistant";
import { ContractAnalysis } from "./components/ContractAnalysis";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
      { path: "contract-analysis", Component: ContractAnalysis },
      { path: "knowledge-base", Component: KnowledgeBase },
    ],
  },
]);
