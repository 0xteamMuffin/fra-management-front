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
        variant === "mobile" && "flex-col items-start gap-2 w-full"
      )}
    >
      {links.map((l) => {
        const active = pathname === l.href
        return (
          <Link key={l.href} href={l.href} onClick={onClick}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm font-medium hover:gradient-green-subtle transition-colors w-full justify-start",
                active ? "text-green-600" : "text-gray-600 hover:text-white",
                variant === "mobile" && "text-left"
              )}
            >
              {l.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
