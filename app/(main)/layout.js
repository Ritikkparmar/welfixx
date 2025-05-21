import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
