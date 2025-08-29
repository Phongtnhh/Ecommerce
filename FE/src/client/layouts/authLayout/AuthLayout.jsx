import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <AuthHeader />
      <main className="auth-content">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;