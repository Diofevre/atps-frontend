/* eslint-disable @next/next/no-img-element */
"use client";

import { UserButton } from "@clerk/nextjs";

export function HeaderAdmin() {
  return (
    <div className="bg-white border-b border-[#EECE84]/20 shadow-[0_4px_12px_0_rgba(238,206,132,0.08)]">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center uppercase cursor-pointer">
          <div className="flex items-center group">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-black">
                ATPS
              </span>
              <span className="text-[10px] font-medium text-gray-600">
                Airline Transport Pilot School
              </span>
            </div>
          </div>
        </div>

        {/* Right side - User button */}
        <div className="ml-auto flex items-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
}