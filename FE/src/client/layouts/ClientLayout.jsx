import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './ClientLayout.css';

const ClientLayout = () => {
  return (
      <> 
      <Header />
    <div className="client-layout">
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default ClientLayout;
