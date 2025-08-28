import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './ClientLayout.css';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
