"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeSwitch() {
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
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Dark mode
      </span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isDark ? 'bg-blue-600' : 'bg-gray-200'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={`
            ${isDark ? 'translate-x-6' : 'translate-x-1'}
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            flex items-center justify-center
          `}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-blue-600" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  )
}
