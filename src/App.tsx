import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Security Components
import { ProtectedRoute } from './components/security/ProtectedRoute';
import { RoleBasedRoute } from './components/security/RoleBasedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { TwoFactorAuthPage } from './pages/auth/TwoFactorAuthPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { DocumentChamberPage } from './pages/documents/DocumentChamberPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';
import { VideoCallPage } from './pages/video/VideoCallPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';
import { CalendarPage } from './pages/calendar/CalendarPage';

// Payment Pages
import { PaymentPage } from './pages/payments/PaymentPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-2fa" element={<TwoFactorAuthPage />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route 
              path="entrepreneur" 
              element={
                <RoleBasedRoute allowedRoles={['entrepreneur']} fallbackRole="entrepreneur">
                  <EntrepreneurDashboard />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="investor" 
              element={
                <RoleBasedRoute allowedRoles={['investor']} fallbackRole="investor">
                  <InvestorDashboard />
                </RoleBasedRoute>
              } 
            />
          </Route>
          
          {/* Profile Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="investor/:id" element={<InvestorProfile />} />
          </Route>
          
          {/* Feature Routes - All Protected */}
          <Route 
            path="/investors" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InvestorsPage />} />
          </Route>
          
          <Route 
            path="/entrepreneurs" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EntrepreneursPage />} />
          </Route>
          
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MessagesPage />} />
          </Route>
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<NotificationsPage />} />
          </Route>
          
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DocumentsPage />} />
          </Route>
          <Route 
            path="/documents/chamber" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DocumentChamberPage />} />
          </Route>
          
          <Route 
            path="/video" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VideoCallPage />} />
          </Route>
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SettingsPage />} />
          </Route>
          
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HelpPage />} />
          </Route>
          
          <Route 
            path="/deals" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DealsPage />} />
          </Route>
          
          {/* Chat Routes */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ChatPage />} />
            <Route path=":userId" element={<ChatPage />} />
          </Route>
          
          {/* Calendar Routes */}
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CalendarPage />} />
          </Route>
          
          {/* Payment Routes */}
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PaymentPage />} />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;