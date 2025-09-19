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
import { dir } from "i18next";
import { languages } from "./i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "DIGI FRA ATLAS",
  description: "AI-powered FRA Atlas and WebGIS-based Decision Support System",
  generator: "v0.app",
};

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div>
              <SiteHeader />
              {children}
            </div>
          </Suspense>
          <SiteFooter />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
