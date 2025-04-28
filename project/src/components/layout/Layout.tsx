import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../ui/CartSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;