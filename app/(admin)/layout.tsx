"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarAdmin } from "./administrateur/_components/sidebar-admin";
import { HeaderAdmin } from "./administrateur/_components/header-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <HeaderAdmin />
      <div className="flex-1 flex overflow-hidden">
        <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300",
            isCollapsed ? "ml-[75px]" : "ml-[190px]"
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}