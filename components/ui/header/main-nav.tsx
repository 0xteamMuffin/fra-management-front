"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/atlas", label: "FRA Atlas" },
  { href: "/iot", label: "IoT Dashboard" },
  { href: "/dss", label: "DSS Engine" },
]

interface MainNavProps {
  variant?: "desktop" | "mobile"
  onClick?: () => void
}

export function MainNav({ variant = "desktop", onClick }: MainNavProps) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={cn(
      "flex items-center justify-center w-full",
      variant === "desktop" ? "gap-8" : "flex-col gap-4"
    )}>
      {/* Left side navigation */}
      <nav
        aria-label="Primary"
        className={cn(
          "flex items-center",
          variant === "desktop" ? "gap-6" : "flex-col items-start gap-3 w-full px-3"
        )}
      >
        {links.map((l) => {
          const active = pathname === l.href
          return (
            <Link 
              key={l.href} 
              href={l.href} 
              onClick={onClick} 
              className={cn(
                "w-full",
                variant === "desktop" && "w-auto"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative text-sm font-medium transition-colors rounded-lg justify-start px-4 py-2 hover:cursor-pointer",
                  active
                    ? "text-green-700 hover:bg-gray-100 hover:text-green-700 dark:bg-green-800/30 dark:text-green-300"
                    : "text-gray-700 hover:text-green-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  variant === "mobile" && "text-left w-full",
                  variant === "desktop" && "w-auto"
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Right side login dropdown with proper spacing */}
      <div className={cn(
        "relative",
        variant === "mobile" && "w-full px-3 mt-2"
      )} ref={dropdownRef}>
        <Button 
          className="bg-green-600 text-white hover:bg-green-700 transition-colors w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          Login
          <svg 
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {/* Dropdown */}
        <div 
          className={cn(
            "absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50",
            "transition-all duration-300 ease-in-out",
            isDropdownOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-2 pointer-events-none",
            variant === "mobile" && "right-auto left-0"
          )}
        >
          <div className="py-1">
            <Link 
              href="/login/citizen" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => setIsDropdownOpen(false)}
            >
              Citizen
            </Link>
            <Link 
              href="/login/govt" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => setIsDropdownOpen(false)}
            >
              Govt Official
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}