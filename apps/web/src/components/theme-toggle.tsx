"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <span className="dark:hidden text-lg">🌙</span>
      <span className="hidden dark:inline text-lg">☀️</span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
