"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import the hook

export function SiteFooter() {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("footerFraAtlas")}</h3>
                <p className="text-xs text-muted-foreground">{t("footerGovPortal")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footerQuickLinks")}</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/claims" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footerLinkSubmitClaim")}
              </Link>
              <Link href="/atlas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footerLinkViewAtlas")}
              </Link>
              <Link href="/verification" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footerLinkClaimVerification")}
              </Link>
              <Link href="/monitoring" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footerLinkIotMonitoring")}
              </Link>
            </nav>
          </div>

          {/* Government Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footerGovernment")}</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                {t("footerLinkTribalMinistry")}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                {t("footerLinkForestDept")}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
                {t("footerLinkDigitalIndia")}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t("footerContact")}</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@fraatlas.gov.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1800-XXX-XXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-xs text-muted-foreground">
            {t("footerCopyright")}
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("footerLinkPrivacy")}
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("footerLinkTerms")}
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("footerLinkAccessibility")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;