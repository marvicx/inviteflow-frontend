import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import { LandingPage } from '@/pages/LandingPage';
import { PricingPage } from '@/pages/PricingPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { InvitationsListPage } from '@/pages/dashboard/InvitationsListPage';
import { CreateInvitationPage } from '@/pages/dashboard/CreateInvitationPage';
import { EditInvitationPage } from '@/pages/dashboard/EditInvitationPage';
import { InvitationDetailPage } from '@/pages/dashboard/InvitationDetailPage';
import { PublicInvitePage } from '@/pages/PublicInvitePage';
import { RsvpPage } from '@/pages/RsvpPage';
import { RsvpConfirmedPage } from '@/pages/RsvpConfirmedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar dashboard />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">{children}</main>
    </div>
  );
}

export default function App() {
  const { token, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) return;
    hasCheckedSession.current = true;

    if (!token && !isAuthenticated) return;

    if (!token) {
      clearAuth();
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(res.data.user, token);
      })
      .catch(() => {
        clearAuth();
      });
  }, [token, isAuthenticated, setUser, clearAuth]);

  return (
    <Routes>
      <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
      <Route path="/pricing" element={<AppLayout><PricingPage /></AppLayout>} />
      <Route path="/templates" element={<AppLayout><TemplatesPage /></AppLayout>} />

      <Route path="/auth/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/auth/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/invitations" element={<ProtectedRoute><DashboardLayout><InvitationsListPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/invitations/new" element={<ProtectedRoute><DashboardLayout><CreateInvitationPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/invitations/:id/edit" element={<ProtectedRoute><DashboardLayout><EditInvitationPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/invitations/:id" element={<ProtectedRoute><DashboardLayout><InvitationDetailPage /></DashboardLayout></ProtectedRoute>} />

      <Route path="/invite/:slug" element={<PublicInvitePage />} />
      <Route path="/invite/:slug/rsvp" element={<RsvpPage />} />
      <Route path="/invite/:slug/confirmed" element={<RsvpConfirmedPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
