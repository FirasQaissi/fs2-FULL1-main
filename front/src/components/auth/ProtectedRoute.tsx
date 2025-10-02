import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../../services/authStorage';
import type { User } from '../../types/auth';
import type { JSX } from 'react';

type Role = 'admin' | 'business' | 'user';

type Props = {
  children: JSX.Element;
  roles?: Role[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const location = useLocation();
  const token = authStorage.getToken();
  const user = authStorage.getUser<User>();

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0) {
    const allowed = roles.some((role) => {
      if (role === 'admin') return !!user.isAdmin;
      if (role === 'business') return !!user.isBusiness;
      if (role === 'user') return user.isUser !== false;
      return false;
    });
    if (!allowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}


