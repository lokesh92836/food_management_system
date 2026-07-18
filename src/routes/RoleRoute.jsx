import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const getDefaultDashboardPath = (role) => {
  switch (role) {
    case 'RESTAURANT_OWNER': return '/dashboard/restaurant';
    case 'NGO': return '/dashboard/ngo';
    case 'VOLUNTEER': return '/dashboard/volunteer';
    case 'DELIVERY_PARTNER': return '/dashboard/delivery';
    case 'ADMIN': return '/dashboard/admin';
    default: return '/';
  }
};

const RoleRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    const fallbackPath = user ? getDefaultDashboardPath(user.role) : '/';
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
