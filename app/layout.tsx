import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/ui/header/site-header";
import { SiteFooter } from "@/components/ui/footer/SiteFooter";
import { AuthProvider } from "@/contexts/auth-context";
import { Suspense } from "react";
import { Toaster } from "sonner";
import I18nProvider from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "DIGI FRA ATLAS",
  description: "AI-powered FRA Atlas and WebGIS-based Decision Support System",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <I18nProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <div>
                <SiteHeader />
                {children}
              </div>
            </Suspense>
            <SiteFooter />
            <Toaster richColors position="top-center" />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
