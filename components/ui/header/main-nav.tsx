"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/login", label: "FRA Claims" },
  { href: "/atlas", label: "FRA Atlas" },
  { href: "/dashboards", label: "IoT Dashboard" },
]

interface MainNavProps {
  variant?: "desktop" | "mobile"
  onClick?: () => void
}

export function MainNav({ variant = "desktop", onClick }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex items-center gap-6",
        variant === "mobile" && "flex-col items-start gap-3 w-full px-3"
      )}
    >
      {links.map((l) => {
        const active = pathname === l.href
        return (
          <Link key={l.href} href={l.href} onClick={onClick} className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative text-sm font-medium transition-colors rounded-lg w-full justify-start px-4 py-2 hover:cursor-pointer",
                active
                  ? "text-green-700 hover:bg-gray-100 hover:text-green-700 dark:bg-green-800/30 dark:text-green-300"
                  : "text-gray-700 hover:text-green-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                variant === "mobile" && "text-left"
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
  )
}
