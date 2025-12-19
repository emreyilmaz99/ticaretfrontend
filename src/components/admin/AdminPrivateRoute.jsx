import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  // Unified token ve user type kontrolü
  const token = localStorage.getItem('auth_token');
  const userType = localStorage.getItem('user_type');

  // Token yoksa veya user type admin değilse login'e yönlendir
  if (!token || userType !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;