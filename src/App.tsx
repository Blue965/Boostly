import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { SignupPage } from './pages/auth/SignupPage';
import { PublicPage } from './pages/PublicPage';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { PageEditor } from './pages/dashboard/PageEditor';
import { AppearanceEditor } from './pages/dashboard/AppearanceEditor';
import { AnalyticsDashboard } from './pages/dashboard/AnalyticsDashboard';
import { BoostAIPage } from './pages/dashboard/BoostAIPage';
import { SubscriptionPage } from './pages/dashboard/SubscriptionPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/u/:username" element={<PublicPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedLayout>
                <Routes>
                  <Route path="" element={<DashboardOverview />} />
                  <Route path="page" element={<PageEditor />} />
                  <Route path="appearance" element={<AppearanceEditor />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="boost-ai" element={<BoostAIPage />} />
                  <Route path="subscription" element={<SubscriptionPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;