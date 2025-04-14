import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";
import AppSidebar from "../../../components/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full">{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
