"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterTagProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  iconColor?: string;
  activeBgColor?: string;
  activeTextColor?: string;
  onClick?: () => void;
}

export const FilterTag = ({
  icon: Icon,
  label,
  active = false,
  iconColor,
  activeBgColor = "bg-[#EECE84]",
  activeTextColor = "text-black",
  onClick,
}: FilterTagProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-row items-center gap-1.5 py-2 px-4 rounded-[12px] transition-colors",
        "text-sm whitespace-nowrap",
        active
          ? `${activeBgColor} ${activeTextColor}`
          : "bg-white/80 dark:bg-transparent border hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4",
          active ? '' : iconColor
        )}
      />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};