"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/ui/header/main-nav";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between w-full px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-green text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-wide">VanFRA</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex">
          <MainNav />
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md gradient-green text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">FRA Atlas</h2>
                    <p className="text-sm text-muted-foreground">
                      Government Portal
                    </p>
                  </div>
                </div>
                <MainNav variant="mobile" onClick={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
