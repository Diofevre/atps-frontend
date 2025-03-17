"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { routes } from "@/lib/const-admin";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function SidebarAdmin({ isCollapsed: propIsCollapsed, setIsCollapsed: propSetIsCollapsed }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(propIsCollapsed);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsCollapsed(true);
        propSetIsCollapsed(true);
      } else {
        setIsCollapsed(true);
        propSetIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [propSetIsCollapsed]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
      propSetIsCollapsed(true);
    }
  }, [propSetIsCollapsed]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(false);
      propSetIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(true);
      propSetIsCollapsed(true);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed left-0 bottom-0 top-16 z-30 transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-white via-white to-gray-50",
        "border-r border-[#EECE84]/20",
        "shadow-[0_4px_12px_0_rgba(238,206,132,0.08)]",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full flex flex-col">
        {/* Main navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto justify-center">
          <div className="px-3 py-4">
            <nav className="space-y-1.5">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex items-center w-full rounded-lg p-2.5 text-sm font-medium",
                    "transition-all duration-300 ease-in-out",
                    "hover:bg-[#EECE84]/10 hover:text-black",
                    "relative overflow-hidden",
                    pathname === route.href
                      ? "bg-[#EECE84]/15 text-black shadow-sm"
                      : "text-gray-600"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      "transition-all duration-300 ease-in-out",
                      isCollapsed ? "justify-center w-full" : "justify-start w-full"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "flex-shrink-0 h-[18px] w-[18px]",
                        "transition-all duration-300 ease-in-out",
                        pathname === route.href 
                          ? "text-black" 
                          : "text-gray-500 group-hover:text-black",
                        isCollapsed ? "mx-auto" : "mr-3"
                      )}
                    />
                    <span
                      className={cn(
                        "whitespace-nowrap font-medium",
                        "transition-all duration-300 ease-in-out",
                        isCollapsed
                          ? "w-0 opacity-0 translate-x-10 overflow-hidden"
                          : "w-auto opacity-100 translate-x-0"
                      )}
                    >
                      {route.label}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {pathname === route.href && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#EECE84] rounded-r-full" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className={cn(
                        "absolute left-full rounded-md px-2 py-1 ml-6",
                        "bg-[#1a1a1a]/95 text-white text-sm",
                        "invisible opacity-0 -translate-x-3",
                        "transition-all duration-200 ease-in-out",
                        "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0",
                        "shadow-lg backdrop-blur-sm",
                        "lg:hidden"
                      )}
                    >
                      {route.label}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Logout button */}
        <div className="border-t border-[#EECE84]/20 bg-white/50 p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full group flex items-center rounded-lg p-2.5 text-sm font-medium",
              "transition-all duration-300 ease-in-out",
              "text-gray-600 hover:text-red-600 hover:bg-red-50/80",
              "relative overflow-hidden",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut
              className={cn(
                "flex-shrink-0 h-[18px] w-[18px]",
                "transition-all duration-300 ease-in-out",
                "text-gray-500 group-hover:text-red-600",
                isCollapsed ? "mx-auto" : "mr-3"
              )}
            />
            <span
              className={cn(
                "whitespace-nowrap font-medium",
                "transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "w-0 opacity-0 translate-x-10 overflow-hidden"
                  : "w-auto opacity-100 translate-x-0"
              )}
            >
              Déconnexion
            </span>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div
                className={cn(
                  "absolute left-full rounded-md px-2 py-1 ml-6",
                  "bg-[#1a1a1a]/95 text-white text-sm",
                  "invisible opacity-0 -translate-x-3",
                  "transition-all duration-200 ease-in-out",
                  "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0",
                  "shadow-lg backdrop-blur-sm",
                  "lg:hidden"
                )}
              >
                Déconnexion
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}