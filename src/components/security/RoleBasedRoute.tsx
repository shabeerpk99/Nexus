import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Lock } from 'lucide-react';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackRole?: UserRole;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackRole = 'entrepreneur',
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100">
              <Lock size={32} className="text-error-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>

            <p className="text-gray-600">
              This page is only accessible to {allowedRoles.join(' and ')} accounts.
            </p>

            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold capitalize">{user.role}</span>
            </p>

            <div className="pt-4 space-y-2">
              {fallbackRole && user.role !== fallbackRole && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/dashboard/${fallbackRole}`)}
                >
                  Go to {fallbackRole === 'entrepreneur' ? 'Entrepreneur' : 'Investor'} Dashboard
                </Button>
              )}

              {user.role === 'entrepreneur' && !allowedRoles.includes('entrepreneur') && (
                <Button variant="primary" fullWidth onClick={() => navigate('/dashboard/entrepreneur')}>
                  Go to Entrepreneur Dashboard
                </Button>
              )}

              {user.role === 'investor' && !allowedRoles.includes('investor') && (
                <Button variant="primary" fullWidth onClick={() => navigate('/dashboard/investor')}>
                  Go to Investor Dashboard
                </Button>
              )}

              <Button variant="outline" fullWidth onClick={logout}>
                Logout
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
