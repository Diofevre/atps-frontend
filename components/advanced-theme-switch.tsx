"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function AdvancedThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-sidebar-foreground">
        Dark mode
      </span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300
          ${isDark ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gradient-to-r from-orange-400 to-blue-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          shadow-lg
        `}
        role="switch"
        aria-checked={isDark}
      >
        {/* Background pattern for dark mode */}
        {isDark && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90" />
            {/* Stars pattern */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-80" />
            <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
            <div className="absolute top-3 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
            <div className="absolute top-1 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
            <div className="absolute top-2 left-5 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
          </div>
        )}
        
        {/* Background pattern for light mode */}
        {!isDark && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-300 opacity-90" />
            {/* Cloud pattern */}
            <div className="absolute top-1 right-2 w-2 h-1 bg-white rounded-full opacity-80" />
            <div className="absolute top-2 right-1 w-1.5 h-1 bg-white rounded-full opacity-70" />
          </div>
        )}

        <span
          className={`
            ${isDark ? 'translate-x-6' : 'translate-x-1'}
            inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
            flex items-center justify-center shadow-md
            border border-gray-200
          `}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-blue-600" />
          ) : (
            <Sun className="h-3 w-3 text-orange-500" />
          )}
        </span>
      </button>
    </div>
  )
}
