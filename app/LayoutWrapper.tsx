"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import { SnackbarProvider } from "notistack";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <SnackbarProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className=" w-full ">{children}</main>
            </div>
        </SnackbarProvider>
    );
};

export default LayoutWrapper;
