import React from "react";
import Sidebar from "./components/Sidebar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className=" w-full ">{children}</main>
    </div>
  );
};

export default LayoutWrapper;
