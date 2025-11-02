import React from 'react';
import Header from '../ui/Header';

const MasterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default MasterLayout;
