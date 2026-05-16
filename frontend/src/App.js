import React, { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import ErrorBoundary from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import { isAuthed } from "./lib/auth";
import { validateEnvironment } from "./lib/env";
import { ProjectProvider } from "./lib/projectContext";

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const NewProject = lazy(() => import("./pages/NewProject"));
const Workspace = lazy(() => import("./pages/Workspace"));
const RagPipeline = lazy(() => import("./pages/RagPipeline"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Validation = lazy(() => import("./pages/Validation"));
const Workflow = lazy(() => import("./pages/Workflow"));
const Valuation = lazy(() => import("./pages/Valuation"));
const Reports = lazy(() => import("./pages/Reports"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600 animate-pulse" />
      <p className="text-slate-600 text-sm">Loading page…</p>
    </div>
  </div>
);

// Validate required environment variables on app startup
try {
  validateEnvironment();
} catch (err) {
  console.error("Environment validation failed:", err.message);
}

const Protected = ({ children }) => {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <ProjectProvider>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              <Route path="/" element={<Navigate to={isAuthed() ? "/dashboard" : "/login"} replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes with lazy loading */}
              <Route 
                path="/dashboard" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Projects />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/projects/new" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <NewProject />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/workspace" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Workspace />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/rag-pipeline" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <RagPipeline />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/chatbot" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Chatbot />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/validation" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Validation />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/workflow" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Workflow />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/valuation" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Valuation />
                    </Suspense>
                  </Protected>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <Protected>
                    <Suspense fallback={<PageLoader />}>
                      <Reports />
                    </Suspense>
                  </Protected>
                } 
              />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ProjectProvider>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
